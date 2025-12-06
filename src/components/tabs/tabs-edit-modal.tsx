"use client";

import { useState, useRef, useEffect } from 'react';
import type { Tab } from './tabs-page';
import TextEditorToolbar from './text-editor-toolbar';

interface TabsEditModalProps {
  tabToEdit: Tab;
  tabs: Tab[];
  closeModal: () => void;
  deleteTab: (id: number) => void;
  renameTab: (id: number, newTitle: string) => void;
  moveTab: (id: number, direction: 'up' | 'down') => void;
}

const maxCharacterLength = 100;

export default function TabsEditModal({
  tabToEdit,
  tabs,
  closeModal,
  deleteTab,
  renameTab,
  moveTab,
}: TabsEditModalProps) {
  const inputRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const [newTitle, setNewTitle] = useState(tabToEdit.title);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => {
    setNewTitle(tabToEdit.title);
    if (inputRef.current) {
      inputRef.current.innerHTML = tabToEdit.title;
      inputRef.current.focus();
    }
  }, [tabToEdit]);

  const rgbToHex = (rgb: string) => {
    if (rgb.startsWith('#')) return rgb;
      const parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!parts) return '#000000';
      const [, ...rgbValues] = parts;
      const hexParts = rgbValues.map(part => {
      const hex = parseInt(part).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    });
    return '#' + hexParts.join('');
  };

  const checkFormatting = () => {
    if (document.activeElement === inputRef.current) {
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

  const resetFormatting = () => {
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setSelectedColor('#000000');
  };

  const handleFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (inputRef.current) {
      inputRef.current.focus();
      setNewTitle(inputRef.current.innerHTML);
    }
    checkFormatting();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    handleFormat('foreColor', newColor);
  };
  
  const handleRename = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newTitle;
    const plainText = tempDiv.textContent || '';

    if (plainText.length > maxCharacterLength) {
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000);
      return;
    }
    renameTab(tabToEdit.id, newTitle);
    closeModal();
  };

  const handleDelete = () => {
    deleteTab(tabToEdit.id);
    closeModal();
  };

  return (
    <div className="fixed h-full w-full inset-0 flex items-center justify-center z-5 bg-black/50" onClick={closeModal}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-tab-header"
        className="bg-background text-primary p-8 rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4" id="edit-tab-header">Edit Tab Header</h2>
        
        <div className="flex justify-between items-center mb-4 space-x-2">
          <div
            ref={inputRef}
            contentEditable="true"
            onInput={(e) => setNewTitle((e.target as HTMLDivElement).innerHTML)}
            onMouseUp={checkFormatting}
            onKeyUp={checkFormatting}
            onBlur={resetFormatting}
            className="w-[50vw] max-h-[70vh] p-2 border rounded-md"
          />
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
        
        <div className="flex justify-between space-x-2">
          <button
            onClick={handleRename}
            className="bg-primary text-background px-4 py-2 rounded-md hover:bg-button focus:bg-button"
          >
            Rename
          </button>
          <div className="flex justify-between space-x-2 px-2">
            <button
              onClick={() => moveTab(tabToEdit.id, 'up')}
              disabled={tabs.findIndex(tab => tab.id === tabToEdit.id) === 0}
              className="bg-primary text-background px-3.5 py-2 rounded-md hover:bg-button focus:bg-button disabled:opacity-50"
              aria-label="Move Tab Up"
            >
              ▲
            </button>
            <button
              onClick={() => moveTab(tabToEdit.id, 'down')}
              disabled={tabs.findIndex(tab => tab.id === tabToEdit.id) === tabs.length - 1}
              className="bg-primary text-background px-3.5 py-2 rounded-md hover:bg-button focus:bg-button disabled:opacity-50"
              aria-label="Move Tab Down"
            >
              ▼
            </button>
          </div>
          <div className="space-x-2">
            <button
              onClick={handleDelete}
              disabled={tabs.length <= 1}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-800 focus:bg-red-800 disabled:opacity-50"
            >
              Delete
            </button>
            <button onClick={closeModal} className="bg-shade text-white px-4 py-2 rounded-md hover:bg-button focus:bg-button">
              Cancel
            </button>
          </div>
        </div>
      </div>
      {showErrorPopup && (
        <div className="fixed bottom-10 right-10 p-2 px-4 rounded-lg bg-red-500 text-white shadow-lg animate-fade-in-out">
          Title exceeds the maximum of {maxCharacterLength} characters.
        </div>
      )}
    </div>
  );
}