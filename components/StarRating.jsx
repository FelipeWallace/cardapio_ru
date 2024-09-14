import React from 'react'

const StarRating = ({ rating, setRating }) => {
    const handleClick = (index) => {
        setRating(index + 1);
    };

    return (
        <div className="flex space-x-1">
            {[...Array(5)].map((star, index) => (
                <svg
                    key={index}
                    onClick={() => handleClick(index)}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-6 h-6 cursor-pointer ${index < rating ? 'text-yellow-500' : 'text-gray-400'}`}
                    fill={index < rating ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke={index < rating ? 'none' : 'currentColor'}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.014 6.167h6.462c.97 0 1.371 1.24.588 1.81l-5.237 3.805 2.014 6.167c.3.921-.755 1.688-1.538 1.218l-5.237-3.805-5.237 3.805c-.783.47-1.838-.297-1.538-1.218l2.014-6.167-5.237-3.805c-.783-.57-.382-1.81.588-1.81h6.462l2.014-6.167z"
                    />
                </svg>
            ))}
        </div>
    );
}

export default StarRating
