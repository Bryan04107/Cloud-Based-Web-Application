"use client";

import { useState } from 'react';
import type { Tab } from './tabs-page';

interface TabsOutputProps {
  tabs: Tab[];
}

export default function TabsOutput({ tabs }: TabsOutputProps) {
  const [outputHtml, setOutputHtml] = useState('');
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);

  const generateHtml = () => {
    const htmlString = `<!DOCTYPE html>
<html>
<head>
  <title>Tabs</title>
</head>
<body style="font-family: sans-serif; margin: 0; padding: 0; background-color: #f4f4f9;">
  <div style="width: 95vw; height: 91vh; margin: 4.5vh 2.5vw; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; display: flex;">
    <div style="display: flex; flex-direction: column; border-right: 2px solid #e0e0e0; background-color: #fafafa; width: 20%; overflow-y: scroll;">
      ${tabs.map((tab, index) => {
        const isActive = index === 0;
        const buttonStyle = `
          padding: 15px 25px;
          cursor: pointer;
          border: none;
          background-color: ${isActive ? '#e0e0e0' : 'transparent'};
          font-weight: 600;
          color: #555;
          transition: background-color 0.3s, color 0.3s;
          text-align: left;
          white-space: normal;
          word-break: break-all;
        `.replace(/\s+/g, ' ').trim();
        return `<button role="tab" onclick="openTab(event, 'tab-${tab.id}')" aria-controls="tab-${tab.id}" aria-selected="${isActive}" style="${buttonStyle}">${tab.title}</button>`;
      }).join('\n      ')}
    </div>
    <div style="width: 80%; flex-grow: 1; padding: 10px 20px; overflow-y: scroll;">
      ${tabs.map((tab, index) => {
        const contentStyle = `
          display: ${index === 0 ? 'block' : 'none'};
          padding: 20px;
        `.replace(/\s+/g, ' ').trim();
        const preStyle = `
          white-space: pre-wrap;
          word-break: break-all;
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 6px;
          line-height: 1.6;
        `.replace(/\s+/g, ' ').trim();
        return `<div id="tab-${tab.id}" role="tabpanel" aria-labelledby="tab-button-${tab.id}" style="${contentStyle}"><pre style="${preStyle}">${tab.content}</pre></div>`;
      }).join('\n    ')}
    </div>
  </div>
  <script>
    function openTab(evt, tabId) {
      var i, tabcontent, tablinks;
      tabcontent = document.querySelectorAll('[id^="tab-"]');
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.querySelectorAll('button[onclick^="openTab"]');
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "transparent";
        tablinks[i].style.color = "#555";
      }
      document.getElementById(tabId).style.display = "block";
      evt.currentTarget.style.backgroundColor = "#e0e0e0";
      evt.currentTarget.style.color = "#000";
    }
    document.querySelector('button[onclick^="openTab"]').click();
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

  const downloadHtml = () => {
    const blob = new Blob([outputHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Hello.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowDownloadPopup(true);
    setTimeout(() => {
      setShowDownloadPopup(false);
    }, 2000);
  };

  return (
    <div className="flex flex-1 flex-col w-full md:w-1/3 md:h-full md:max-h-full bg-hover text-primary p-4 pt-3 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-3 space-x-4">
        <button
          onClick={generateHtml}
          className="
            cursor-pointer font-bold bg-button text-primary px-4 py-2 rounded-md text-l hover:bg-shade
            focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-contrast focus-visible:outline-offset-4"
          aria-label="Generate HTML Output">
          Output
        </button>
        <div className="flex justify-between items-center space-x-2">
          <button
            onClick={copyToClipboard} className="cursor-pointer bg-button text-primary p-2 rounded-md hover:bg-shade
            focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-contrast focus-visible:outline-offset-4"
            aria-label="Copy Output to Clipboard">
            📋
          </button>
          <button
            onClick={downloadHtml} className="cursor-pointer bg-button text-primary p-2 rounded-md hover:bg-shade
            focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-contrast focus-visible:outline-offset-4"
            aria-label="Download HTML file">
            ⬇️
          </button>
        </div>
      </div>
      <pre className="flex-grow p-2 min-h-32 bg-primary text-background overflow-auto container-scrollbar text-sm rounded-md">
        {outputHtml}
      </pre>
      {showCopyPopup && (
        <div className="fixed bottom-10 right-10 p-2 px-4 rounded-lg bg-green-500 text-white shadow-lg animate-fade-in-out">
          Copied to clipboard!
        </div>
      )}
      {showDownloadPopup && (
        <div className="fixed bottom-10 right-10 p-2 px-4 rounded-lg bg-green-500 text-white shadow-lg animate-fade-in-out">
          Download successful!
        </div>
      )}
    </div>
  );
}