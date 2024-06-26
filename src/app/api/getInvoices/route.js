import AWS from "aws-sdk";


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function GET(req){
    const params = {
        TableName: 'Invoice', // Replace 'Invoices' with your actual table name
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        return new Response(JSON.stringify(data.Items), {
            status: 200,
            statusText: 'Success'
        });
    } catch (err) {
        console.error("Error scanning database:", err);
        return new Response(null, {
            status: 500,
            statusText: 'Internal Server Erroe'
        });
    }
}