
'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

type EmiResultChartProps = {
    data: {
        name: string;
        value: number;
    }[];
};

const COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))'];

export function EmiResultChart({ data }: EmiResultChartProps) {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })} />
                 <legend content={() => (
                     <div className="flex justify-center items-center gap-4 text-xs mt-2">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary"></span> Principal</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-destructive"></span> Interest</div>
                    </div>
                 )} />
            </PieChart>
        </ResponsiveContainer>
    );
}


    