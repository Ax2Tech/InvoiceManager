import {MdOutlineReceipt} from "react-icons/md";
import AWS from 'aws-sdk';
import { cache } from 'react'

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});


const dynamoDB = new AWS.DynamoDB.DocumentClient();
export const dynamic = 'force-dynamic'
export const getData = cache(async () => {
    const params = {
        TableName: 'Invoice', // Replace 'Invoices' with your actual table name
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        return data.Items;
    } catch (err) {
        console.error("Error scanning database:", err);
        throw err;
    }
})
export default async function ViewInvoices() {
    const data = await getData()
    const sortedItems = data.sort((a, b) => b.TimeStamp - a.TimeStamp);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">View Invoices</h1>
            <div className="grid grid-cols-4 gap-10">  {/* Setup grid system */}
                {sortedItems.map(item => (
                    <a href={`https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${item.InvoiceId}`}
                       key={item.InvoiceId}
                       target="_blank"
                       rel="noopener noreferrer">
                    <div key={item.InvoiceId} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center space-x-3">
                            <MdOutlineReceipt className="text-xl text-blue-500"/>  {/* Icon */}
                            <strong className="flex-grow">{item.InvoiceName}</strong>
                            <span className="text-sm text-gray-500">{new Date(item.TimeStamp * 1000).toLocaleDateString()}</span>
                        </div>
                    </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
