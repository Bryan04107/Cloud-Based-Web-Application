"use client";

interface TextEditorToolbarProps {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  selectedColor: string;
  handleFormat: (command: string, value?: string) => void;
  onColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colorPickerRef: React.RefObject<HTMLInputElement | null>;
}

export default function TextEditorToolbar({
  isBold,
  isItalic,
  isUnderline,
  selectedColor,
  handleFormat,
  onColorChange,
  colorPickerRef,
}: TextEditorToolbarProps) {
  const handleColorButtonClick = () => {
    colorPickerRef.current?.click();
  };

  return (
    <div className="text-primary flex space-x-2">
      <button
        onClick={() => handleFormat('bold')}
        className={`
          bg-button px-2 py-1 rounded-md hover:bg-shade font-bold
          ${isBold ? 'bg-primary text-background' : ''}
          focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-contrast focus-visible:outline-offset-4
        `}
        aria-label="Bold"
      >
        B
      </button>
      <button
        onClick={() => handleFormat('italic')}
        className={`
          bg-button px-2 py-1 rounded-md hover:bg-shade italic
          ${isItalic ? 'bg-primary text-background' : ''}
          focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-contrast focus-visible:outline-offset-4
        `}
        aria-label="Italic"
      >
        I
      </button>
      <button
        onClick={() => handleFormat('underline')}
        className={`
          bg-button px-2 py-1 rounded-md hover:bg-shade underline
          ${isUnderline ? 'bg-primary text-background' : ''}
          focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-contrast focus-visible:outline-offset-4
        `}
        aria-label="Underline"
      >
        U
      </button>
      <div className="relative flex items-center">
        <button
          onClick={handleColorButtonClick}
          className={`
            bg-button px-2 py-1 rounded-md hover:bg-shade
            focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-contrast focus-visible:outline-offset-4
          `}
          aria-label="Font color"
          style={{ color: selectedColor }}
        >
          A
        </button>
        <input
          type="color"
          value={selectedColor}
          onChange={onColorChange}
          ref={colorPickerRef}
          className="absolute w-0 h-0 opacity-0"
          aria-label="Color Picker"
        />
      </div>
    </div>
  );
}