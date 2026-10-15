import React from 'react';
import { TabType } from '../types';

interface NavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  activeCount?: {
    tasks?: number;
    blocked?: number;
  };
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  activeCount,
}) => {
  const tabs: { id: TabType; label: string; icon: string; badge?: number }[] = [
    { id: 'overview', label: 'OVERVIEW', icon: 'grid_view' },
    { id: 'tasks', label: 'TASKS', icon: 'memory', badge: activeCount?.tasks },
    { id: 'activity', label: 'ACTIVITY', icon: 'receipt_long' },
    { id: 'services', label: 'SERVICES', icon: 'hub' },
    { id: 'policies', label: 'POLICIES', icon: 'verified_user' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#0b0f0b]/92 backdrop-blur-xl border-t border-[#272b26] shadow-[0_-1px_12px_rgba(0,0,0,0.6)]">
      <div className="max-w-xl mx-auto flex justify-around items-center h-16 px-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 relative transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-[#70f3be] [filter:drop-shadow(0_0_8px_rgba(80,214,163,0.5))] font-semibold'
                  : 'text-[#bccac0] hover:text-[#e0e4dc]'
              }`}
            >
              <div className="relative">
                <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-[#70f3be] animate-ping" />
                )}
              </div>
              <span className="font-label-caps text-[10px] tracking-wider">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-[#70f3be] shadow-[0_0_6px_#70f3be]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
