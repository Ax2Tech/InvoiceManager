'use client'
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import {router} from "next/client";

export default function CreateInvoice() {
    const [invoiceData, setInvoiceData] = useState({
        billTo: '',
        date: '',
        notes: '',
        items: [{ itemName: '', quantity: '', pricePer: '' }],
        title:''
    });

    const handleChange = (event, index) => {
        const { name, value } = event.target;
        if (name === "billTo" || name === "date" || name === "notes" || name === "title") {
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
            const response = await fetch('/api/preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoiceData)
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                // Create or find an element to display the PDF
                const pdfContainer = document.getElementById('pdfContainer');
                if (!pdfContainer) {
                    console.error('PDF container element not found');
                    return;
                }
                pdfContainer.innerHTML = `<iframe src="${url}" width="100%" height="500px" style="border: none;"></iframe>`;
            } else {
                console.error('Failed to generate PDF');
                alert('Failed to generate PDF');
            }
        } catch (error) {
            console.error('Error generating PDF', error);
            alert('Error generating PDF');
        }
    };



    const handleSave = async () => {
        try {
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoiceData)
            });

            if (response.ok) {
                console.log("Invoice Saved Successfully")
                alert("Successfully Saved to S3");
            } else {
                console.error('Failed to save Invoice');
                alert('Failed to generate PDF');
            }
        } catch (error) {
            console.error('Error generating PDF', error);
            alert('Error generating PDF');
        }
    };

    return (
        <div className="p-8 text-gray-700 bg-gray-200">
            <h1 className="text-xl font-semibold mb-4">Create Invoice</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium">
                        Invoice Name
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={invoiceData.title}
                        onChange={handleChange}
                        className="mt-1 block w-fit px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="billTo" className="block text-sm font-medium">
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
                    <button type="button" onClick={addItem}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-1">
                        + Add Item
                    </button>
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
                            <button type="button" onClick={() => deleteItem(index)}
                                    className="text-red-500 hover:text-red-700">
                                <FaTrash size={20}/>
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <button type="button" onClick={handlePreview}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                        Preview PDF
                    </button>
                    <button type="button" onClick={handleSave}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Save to S3
                    </button>
                </div>
            </form>
            <div id="pdfContainer" className="my-2 w-96"></div>
        </div>
    );
}
