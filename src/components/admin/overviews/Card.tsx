import React from 'react';

interface CardProps {
  title: string;
  count: string | number; // Allow string or number to handle API response
}

const Card: React.FC<CardProps> = ({ title, count }) => {
  return (
    <div className="rounded-md bg-white py-4 px-4 flex items-center gap-2 flex-1">
      <div className="rounded-full h-14 w-14 bg-[#FAFAFA]"></div>
      <div>
        <p className="text-[14px]">{title}</p>
        <p className="text-[20px] font-bold">{count}</p>
      </div>
    </div>
  );
};

export default Card;