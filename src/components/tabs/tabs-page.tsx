"use client";

import { useState, useEffect } from 'react';
import TabsHeader from './tabs-header';
import TabsContent from './tabs-content';
import TabsOutput from './tabs-output';

export interface Tab {
  id: number;
  title: string;
  content: string;
}

export default function TabsPage() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    const savedTabs = localStorage.getItem('tabs');
    if (savedTabs) {
      const parsedTabs: Tab[] = JSON.parse(savedTabs);
      setTabs(parsedTabs);
      if (parsedTabs.length > 0) {
        setActiveTab(parsedTabs[0].id);
      }
    } else {
      const defaultTabs = [{ id: 1, title: 'Step 1', content: 'Step 1:' }];
      setTabs(defaultTabs);
    }
  }, []);

  useEffect(() => {
    if (tabs.length > 0) {
      localStorage.setItem('tabs', JSON.stringify(tabs));
    }
  }, [tabs]);

  const handleContentUpdate = (rawHtml: string) => {
    const newTabs = tabs.map(tab =>
      tab.id === activeTab ? { ...tab, content: rawHtml } : tab
    );
    setTabs(newTabs);
  };

  const addTab = () => {
    if (tabs.length >= 15) return;
    const newTabId = tabs.length > 0 ? Math.max(...tabs.map(t => t.id)) + 1 : 1;
    const newTab = {
      id: newTabId,
      title: `Step ${newTabId}`,
      content: `Step ${newTabId}:`
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTabId);
  };
  
  const handleDeleteTab = (tabId: number) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    const deletedTabIndex = tabs.findIndex(tab => tab.id === tabId);
    const newActiveTabId = deletedTabIndex > 0 ? tabs[deletedTabIndex - 1].id : newTabs[0].id;
    setTabs(newTabs);
    setActiveTab(newActiveTabId);
  };
  
  const handleRenameTab = (id: number, newTitle: string) => {
    const newTabs = tabs.map(tab => tab.id === id ? { ...tab, title: newTitle } : tab);
    setTabs(newTabs);
  };

  const moveTab = (tabId: number, direction: 'up' | 'down') => {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) return;
    const newTabs = [...tabs];
    if (direction === 'up' && tabIndex > 0) {
      [newTabs[tabIndex - 1], newTabs[tabIndex]] = [newTabs[tabIndex], newTabs[tabIndex - 1]];
    } else if (direction === 'down' && tabIndex < newTabs.length - 1) {
      [newTabs[tabIndex], newTabs[tabIndex + 1]] = [newTabs[tabIndex + 1], newTabs[tabIndex]];
    }
    setTabs(newTabs);
  };

  return (
    <div className="flex flex-grow md:flex-row flex-col h-[calc(100vh-113.47px-55.99px-31.99px)] justify-between items-start md:space-y-0 space-y-4 md:space-x-4 space-x-0">
      <TabsHeader
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        addTab={addTab}
        deleteTab={handleDeleteTab}
        renameTab={handleRenameTab}
        moveTab={moveTab}
      />
      <TabsContent
        tabs={tabs}
        activeTab={activeTab}
        onContentUpdate={handleContentUpdate}
      />
      <TabsOutput tabs={tabs} />
    </div>
  );
}