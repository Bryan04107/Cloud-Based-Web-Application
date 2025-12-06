"use client";

import { useRef, useState, useEffect } from 'react';
import type { Tab } from './tabs-page';
import TextEditorToolbar from './text-editor-toolbar';

interface TabsContentProps {
  tabs: Tab[];
  activeTab: number;
  onContentUpdate: (rawHtml: string) => void;
}

export default function TabsContent({ tabs, activeTab, onContentUpdate }: TabsContentProps) {
  const contentEditorRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLInputElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');

  useEffect(() => {
    const currentTabContent = tabs.find(tab => tab.id === activeTab)?.content || '';
    if (contentEditorRef.current && contentEditorRef.current.innerHTML !== currentTabContent) {
      contentEditorRef.current.innerHTML = currentTabContent;
    }
  }, [activeTab, tabs]);

  const checkFormatting = () => {
    if (document.activeElement === contentEditorRef.current) {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
      const color = document.queryCommandValue('foreColor');
      if (color && color !== 'transparent') {
        const hexColor = rgbToHex(color);
        setSelectedColor(hexColor);
      } else {
        setSelectedColor('#000000');
      }
    }
  };

  const rgbToHex = (rgb: string) => {
    if (rgb.startsWith('#')) return rgb;
    const parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!parts) {
      return '#000000';
    }
    const [, ...rgbValues] = parts;
    const hexParts = rgbValues.map(part => {
      const hex = parseInt(part).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    });

    return '#' + hexParts.join('');
  };

  const resetFormatting = () => {
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setSelectedColor('#000000');
  };

  const handleFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (contentEditorRef.current) {
      contentEditorRef.current.focus();
    }
    checkFormatting();
    if (contentEditorRef.current) {
      onContentUpdate(contentEditorRef.current.innerHTML);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    handleFormat('foreColor', newColor);
  };

  return (
    <div className="flex flex-1 flex-col w-full md:min-w-[17rem] md:w-1/3 md:h-full bg-hover p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center sticky top-0 bg-hover mb-4">
        <h2 className="text-l font-bold whitespace-nowrap pr-4">Tabs Content</h2>
        <TextEditorToolbar
          isBold={isBold}
          isItalic={isItalic}
          isUnderline={isUnderline}
          selectedColor={selectedColor}
          handleFormat={handleFormat}
          onColorChange={handleColorChange}
          colorPickerRef={colorPickerRef}
        />
      </div>
      <div
        ref={contentEditorRef}
        contentEditable="true"
        onInput={(e) => onContentUpdate((e.target as HTMLDivElement).innerHTML)}
        onMouseUp={checkFormatting}
        onKeyUp={checkFormatting}
        onBlur={resetFormatting}
        className="min-h-32 flex-grow p-2 border border-shade rounded-md overflow-auto focus:outline-none"
      />
    </div>
  );
}