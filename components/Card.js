import React from 'react';

const Card = ({ title, value, subValue, icon: Icon, colorClass }) => (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-slate-700 transition-colors">
        <div className={`p-3 rounded-lg bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
            <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
        <div>
            <h3 className="text-slate-400 text-xs uppercase font-semibold tracking-wider">{title}</h3>
            <div className="text-xl font-bold text-white mt-1">{value}</div>
            {subValue && <div className={`text-xs mt-1 ${subValue.includes('+') ? 'text-green-400' : 'text-red-400'}`}>{subValue}</div>}
        </div>
    </div>
);

export default Card;
