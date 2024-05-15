import {MdOutlineReceipt} from "react-icons/md";


async function getData() {
    try{
        const res = await fetch('https://invoices.ax2tech.com/api/getInvoices', { next: { tags: ['invoices'] } })
        if (!res.ok) {
            console.log('Failed to fetch')
            return [{
                InvoiceName: 'Fetch Failed',
                TimeStamp: 1715797348,
                InvoiceId: 'Sample'
            }]
        }
        else{
            return res.json()
        }
    }
    catch (err){
        console.log(err)
    }
}

export default async function ViewInvoices() {
    const data = await getData()
    const sortedItems = await data.sort((a, b) => b.TimeStamp - a.TimeStamp);

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
