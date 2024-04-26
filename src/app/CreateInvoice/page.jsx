'use client'
import { useState } from 'react';

export default function CreateInvoice() {
    const [invoiceData, setInvoiceData] = useState({
        name: '',
        date: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInvoiceData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePreview = async () => {
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
            window.open(url, '_blank');
        }
    };

    const handleSave = async () => {
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(invoiceData)
        });
        if (response.ok) {
            alert('Invoice saved successfully!');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-xl font-semibold mb-4">Create Invoice</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={invoiceData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button type="button" onClick={handlePreview} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                    Preview PDF
                </button>
                <button type="button" onClick={handleSave} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Save to S3
                </button>
            </form>
        </div>
    );
}
