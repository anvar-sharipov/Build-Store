import React from "react";

const HeaderForTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-300 dark:border-gray-700 px-4 py-3">
      <div className="flex justify-center gap-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition 
            ${
              isActive
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HeaderForTabs;
