import {PDFDocument, rgb, StandardFonts} from "pdf-lib";
import {v4 as uuidv4} from "uuid";
import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function POST(req){
   try{
       const uuid =  await uuidv4();
       const invoiceFile = await InvoiceGen(await req.json(), uuid);
       const prom = await uploadPdfToS3(invoiceFile, uuid)
       return new Response(null, {
           status: 200,  // HTTP status code
           statusText: 'Success'
       });
   }
   catch (err){
       console.log("Failed to Save to S3")
       console.log(err)
       return new Response(null, {
           status: 500,
           statusText: 'Internal Server Error'
       });
   }

}

async function addItemToDynamoDBTable(item) {
    const params = {
        TableName: process.env.DYNAMO_TABLE,
        Item: item
    };

    try {
        await dynamoDB.put(params).promise();
        console.log('Item added successfully:', item);
    } catch (error) {
        console.error('Error adding item to DynamoDB:', error);
    }
}

async function uploadPdfToS3(fileContent, key) {
    // Retrieve the bucket name from environment variables
    const bucketName = process.env.AWS_BUCKET_NAME;

    // Set up the upload parameters for a PDF file
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
        ContentType: 'application/pdf',
    };

    try {
        // Upload file using the s3.upload method
        const data = await s3.upload(params).promise();
        console.log(`PDF uploaded successfully at ${data.Location}`);
        return data;
    } catch (error) {
        console.error('Error uploading PDF:', error);
        throw error;
    }
}

async function InvoiceGen(data, invoiceId) {  // Assuming logob64 is passed as a parameter
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const page = pdfDoc.addPage([648, 792]);
    const { width, height } = page.getSize();

    // Generate UUID and place it in the top left corner
    const text = `Invoice ID: ${invoiceId}`
    const fontSize = 12
    const textWidth = timesRomanFont.widthOfTextAtSize(text, fontSize)+5;
    page.drawText(text, {
        x: width - textWidth,
        y: height -12,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });

    // Optionally add a logo - assuming you have a URL or a buffer of the logo
    // Here we simulate adding an image; ensure you have the image data as a Uint8Array
    try {
        // Decode base64 to a Uint8Array
        const imageBytes = null;

        // Embed the image from the Uint8Array
        const logoImage = await pdfDoc.embedPng(imageBytes);
        const { width, height } = page.getSize();

        page.drawImage(logoImage, {
            x: 10,
            y: height - 180,
            width: 250,
            height: 250
        });
    } catch (e) {
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        page.drawText('Ax2 Technologies', {
            x: 10,
            y: height - timesRomanFont.heightAtSize(30),
            size: 30,
            width: 250,
            height: 250
        });
    }

    // Bill To information
    page.drawText(`Bill To: ${data.billTo}`, {
        x: 50,
        y: height - 130,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });

    // Draw a table for items - this is a basic implementation
    let yPosition = height - 150;
    data.items.forEach((item, index) => {
        const itemY = yPosition - (15 * index);
        page.drawText(`Item: ${item.itemName} - Quantity: ${item.quantity} - Price per item: $${item.pricePer}`, {
            x: 50,
            y: itemY,
            size: 10,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        });
    });

    // Calculate total owed
    const total = data.items.reduce((acc, item) => acc + (item.quantity * item.pricePer), 0);
    page.drawText(`Total Owed: $${total.toFixed(2)}`, {
        x: 50,
        y: yPosition - (15 * data.items.length + 20),
        size: 12,
        font: timesRomanFont,
        color: rgb(1, 0, 0),
    });
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}
