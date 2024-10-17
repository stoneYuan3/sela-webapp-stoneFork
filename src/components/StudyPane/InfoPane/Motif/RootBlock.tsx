import React, { useState, useEffect, useContext } from 'react';
import { DEFAULT_COLOR_FILL, DEFAULT_BORDER_COLOR, DEFAULT_TEXT_COLOR, FormatContext } from '../../index';
import { ColorActionType } from "@/lib/types";
import { HebWord } from '@/lib/data';

export const RootBlock = ({
  id, rootWord, count, strongNumber, hebWord
}: {
  id: number,
  rootWord: string | undefined,
  count: number,
  strongNumber: number,
  hebWord: HebWord,
}) => {
  const { ctxSelectedRoots, ctxSetSelectedRoots, ctxRootsColorMap, ctxSetRootsColorMap, ctxColorAction, ctxSelectedColor, ctxSelectedHebWords, ctxSetNumSelectedWords, ctxSetSelectedHebWords } = useContext(FormatContext)
  const [colorFillLocal, setColorFillLocal] = useState(ctxRootsColorMap.get(hebWord.strongNumber)?.colorFill || DEFAULT_COLOR_FILL);
  const [borderColorLocal, setBorderColorLocal] = useState(ctxRootsColorMap.get(hebWord.strongNumber)?.colorBorder || DEFAULT_BORDER_COLOR);
  const [textColorLocal, setTextColorLocal] = useState(ctxRootsColorMap.get(hebWord.strongNumber)?.colorText || DEFAULT_TEXT_COLOR);
  const [selected, setSelected] = useState(false);
  const [selectedHebrewWords, setSelectedHebWords] = useState(ctxSelectedHebWords);

  useEffect(() => {
    const colorConfig = ctxRootsColorMap.get(strongNumber);
    if (colorConfig) {
      setColorFillLocal(colorConfig.colorFill || DEFAULT_COLOR_FILL);
      setBorderColorLocal(colorConfig.colorBorder || DEFAULT_BORDER_COLOR);
      setTextColorLocal(colorConfig.colorText || DEFAULT_TEXT_COLOR);
    }
  }, [ctxRootsColorMap, strongNumber]); // Dependencies include ctxRootsColorMap and strongNumber
  
  const handleClick = (e: React.MouseEvent) => {
    // Check if it's a click event, and not part of a drag
    if (e.type === 'click') {
      setSelected(prevState => !prevState);
      const alreadySelectedRoot = ctxSelectedRoots.includes(strongNumber);
    
      let updatedSelectedRoots;
      if (!selected && !alreadySelectedRoot) {
        // Add strongNumber only if it's not already selected
        updatedSelectedRoots = [...ctxSelectedRoots, strongNumber];
      } else {
        // Remove strongNumber if it's already selected
        updatedSelectedRoots = ctxSelectedRoots.filter(root => root !== strongNumber);
      }

      ctxSetSelectedRoots(updatedSelectedRoots);

      if (!selected) {
        const alreadySelected = ctxSelectedHebWords.some(word => word.strongNumber === strongNumber);
        if (!alreadySelected) {
          const newSelectedHebWords = [...ctxSelectedHebWords, hebWord];
          setSelectedHebWords(newSelectedHebWords);
          ctxSetSelectedHebWords(newSelectedHebWords);
          ctxSetNumSelectedWords(newSelectedHebWords.length);
        }
      } else {
        const newSelectedHebWords = ctxSelectedHebWords.filter(word => word.strongNumber !== strongNumber);
        setSelectedHebWords(newSelectedHebWords);
        ctxSetSelectedHebWords(newSelectedHebWords);
        ctxSetNumSelectedWords(newSelectedHebWords.length);
      }
    }
  };

  useEffect(() => {
    const isSelected = ctxSelectedRoots.includes(strongNumber);
    setSelected(isSelected);
    if (isSelected) {
      const colorConfig = ctxRootsColorMap.get(strongNumber);
      if (colorConfig) {
        setColorFillLocal(colorConfig.colorFill || DEFAULT_COLOR_FILL);
        setBorderColorLocal(colorConfig.colorBorder || DEFAULT_BORDER_COLOR);
        setTextColorLocal(colorConfig.colorText || DEFAULT_TEXT_COLOR);
      }
    }
  }, [ctxSelectedRoots, strongNumber, ctxRootsColorMap]);
  useEffect(() => {
    if (ctxColorAction !== ColorActionType.none && selected) {
      const newMap = new Map(ctxRootsColorMap);
      const colorConfig = newMap.get(strongNumber) || { colorFill: DEFAULT_COLOR_FILL, colorBorder: DEFAULT_BORDER_COLOR, colorText: DEFAULT_TEXT_COLOR };

      if (ctxColorAction === ColorActionType.colorFill && ctxSelectedColor) {
        setColorFillLocal(ctxSelectedColor);
        colorConfig.colorFill = ctxSelectedColor;
      } else if (ctxColorAction === ColorActionType.borderColor && ctxSelectedColor) {
        setBorderColorLocal(ctxSelectedColor);
        colorConfig.colorBorder = ctxSelectedColor;
      } else if (ctxColorAction === ColorActionType.textColor && ctxSelectedColor) {
        setTextColorLocal(ctxSelectedColor);
        colorConfig.colorText = ctxSelectedColor;
      } else if (ctxColorAction === ColorActionType.resetColor) {
        setColorFillLocal(DEFAULT_COLOR_FILL);
        setBorderColorLocal(DEFAULT_BORDER_COLOR);
        setTextColorLocal(DEFAULT_TEXT_COLOR);
        colorConfig.colorFill = DEFAULT_COLOR_FILL;
        colorConfig.colorBorder = DEFAULT_BORDER_COLOR;
        colorConfig.colorText = DEFAULT_TEXT_COLOR;
      }

      newMap.set(strongNumber, colorConfig);
      ctxSetRootsColorMap(newMap);
    }
  }, [ctxColorAction, ctxSelectedColor, selected, strongNumber, ctxRootsColorMap, ctxSetRootsColorMap]);

  return (
    <div className="flex my-1">
      <div
        id={id.toString()}
        key={id}
        className={`wordBlock mx-1 ${selected ? 'rounded border outline outline-offset-1 outline-2 outline-[#FFC300] drop-shadow-md' : 'rounded border outline-offset-[-4px]'}`}
        style={
          {
            background: `${colorFillLocal}`,
            border: `2px solid ${borderColorLocal}`,
            color: `${textColorLocal}`,
          }
        }>
        <span
          className="flex mx-1 my-1"
          onClick={handleClick}
        >
          <span
            className={`flex select-none px-2 py-1 items-center justify-center text-center hover:opacity-60 leading-none text-lg RootBlock`}
            data-clicktype="clickable"
          >{rootWord}</span>
          <span className="flex h-6.5 w-full min-w-6.5 max-w-6.5 items-center justify-center rounded-full bg-[#EFEFEF] text-black text-sm">{count}</span>
        </span>
      </div>
    </div>
  );

}
