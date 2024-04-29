import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { v4 as uuidv4 } from 'uuid';
import * as fs from "fs";

export async function POST(req){
    try {
        const pdfBlob = await InvoiceGen(await req.json())
        // Create a Response object with the Blob
        return new Response(pdfBlob, {
            status: 200,  // HTTP status code
            headers: {
                'Content-Type': 'application/pdf'
            }
        });
    } catch (error) {
        console.error('Failed to create PDF:', error);
        return new Response(null, {
            status: 500,
            statusText: 'Internal Server Error'
        });
    }
}

async function InvoiceGen(data) {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const page = pdfDoc.addPage([648, 792]);
    const { width, height } = page.getSize();

    // Generate UUID and place it in the top left corner
    const invoiceId = uuidv4();
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
        // Replace 'public/ax2logo.png' with the correct path to your image file
        const imageUrl = 'ublic/ax2logo.png';
        const imageBytes = fs.readFileSync(imageUrl);

        // Embed the PNG image into the PDF
        const logoImage = await pdfDoc.embedPng(imageBytes);
        page.drawImage(logoImage, {
            x: 10, // Position the image 150 points from the right edge
            y: height - 180, // Position the image 50 points from the top edge
            width: 250,     // Set the image width to 100 points
            height: 250      // Set the image height to 50 points
        });
    } catch (e) {
        page.drawText('Ax2 Technologies', {
            x: 10, // Position the image 150 points from the right edge
            y: height - timesRomanFont.heightAtSize(30),
            size: 30,
            width: 250,     // Set the image width to 100 points
            height: 250      // Set the image height to 50 points
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

    // Serialize the PDF document to bytes (Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Convert the Uint8Array to a Blob
    return new Blob([pdfBytes], {type: 'application/pdf'});
}

