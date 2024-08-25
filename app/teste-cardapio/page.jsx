'use client'

import { useState, useEffect } from 'react';

const menu = {
    Monday: ['Pasta', 'Salad', 'Soup'],
    Tuesday: ['Steak', 'Fries', 'Coleslaw'],
    Wednesday: ['Chicken', 'Rice', 'Vegetables'],
    Thursday: ['Fish', 'Chips', 'Peas'],
    Friday: ['Pizza', 'Wings', 'Garlic Bread'],
    Saturday: ['Burgers', 'Onion Rings', 'Milkshake'],
    Sunday: ['Roast Beef', 'Mashed Potatoes', 'Gravy']
};

const daysOfWeek = Object.keys(menu);

export default function MenuCarousel() {
    const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);

    // Função para obter o dia da semana atual
    const getCurrentDay = () => {
        const today = new Date();
        const dayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        return daysOfWeek[dayIndex === 0 ? 6 : dayIndex - 1]; // Ajusta Sunday para ser o último item
    };

    useEffect(() => {
        setSelectedDay(getCurrentDay());
    }, []);

    const handleNextDay = () => {
        const currentIndex = daysOfWeek.indexOf(selectedDay);
        const nextIndex = (currentIndex + 1) % daysOfWeek.length;
        setSelectedDay(daysOfWeek[nextIndex]);
    };

    const handlePreviousDay = () => {
        const currentIndex = daysOfWeek.indexOf(selectedDay);
        const prevIndex = (currentIndex - 1 + daysOfWeek.length) % daysOfWeek.length;
        setSelectedDay(daysOfWeek[prevIndex]);
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center mb-4">
                Cardápio da Semana
            </h2>
            <div className="flex justify-between items-center mb-4">
                <button 
                    onClick={handlePreviousDay} 
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                    Anterior
                </button>
                <span className="text-xl font-semibold">{selectedDay}</span>
                <button 
                    onClick={handleNextDay} 
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                    Próximo
                </button>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2">Menu de {selectedDay}</h3>
                <ul className="list-disc list-inside">
                    {menu[selectedDay].map((item, index) => (
                        <li key={index} className="text-gray-700">{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
