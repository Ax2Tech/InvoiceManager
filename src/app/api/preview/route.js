import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { v4 as uuidv4 } from 'uuid';

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
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Generate UUID and place it in the top left corner
    const invoiceId = uuidv4();
    page.drawText(`Invoice ID: ${invoiceId}`, {
        x: 50,
        y: height - 50,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });

    // Optionally add a logo - assuming you have a URL or a buffer of the logo
    // Here we simulate adding an image; ensure you have the image data as a Uint8Array
    try {
        const imageUrl = ''; // Replace with path to your image buffer
        const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
        const logoImage = await pdfDoc.embedPng(imageBytes);
        page.drawImage(logoImage, {
            x: width - 150,
            y: height - 50,
            width: 100,
            height: 50
        });
    }
    catch{
        console.log("NO")
    }

    // Bill To information
    page.drawText(`Bill To: ${data.billTo}`, {
        x: 50,
        y: height - 100,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0.2, 0.85),
    });

    // Draw a table for items - this is a basic implementation
    let yPosition = height - 130;
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

