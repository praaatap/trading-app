import React, { FC } from 'react';

interface Tab {
    id: string;
    label: string;
}

interface TrendingTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export const TrendingTabs: FC<TrendingTabsProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        // Added overflow for horizontal scrolling on small screens
        <div className="w-full overflow-x-auto no-scrollbar">
            <div className="flex items-center space-x-6 sm:space-x-8 border-b border-white/10 mb-6 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`py-3 text-sm font-semibold transition-colors duration-200 border-b-2 whitespace-nowrap
                            ${
                                activeTab === tab.id
                                    ? 'text-white border-amber-400'
                                    : 'text-gray-400 border-transparent hover:text-white'
                            }
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};