import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
    return (
        <div className={twMerge('bg-white rounded-xl shadow-sm border border-slate-100 p-6', className)} {...props}>
            {children}
        </div>
    );
};
