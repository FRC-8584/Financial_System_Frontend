import React, { useState, useEffect } from "react";

export function Tabs({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="flex border-b mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`px-4 py-2 font-bold ${
            activeTab === tab.value
              ? "border-b-4 border-black-500 text-black-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}