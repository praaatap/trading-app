import React, { FC, useMemo } from 'react';

interface SmallSparklineProps {
    data: number[];
    isPositive: boolean;
}

export const SmallSparkline: FC<SmallSparklineProps> = React.memo(({ data, isPositive }) => {
    const color = isPositive ? '#16C784' : '#EA3943';
    const points = useMemo(() => 
        data.map((d, i) => `${(i / (data.length - 1)) * 100},${30 - (d / 100) * 25}`).join(' '),
        [data]
    );

    return (
        <svg viewBox="0 0 100 30" className="w-full h-[40px]" preserveAspectRatio="none">
            <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
        </svg>
    );
});