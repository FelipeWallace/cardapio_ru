'use client'

import { useState } from 'react';

export default function Home() {
    const [data, setData] = useState(null);

    const handleDateChange = (e) => {
        setData(e.target.value);
    };

    return (
        <div className="p-6">
            <label htmlFor="datePicker" className="block text-lg font-medium text-gray-700 mb-2">
                Selecione uma data:
            </label>
            <input 
                id="datePicker"
                type="date" 
                value={data} 
                onChange={handleDateChange}
                className="border border-gray-300 rounded px-3 py-2"
            />
            {data && (
                <p className="mt-4">
                    Data selecionada: {new Date(data + 'T00:00:00').toLocaleDateString()}
                </p>
            )}
        </div>
    );
}