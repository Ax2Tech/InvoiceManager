import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function POST(req){
    try {
        const pdfblob = await InvoiceGen(await req.json())
        // Create a Response object with the Blob
        return new Response(pdfblob, {
            status: 200,  // HTTP status code
            headers: {
                'Content-Type': 'application/pdf',
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


async function InvoiceGen(data) {  // Assuming logob64 is passed as a parameter
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const page = pdfDoc.addPage([648, 792]);
    const { width, height } = page.getSize();

    // Optionally add a logo - assuming you have a URL or a buffer of the logo
    // Here we simulate adding an image; ensure you have the image data as a Uint8Array
    try {
        // Decode base64 to a Uint8Array
        const imageBytes = null

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
    return new Blob([pdfBytes]);
}


