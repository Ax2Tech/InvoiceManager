// import AWS from 'aws-sdk';
//
// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION
// });
//
//
// const dynamoDB = new AWS.DynamoDB.DocumentClient();
//
// export async function GET(req){
//     try {
//         const items= await scanAllRecords();
//         const body = {
//             invoices: items
//         }
//         return new Response(JSON.stringify(body), {
//             status: 200,  // HTTP status code
//             statusText: 'Success',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });
//     }
//     catch (err){
//         return new Response(null, {
//             status: 500,  // HTTP status code
//             statusText: 'Internal Server Error',
//         });
//     }
//
//
// }
//
// async function scanAllRecords() {
//     const params = {
//         TableName: 'Invoice', // Replace 'Invoices' with your actual table name
//     };
//
//     try {
//         const data = await dynamoDB.scan(params).promise();
//         return data.Items;
//     } catch (err) {
//         console.error("Error scanning database:", err);
//         throw err;
//     }
// }