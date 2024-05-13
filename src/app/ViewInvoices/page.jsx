import {MdOutlineReceipt} from "react-icons/md";

async function getData() {
    const res = await fetch('http://localhost:3000/api/getInvoices')


    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return await res.json();
}
export default async function ViewInvoices() {
    const data = await getData()
    const sortedItems = data.invoices.sort((a, b) => b.TimeStamp - a.TimeStamp);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">View Invoices</h1>
            <div className="grid grid-cols-4 gap-10">  {/* Setup grid system */}
                {sortedItems.map(item => (
                    <div key={item.InvoiceId} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center space-x-3">
                            <MdOutlineReceipt className="text-xl text-blue-500"/>  {/* Icon */}
                            <strong className="flex-grow">{item.InvoiceName}</strong>
                            <span className="text-sm text-gray-500">{new Date(item.TimeStamp * 1000).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
