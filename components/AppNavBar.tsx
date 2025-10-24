
import React from 'react';
import { motion } from 'framer-motion';
import { APP_VIEWS } from '../constants';
import type { AppViewName } from '../types';

interface AppNavBarProps {
  currentView: AppViewName;
  onSetView: (view: AppViewName) => void;
}

const AppNavBar: React.FC<AppNavBarProps> = ({ currentView, onSetView }) => {
  return (
    <nav className="mb-6 bg-base2 rounded-sm border-2 border-base01 p-3 shadow-[4px_4px_0px_#93a1a1]">
      <div className="flex flex-wrap gap-2">
        {APP_VIEWS.map((view) => {
          const Icon = view.icon;
          const isActive = currentView === view.name;
          return (
            <motion.button
              key={view.name}
              onClick={() => onSetView(view.name)}
              whileHover={{ y: -2 }}
              whileTap={{ y: 1 }}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-sm border-2 font-bold
                transition-all
                ${isActive
                  ? 'bg-base02 text-base3 border-base02 shadow-[2px_2px_0px_#586e75]'
                  : 'bg-base3 text-base01 border-base1 hover:border-base01 hover:text-base02'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{view.name}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default AppNavBar;
