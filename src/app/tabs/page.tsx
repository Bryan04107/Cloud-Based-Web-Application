"use client";

import { useState, ChangeEvent, useEffect, useRef } from 'react';

interface Tab {
  id: number;
  title: string;
  content: string;
}

export default function TabsPage() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState(1);
  const [outputHtml, setOutputHtml] = useState('');
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [showTabMenu, setShowTabMenu] = useState(false);
  const [tabToEdit, setTabToEdit] = useState<Tab | null>(null);
  const contentEditorRef = useRef<HTMLDivElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

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
      localStorage.setItem('tabs', JSON.stringify(defaultTabs));
    }
  }, []);

  useEffect(() => {
    if (tabs.length > 0) {
      localStorage.setItem('tabs', JSON.stringify(tabs));
    }
  }, [tabs]);

  useEffect(() => {
    const currentTabContent = tabs.find(tab => tab.id === activeTab)?.content || '';
    if (contentEditorRef.current && contentEditorRef.current.innerHTML !== currentTabContent) {
      contentEditorRef.current.innerHTML = currentTabContent;
    }
  }, [activeTab, tabs]);


  const handleContentUpdate = (rawHtml: string) => {
    const newTabs = tabs.map(tab =>
      tab.id === activeTab ? { ...tab, content: rawHtml } : tab
    );
    setTabs(newTabs);
  };

  const addTab = () => {
    if (tabs.length >= 15) {
      return;
    }
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
    if (tabs.length <= 1) {
      return;
    }

    const newTabs = tabs.filter(tab => tab.id !== tabId);
    
    const deletedTabIndex = tabs.findIndex(tab => tab.id === tabId);
    
    const newActiveTabId = deletedTabIndex > 0 ? tabs[deletedTabIndex - 1].id : newTabs[0].id;
    
    setTabs(newTabs);
    setActiveTab(newActiveTabId);
    closeTabMenu();
  };
  
  const generateHtml = () => {
    const htmlString = `<!DOCTYPE html>
<html>
<head>
  <title>Tabs</title>
  <style>
    .tabs {
      display: flex;
    }
    .tablinks {
      padding: 14px 16px;
      cursor: pointer;
      border: 1px solid #ccc;
      background-color: #f1f1f1;
    }
    .tabcontent {
      display: none;
      padding: 6px 12px;
      border: 1px solid #ccc;
      border-top: none;
    }
  </style>
</head>
<body>
  <div class="tabs">
    ${tabs.map(tab => `<button class="tablinks" onclick="openTab(event, 'tab-${tab.id}')">${tab.title}</button>`).join('\n\t\t\t')}
  </div>
  ${tabs.map(tab => `<div id="tab-${tab.id}" class="tabcontent"><pre>${tab.content}</pre></div>`).join('\n\t\t\t')}
  <script>
    function openTab(evt, tabId) {
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      document.getElementById(tabId).style.display = "block";
      evt.currentTarget.className += " active";
    }
    document.getElementsByClassName("tablinks")[0].click();
  </script>
</body>
</html>`;
    setOutputHtml(htmlString);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputHtml);
    setShowCopyPopup(true);
    setTimeout(() => {
      setShowCopyPopup(false);
    }, 2000);
  };

  const openTabMenu = (tab: Tab) => {
   setTabToEdit(tab);
   setShowTabMenu(true);
  };
  
  const closeTabMenu = () => {
   setShowTabMenu(false);
   setTabToEdit(null);
  };
  
  const handleRenameTab = (newTitle: string) => {
    if (!tabToEdit) return;
    const newTabs = tabs.map(tab => tab.id === tabToEdit.id ? { ...tab, title: newTitle } : tab);
    setTabs(newTabs);
    closeTabMenu();
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

  const checkFormatting = () => {
    if (document.activeElement === contentEditorRef.current) {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
    }
  };

  const handleFormat = (command: string) => {
    document.execCommand(command, false);
    if (contentEditorRef.current) {
      contentEditorRef.current.focus();
    }
    checkFormatting();
    if (contentEditorRef.current) {
      handleContentUpdate(contentEditorRef.current.innerHTML);
    }
  };

  return (
    <div className="container min-w-full px-10 p-4">
      <div className="flex flex-grow h-full justify-between items-start space-x-4">
        <div className="w-1/3 max-w-60 bg-hover p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center sticky top-0 bg-hover pb-2 z-1">
            <h2 className="text-xl font-bold">Tabs Headers:</h2>
            <button onClick={addTab} className="cursor-pointer bg-button text-primary p-1 rounded-md hover:bg-shade">
              [+]
            </button>
          </div>
          <div className="max-h-[calc(100vh-106.74px-55.99px-39.96px-64px)] overflow-y-auto container-scrollbar pr-2 mr-[10px]">
            <ul className="space-y-1">
              {tabs.map(tab => (
                <li key={tab.id} className="flex justify-between items-center group">
                  <div className={`flex justify-between items-center w-full text-left rounded-md transition-colors ${activeTab === tab.id ? 'bg-primary text-background' : 'hover:bg-shade'}`}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex justify-between w-full text-left p-2 rounded-md transition-colors ${activeTab === tab.id ? 'bg-primary text-background' : 'hover:bg-shade'}`}
                    >
                      {tab.title}
                    </button>
                    <button onClick={() => openTabMenu(tab)} className="mx-1 p-1 bg-button text-primary rounded-md hover:bg-shade hidden group-hover:flex">
                     ⚙️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-1 flex-col h-full bg-hover p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center sticky top-0 bg-hover mb-4">
            <h2 className="text-xl font-bold">Tabs Content</h2>
            <div className="text-primary flex space-x-2">
              <button 
                onClick={() => handleFormat('bold')} 
                className={`bg-button px-2 py-1 rounded-md hover:bg-shade font-bold ${isBold ? 'bg-primary text-background' : ''}`}
              >
                B
              </button>
              <button 
                onClick={() => handleFormat('italic')} 
                className={`bg-button px-2 py-1 rounded-md hover:bg-shade italic ${isItalic ? 'bg-primary text-background' : ''}`}
              >
                I
              </button>
              <button 
                onClick={() => handleFormat('underline')} 
                className={`bg-button px-2 py-1 rounded-md hover:bg-shade underline ${isUnderline ? 'bg-primary text-background' : ''}`}
              >
                U
              </button>
            </div>
          </div>
          <div
            ref={contentEditorRef}
            contentEditable="true"
            onInput={(e) => handleContentUpdate((e.target as HTMLDivElement).innerHTML)}
            onMouseUp={checkFormatting}
            onKeyUp={checkFormatting}
            className="flex-grow p-2 border border-shade rounded-md overflow-auto focus:outline-none"
          />
        </div>

        <div className="flex flex-1 max-h-[calc(100vh-106.74px-55.99px-32px)] flex-col w-1/3 h-full bg-hover text-primary p-4 pt-3 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-3">
            <button onClick={generateHtml} className="cursor-pointer font-bold bg-button text-primary px-4 py-2 rounded-md hover:bg-shade">
              Output
            </button>
            <button onClick={copyToClipboard} className="cursor-pointer bg-button text-primary p-2 rounded-md hover:bg-shade">
              📋
            </button>
          </div>
          <pre className="flex-grow p-2 bg-primary text-background overflow-auto container-scrollbar text-sm rounded-md">
            {outputHtml}
          </pre>
        </div>
      </div>
      {showCopyPopup && (
        <div className="fixed bottom-10 right-10 p-2 px-4 rounded-lg bg-green-500 text-white shadow-lg animate-fade-in-out">
          Copied to clipboard!
        </div>
      )}
      {showTabMenu && tabToEdit && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50" onClick={closeTabMenu}>
          <div className="bg-background text-primary p-8 rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Edit Tab Header</h2>
            <input
              type="text"
              value={tabToEdit.title}
              onChange={(e) => setTabToEdit({ ...tabToEdit, title: e.target.value })}
              className="w-full p-2 mb-4 border rounded-md"
            /><div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
              <div className="bg-background text-primary p-8 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-4">Edit Tab Header</h2>
                <input
                  type="text"
                  value={tabToEdit.title}
                  onChange={(e) => setTabToEdit({ ...tabToEdit, title: e.target.value })}
                  className="w-full p-2 mb-4 border rounded-md"
                />
                <div className="flex justify-between space-x-2">
                  <button onClick={() => handleRenameTab(tabToEdit.title)} className="bg-primary text-background px-4 py-2 rounded-md hover:bg-button">
                    Rename
                  </button>
                  <button onClick={() => handleDeleteTab(tabToEdit.id)} disabled={tabs.length <= 1} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50">
                    Delete
                  </button>
                  <div className="flex justify-between space-x-2 px-2">
                    <button onClick={() => moveTab(tabToEdit.id, 'up')} disabled={tabs.findIndex(tab => tab.id === tabToEdit.id) === 0} className="bg-primary text-background px-3.5 py-2 rounded-md hover:bg-button disabled:opacity-50">
                      ▲
                    </button>
                    <button onClick={() => moveTab(tabToEdit.id, 'down')} disabled={tabs.findIndex(tab => tab.id === tabToEdit.id) === tabs.length - 1} className="bg-primary text-background px-3.5 py-2 rounded-md hover:bg-button disabled:opacity-50">
                      ▼
                    </button>
                  </div>
                  <button onClick={closeTabMenu} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}