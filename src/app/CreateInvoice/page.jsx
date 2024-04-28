'use client'
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

export default function CreateInvoice() {
    const [invoiceData, setInvoiceData] = useState({
        billTo: '',
        date: '',
        notes: '',
        items: [{ itemName: '', quantity: '', pricePer: '' }]
    });

    const handleChange = (event, index) => {
        const { name, value } = event.target;
        if (name === "billTo" || name === "date" || name === "notes") {
            setInvoiceData(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            const items = [...invoiceData.items];
            items[index] = {
                ...items[index],
                [name]: value
            };
            setInvoiceData(prev => ({
                ...prev,
                items
            }));
        }
    };

    const addItem = () => {
        setInvoiceData(prev => ({
            ...prev,
            items: [...prev.items, { itemName: '', quantity: '', pricePer: '' }]
        }));
    };

    const deleteItem = index => {
        setInvoiceData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handlePreview = async () => {
        try {
            // Call the API endpoint to generate the PDF
            const response = await fetch('/api/preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoiceData)  // Assuming 'invoiceData' is your form data state
            });

            if (response.ok) {
                // Convert the response to a Blob
                const blob = await response.blob();
                // Create a URL for the Blob
                const url = window.URL.createObjectURL(blob);
                // Open a new window or tab with the PDF
                window.open(url, '_blank');
            } else {
                // Handle errors if the server response was not OK
                console.error('Failed to generate PDF');
                alert('Failed to generate PDF');
            }
        } catch (error) {
            // Handle any errors that occurred during the fetch operation
            console.error('Error generating PDF', error);
            alert('Error generating PDF');
        }
    };


    const handleSave = async () => {
        // Implement save functionality
    };

    return (
        <div className="p-8 ">
            <h1 className="text-xl font-semibold mb-4">Create Invoice</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                    <label htmlFor="billTo" className="block text-sm font-medium text-gray-700">
                        Bill To
                    </label>
                    <input
                        type="text"
                        id="billTo"
                        name="billTo"
                        value={invoiceData.billTo}
                        onChange={handleChange}
                        className="mt-1 block w-fit px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={invoiceData.date}
                        onChange={handleChange}
                        className="mt-1 block w-fit px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={invoiceData.notes}
                        onChange={handleChange}
                        className="mt-1 block w-96 h-36 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Items
                    </label>
                    {invoiceData.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 mb-2">
                            <input
                                type="text"
                                name="itemName"
                                placeholder="Item Name"
                                value={item.itemName}
                                onChange={e => handleChange(e, index)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <input
                                type="number"
                                name="quantity"
                                placeholder="Quantity"
                                value={item.quantity}
                                onChange={e => handleChange(e, index)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <input
                                type="number"
                                name="pricePer"
                                placeholder="Price per"
                                value={item.pricePer}
                                onChange={e => handleChange(e, index)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <button type="button" onClick={() => deleteItem(index)} className="text-red-500 hover:text-red-700">
                                <FaTrash size={20} />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addItem} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        + Add Item
                    </button>
                </div>
                <div className="mt-4">
                    <button type="button" onClick={handlePreview} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                        Preview PDF
                    </button>
                    <button type="button" onClick={handleSave} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Save to S3
                    </button>
                </div>
            </form>
        </div>
    );
}
