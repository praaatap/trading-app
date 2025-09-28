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
        <div className="flex items-center space-x-6 sm:space-x-8 border-b border-gray-800 mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`py-3 text-sm font-semibold transition-colors duration-200 border-b-2 whitespace-nowrap
                        ${
                            activeTab === tab.id
                                ? 'text-white border-blue-500'
                                : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                        }
                    `}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};