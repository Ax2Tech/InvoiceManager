const AWS = require('aws-sdk');
const s3 = new AWS.S3();
export async function POST(req){

}

async function saveToS3(key, body, contentType) {
    const params = {
        Bucket: process.env.BUCKET_NAME, // The name of the S3 bucket
        Key: key,           // The name of the file to store in S3
        Body: body,         // The file content, in this case, a buffer
        ContentType: contentType, // Set the content type (e.g., 'application/pdf')
    };

    try {
        const data = await s3.upload(params).promise();
        console.log('File uploaded successfully', data);
        return data;
    } catch (err) {
        console.error('File upload failed:', err);
        throw err;
    }
}