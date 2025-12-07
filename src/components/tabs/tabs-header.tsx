"use client";

import { useState } from 'react';
import type { Tab } from './tabs-page';
import TabsEditModal from './tabs-edit-modal';

interface TabsHeaderProps {
  tabs: Tab[];
  activeTab: number;
  setActiveTab: (id: number) => void;
  addTab: () => void;
  deleteTab: (id: number) => void;
  renameTab: (id: number, newTitle: string) => void;
  moveTab: (id: number, direction: 'up' | 'down') => void;
}

export default function TabsHeader({
  tabs,
  activeTab,
  setActiveTab,
  addTab,
  deleteTab,
  renameTab,
  moveTab,
}: TabsHeaderProps) {
  const [showTabMenu, setShowTabMenu] = useState(false);
  const [tabToEdit, setTabToEdit] = useState<Tab | null>(null);

  const openTabMenu = (tab: Tab) => {
    setTabToEdit(tab);
    setShowTabMenu(true);
  };

  const closeTabMenu = () => {
    setShowTabMenu(false);
    setTabToEdit(null);
  };

  return (
    <>
      <div className="flex flex-1 flex-col w-full max-h-68 md:min-w-[12rem] md:max-w-60 md:min-h-full md:max-h-full bg-hover p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center top-0 bg-hover pb-2 z-1">
          <h2 className="text-l font-bold whitespace-nowrap pr-4">Tabs Headers:</h2>
          <button
            onClick={addTab}
            aria-label="Add new tab"
            className="
              cursor-pointer bg-button text-primary p-1 rounded-md hover:bg-shade
              focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-contrast focus-visible:outline-offset-4"
          >
            [+]
          </button>
        </div>
        <div className="max-h-[calc(100vh-106.74px-55.99px-39.96px-64px)] overflow-y-auto container-scrollbar pr-2 mr-[10px]">
          <ul role="tablist" className="space-y-1 p-1">
            {tabs.map(tab => (
              <li key={tab.id} className="flex justify-between items-center group">
                <div className="flex flex-grow flex-col">
                  <div
                    className={`
                      flex justify-between outline outline-transparent items-center w-full text-left rounded-md
                      ${activeTab === tab.id ? 'bg-primary text-background' : 'hover:bg-shade'}
                      focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-contrast focus-visible:outline-offset-4
                    `}
                  >
                    <button
                      role="tab"
                      onClick={() => setActiveTab(tab.id)}
                      aria-controls={`tab-${tab.id}`}
                      aria-selected={activeTab === tab.id}
                      className={`
                        flex w-full text-left p-2 rounded-md break-all
                        ${activeTab === tab.id ? 'bg-primary text-background' : 'hover:bg-shade'}
                        focus-visible:outline-contrast
                      `}
                    >
                      <div dangerouslySetInnerHTML={{ __html: tab.title }}></div>
                    </button>
                    <button
                      onClick={() => openTabMenu(tab)}
                      aria-label={`Options for ${tab.title}`}
                      className="
                        mx-1 p-1 bg-button text-primary rounded-md hover:bg-shade
                        hidden group-hover:flex group-focus-within:flex focus-visible:outline-contrast">
                      ⚙️
                    </button>
                  </div>
                  <div className="mt-1 w-full h-[1px] bg-primary"></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {showTabMenu && tabToEdit && (
        <TabsEditModal
          tabToEdit={tabToEdit}
          tabs={tabs}
          closeModal={closeTabMenu}
          deleteTab={deleteTab}
          renameTab={renameTab}
          moveTab={moveTab}
        />
      )}
    </>
  );
}