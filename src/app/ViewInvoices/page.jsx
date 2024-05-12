import { redirect } from "next/navigation";
import AWS from 'aws-sdk';

// Configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

async function getData(){
    try {
        const { Contents } = await s3.listObjectsV2({
            Bucket: process.env.AWS_BUCKET_NAME,
        }).promise();

        const files = Contents.map(file => ({
            name: file.Key,
            lastModified: file.LastModified,
        }));

        return { files };
    } catch (error) {
        console.error('Error fetching from S3:', error);
        return redirect('/error');
    }
}

export default function ViewInvoices({ data }) {
    const files = getData();
    console.log(files)

    return (
        <div>
            <h1>View Invoices</h1>
            <p>
                bbl drizzy
            </p>
            {/*<ul>*/}
            {/*    {files.map((file, index) => (*/}
            {/*        <li key={index}>*/}
            {/*            {file.name} (Last modified: {new Date(file.lastModified).toLocaleString()})*/}
            {/*        </li>*/}
            {/*    ))}*/}
            {/*</ul>*/}
        </div>
    );
}
