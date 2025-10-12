'use client';
import React from 'react';
import { motion, Variants } from 'framer-motion';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

export const StatCard = ({ title, value, icon, color }: StatCardProps) => (
    <motion.div 
        className="bg-white p-5 rounded-xl shadow-lg flex items-center space-x-4 border border-slate-200/50"
        variants={cardVariants}
        whileHover={{ scale: 1.05, y: -5, boxShadow: "0px 10px 20px -5px rgba(0,0,0,0.1)" }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </motion.div>
);
