import React, { useState, useEffect, useContext, useRef } from 'react';
import { LuTextSelect } from "react-icons/lu";
import { IoIosArrowForward, IoIosArrowBack, IoIosArrowDown } from "react-icons/io";
import { DEFAULT_COLOR_FILL, DEFAULT_BORDER_COLOR, FormatContext } from '../index';
import { WordBlock } from './WordBlock';
import { ColorActionType } from "@/lib/types";
import { StropheData } from '@/lib/data';
import { strophesHasSameColor } from "@/lib/utils";
import { updateStropheState } from '@/lib/actions';

export const StropheBlock = ({
    strophe
  }: {
    strophe: StropheData
  }) => {
  
    const { ctxStudyId, ctxIsHebrew, ctxSelectedStrophes, ctxSetSelectedStrophes, ctxSetNumSelectedStrophes, 
      ctxSetSelectedHebWords, ctxSetNumSelectedWords, ctxColorAction, ctxSelectedColor, ctxSetColorFill, ctxSetBorderColor
    } = useContext(FormatContext);
  
    const [selected, setSelected] = useState(false);
    const [expanded, setExpanded] = useState(strophe.expanded != undefined ? strophe.expanded : true);
  
    const [colorFillLocal, setColorFillLocal] = useState(strophe.colorFill || DEFAULT_COLOR_FILL);
    const [borderColorLocal, setBorderColorLocal] = useState(strophe.borderColor || DEFAULT_BORDER_COLOR);
  
    useEffect(() => {
      if (ctxColorAction != ColorActionType.none && selected) {
        if (ctxColorAction === ColorActionType.colorFill && colorFillLocal != ctxSelectedColor && ctxSelectedColor != "") {
          setColorFillLocal(ctxSelectedColor);
          strophe.colorFill = ctxSelectedColor;
        }
        else if (ctxColorAction === ColorActionType.borderColor && borderColorLocal != ctxSelectedColor && ctxSelectedColor != "") {
          setBorderColorLocal(ctxSelectedColor);
          strophe.borderColor = ctxSelectedColor;
        }
        else if (ctxColorAction === ColorActionType.resetColor) {
          if (colorFillLocal != DEFAULT_COLOR_FILL) {
            setColorFillLocal(DEFAULT_COLOR_FILL);
            strophe.colorFill = DEFAULT_COLOR_FILL;
          }
          if (borderColorLocal != DEFAULT_BORDER_COLOR) {
            setBorderColorLocal(DEFAULT_BORDER_COLOR);
            strophe.borderColor = DEFAULT_BORDER_COLOR;  
          }
        }
      }
      if (strophe.colorFill != colorFillLocal) { setColorFillLocal(strophe.colorFill || DEFAULT_COLOR_FILL) }
      if (strophe.borderColor != borderColorLocal) { setBorderColorLocal(strophe.borderColor || DEFAULT_BORDER_COLOR) }
    }, [ctxColorAction, selected, strophe, colorFillLocal, borderColorLocal, ctxSelectedColor]);
    
    const handleStropheBlockClick = () => {
      setSelected(prevState => !prevState);
      (!selected) ? ctxSelectedStrophes.push(strophe) : ctxSelectedStrophes.splice(ctxSelectedStrophes.indexOf(strophe), 1);
      ctxSetSelectedStrophes(ctxSelectedStrophes);
      ctxSetNumSelectedStrophes(ctxSelectedStrophes.length);
      // remove any selected word blocks if strophe block is selected
      ctxSetSelectedHebWords([]);
      ctxSetNumSelectedWords(0);

      ctxSetColorFill(DEFAULT_COLOR_FILL);
      ctxSetBorderColor(DEFAULT_BORDER_COLOR);
      if (ctxSelectedStrophes.length >= 1) {
        const lastSelectedStrophe = ctxSelectedStrophes.at(ctxSelectedStrophes.length-1);
        if (lastSelectedStrophe) {
          strophesHasSameColor(ctxSelectedStrophes, ColorActionType.colorFill) && ctxSetColorFill(lastSelectedStrophe.colorFill || DEFAULT_COLOR_FILL);
          strophesHasSameColor(ctxSelectedStrophes, ColorActionType.borderColor) && ctxSetBorderColor(lastSelectedStrophe.borderColor || DEFAULT_BORDER_COLOR);
        }
      }
    }

    const handleCollapseBlockClick = () => {
      setExpanded(prevState => !prevState);
      updateStropheState(ctxStudyId, strophe.id, !expanded);
      if (expanded) {
        // remove any selected word blocks if strophe block is collapsed
        ctxSetSelectedHebWords([]);
        ctxSetNumSelectedWords(0);        
      }
    }
  
    useEffect(() => {
      setSelected(ctxSelectedStrophes.includes(strophe));
      ctxSetNumSelectedStrophes(ctxSelectedStrophes.length);
    }, [ctxSelectedStrophes, strophe, ctxSetNumSelectedStrophes]);

    return(
      <div 
        key={"strophe_" + strophe.id}
        className={`relative flex-column px-5 py-2 mx-5 my-1 ${selected ? 'rounded border outline outline-offset-1 outline-2 outline-[#FFC300] drop-shadow-md' : 'rounded border'}`}
        style={
          {
            background: `${colorFillLocal}`,
            border: `2px solid ${borderColorLocal}`
          }
        }
      >
        <div
          className={`z-1 absolute top-0 p-[0.5] m-[0.5] bg-transparent ${ctxIsHebrew ? 'left-0' : 'right-0'}`}
          >
        <button
          key={"strophe" + strophe.id + "CollapseButton"}
          className={`p-2 m-1 hover:bg-theme active:bg-transparent`}
          onClick={() => handleStropheBlockClick()}
          data-clicktype={'clickable'}
        >
          <LuTextSelect
            style={{pointerEvents:'none'}}
          />
        </button>
        <button
          key={"strophe" + strophe.id + "Selector"}
          className={`p-2 m-1 hover:bg-theme active:bg-transparent`}
          onClick={() => handleCollapseBlockClick()}
          data-clicktype={'clickable'}
        >
          { (!expanded && ctxIsHebrew) && <IoIosArrowForward style={{pointerEvents:'none'}} /> }
          { (!expanded && !ctxIsHebrew) && <IoIosArrowBack style={{pointerEvents:'none'}} /> }
          { expanded && <IoIosArrowDown style={{pointerEvents:'none'}} /> }
        </button>
        </div>
        {
          expanded ?
            strophe.lines.map((line, lineId) => {
              return (
                <div
                  key={"line_" + lineId}
                  className={`flex`}
                >
                {
                  line.words.map((word) => {
                    return (
                      <div
                        className={`mt-1 mb-1`}
                        key={word.id}
                      >
                        <WordBlock
                          key={"word_" + word.id}
                          hebWord={word}
                        />
                      </div>           
                    )
                  })
                }
                </div>
              )
            })
          :
            <div
              style={{minHeight: 25}}
              key={"collapsed" + strophe.id}
            >
          </div>
        }
      </div>
    )
  }