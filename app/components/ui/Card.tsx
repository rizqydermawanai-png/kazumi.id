'use client';
import React from 'react';
import { motion } from 'framer-motion';

type CardProps = {
    children: React.ReactNode;
} & React.ComponentProps<typeof motion.div>;

export const Card = ({ children, className = '', ...props }: CardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`bg-white p-6 rounded-xl shadow-lg border border-slate-200/80 ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};
