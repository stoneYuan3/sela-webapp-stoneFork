"use client";

import { LuUndo2, LuRedo2, LuArrowUpToLine, LuArrowDownToLine, LuArrowUpNarrowWide, LuArrowDownWideNarrow } from "react-icons/lu";
import { MdOutlineModeEdit, MdOutlinePlaylistAdd } from "react-icons/md";
import { BiSolidColorFill, BiFont } from "react-icons/bi";
import { AiOutlineClear } from "react-icons/ai";
import { TbArrowAutofitContent, TbArrowAutofitContentFilled } from "react-icons/tb";
import { CgArrowsBreakeV, CgArrowsBreakeH, CgFormatIndentIncrease, CgFormatIndentDecrease } from "react-icons/cg";

import { SwatchesPicker } from 'react-color'
import React, { useContext, useEffect, useCallback, useState } from 'react';

import { DEFAULT_COLOR_FILL, DEFAULT_BORDER_COLOR, DEFAULT_TEXT_COLOR, FormatContext } from '../index';
import { ColorActionType, ColorPickerProps, InfoPaneActionType, StructureUpdateType } from "@/lib/types";
import { updateWordColor, updateIndented, updateStropheColor } from "@/lib/actions";
import { continuityTest } from "@/lib/utils";

export const ToolTip = ({ text }: { text: string }) => {
  return (
    <div className="absolute left-1/2 top-full z-20 mt-3 -translate-x-1/2 whitespace-nowrap rounded bg-black px-4.5 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
      <span className="absolute left-1/2 top-[-3px] -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm bg-black"></span>
      {text}
    </div>
  )
}

export const UndoBtn = () => {

  return (
    <div className="flex flex-col group relative inline-block items-center justify-center px-2 xsm:flex-row">
      <button
        className="hover:text-primary"
        onClick={() => console.log("Undo Clicked")} >
        <LuUndo2 fontSize="1.5em" />
      </button>
      <ToolTip text="Undo" />
    </div>
  );
};

export const RedoBtn = () => {

  return (
    <div className="flex flex-col group relative inline-block items-center justify-center px-2 px-4 dark:border-strokedark xsm:flex-row">
      <button
        className="hover:text-primary"
        onClick={() => console.log("Redo Clicked")} >
        <LuRedo2 fontSize="1.5em" />
      </button>
      <ToolTip text="Redo" />
    </div>
  );
};

export const ColorActionBtn: React.FC<ColorPickerProps> = ({
  colorAction,
  setSelectedColor,
  setColorAction
}) => {
  const { ctxStudyId, ctxColorAction, ctxColorFill, ctxBorderColor, ctxTextColor,
    ctxNumSelectedWords, ctxSelectedHebWords, ctxNumSelectedStrophes, ctxSelectedStrophes
  } = useContext(FormatContext);

  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [displayColor, setDisplayColor] = useState("");

  const refreshDisplayColor = useCallback(() => {
    (colorAction === ColorActionType.colorFill) && setDisplayColor(ctxColorFill);
    (colorAction === ColorActionType.borderColor) && setDisplayColor(ctxBorderColor);
    (colorAction === ColorActionType.textColor) && setDisplayColor(ctxTextColor);
  }, [colorAction, ctxColorFill, ctxBorderColor, ctxTextColor]);
  
  useEffect(() => {
    const hasSelectedItems = (ctxNumSelectedWords > 0 || (ctxNumSelectedStrophes > 0 && colorAction != ColorActionType.textColor));
    setButtonEnabled(hasSelectedItems);

    // make sure the colour picker turns off completely when user de-selects everything
    if (!hasSelectedItems) {
      setColorAction(ColorActionType.none);
      setSelectedColor("");
    }
    else {
      refreshDisplayColor();
    }
  }, [ctxNumSelectedWords, ctxNumSelectedStrophes, refreshDisplayColor, setColorAction, setSelectedColor, colorAction])

  useEffect(() => {
    if (ctxColorAction === ColorActionType.resetColor) {
      refreshDisplayColor();
    }
  }, [ctxColorAction, refreshDisplayColor])

  const handleClick = () => {
    setColorAction(ColorActionType.none);
    if (buttonEnabled) {
      setColorAction((ctxColorAction != colorAction) ? colorAction : ColorActionType.none);
      setSelectedColor("");
    }
  }

  const handleChange = (color: any) => {
    //console.log("Changing " + colorActionType + " color to " + color.hex);
    setSelectedColor(color.hex);
    setDisplayColor(color.hex);
    let wordIds : number[] = [];
    ctxSelectedHebWords.map((word) => {
      wordIds.push(word.id);
    })
    if (ctxSelectedHebWords.length > 0) {
      updateWordColor(ctxStudyId, wordIds, colorAction, color.hex);
    }

    let stropheIds : number[] = [];
    ctxSelectedStrophes.map((strophe) => {
      stropheIds.push(strophe.id);
    })
    if (ctxNumSelectedStrophes > 0) {
      updateStropheColor(ctxStudyId, stropheIds, colorAction, color.hex);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-2 xsm:flex-row ClickBlock">
      <button
        className={`hover:text-primary ${buttonEnabled ? '' : 'pointer-events-none'} ClickBlock`}
        onClick={handleClick} >
        {
          (colorAction === ColorActionType.colorFill) && <BiSolidColorFill className="ClickBlock" fillOpacity={buttonEnabled ? "1" : "0.4"} fontSize="1.4em" />
        }
        {
          (colorAction === ColorActionType.borderColor) && <MdOutlineModeEdit className="ClickBlock" fillOpacity={buttonEnabled ? "1" : "0.4"} fontSize="1.4em" />
        }
        {
          (colorAction === ColorActionType.textColor) && <BiFont className="ClickBlock" fillOpacity={buttonEnabled ? "1" : "0.4"} fontSize="1.5em" />
        }
        <div
          // TODO: using embbed style for the color display for now, may move to tailwind after some research
          style={
            {
              width: "100%",
              height: "0.25rem",
              background: `${buttonEnabled ? displayColor : '#FFFFFF'}`,
              marginTop: "0.05rem",
            }
          }
        >
        </div>
      </button>

      {
        ctxColorAction === colorAction && buttonEnabled && (
          <div className="relative z-10">
            <div className="absolute top-6 -left-6">
              <SwatchesPicker className={`colorPicker`} width={550} height={300} color={displayColor} onChange={handleChange} />
            </div>
          </div>
        )
      }
    </div>
  );
};


export const ClearFormatBtn = ({ setColorAction }: { setColorAction: (arg: number) => void }) => {

  const { ctxStudyId, ctxNumSelectedWords, ctxSelectedHebWords, 
    ctxNumSelectedStrophes, ctxSelectedStrophes,
    ctxSetColorFill, ctxSetBorderColor, ctxSetTextColor
  } = useContext(FormatContext);

  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    const hasSelectedItems = (ctxNumSelectedWords > 0 || ctxNumSelectedStrophes > 0);
    setButtonEnabled(hasSelectedItems);

    // make sure the colour picker turns off completely when user de-selects everything
    if (!hasSelectedItems) {
      setColorAction(ColorActionType.none);
    }
  }, [ctxNumSelectedWords, ctxNumSelectedStrophes, setColorAction])

  const handleClick = () => {
    if (buttonEnabled) {
      setColorAction(ColorActionType.resetColor);
      ctxSetColorFill(DEFAULT_COLOR_FILL);
      ctxSetBorderColor(DEFAULT_BORDER_COLOR);
      if (ctxSelectedHebWords.length > 0) {
        ctxSetTextColor(DEFAULT_TEXT_COLOR);
        let wordIds : number[] = [];
        ctxSelectedHebWords.map((word) => {
          wordIds.push(word.id)
        })
        updateWordColor(ctxStudyId, wordIds, ColorActionType.resetColor, null);
      }
      if (ctxSelectedStrophes.length > 0) {
        let stropheIds : number[] = [];
        ctxSelectedStrophes.map((strophe) => {
          stropheIds.push(strophe.id)
        })
        updateStropheColor(ctxStudyId, stropheIds, ColorActionType.resetColor, null);
      }
    }
  }

  return (
    <div className="flex flex-col group relative inline-block items-center justify-center px-2 xsm:flex-row">
      <button
        className={`hover:text-primary ${buttonEnabled ? '' : 'pointer-events-none'}`}
        onClick={handleClick} >
        <AiOutlineClear className="ClickBlock" fillOpacity={buttonEnabled ? "1" : "0.4"} fontSize="1.4em" />
      </button>
      <ToolTip text="Clear format" />
    </div>
  );
};

export const UniformWidthBtn = ({ setUniformWidth }: {
  setUniformWidth: (arg: boolean) => void,
}) => {
  const { ctxUniformWidth } = useContext(FormatContext);

  const handleClick = () => {
    setUniformWidth(!ctxUniformWidth);
  }
  return (
    <div className="flex flex-col group relative inline-block items-center justify-center px-2 xsm:flex-row">
      <button
        className="hover:text-primary"
        onClick={handleClick} >
        {
         (ctxUniformWidth) ? <TbArrowAutofitContentFilled fontSize="1.5em" /> : <TbArrowAutofitContent fontSize="1.5em" />
        }
      </button>
      {
        ctxUniformWidth ? (<ToolTip text="Disable uniform width" />) : (<ToolTip text="Enable uniform width" />)
      }
    </div>
  );
};

export const IndentBtn = ({ leftIndent }: { leftIndent: boolean }) => {

  const { ctxStudyId, ctxIsHebrew, ctxUniformWidth, ctxSelectedHebWords, ctxIndentNum, ctxSetIndentNum, ctxNumSelectedWords } = useContext(FormatContext);
  const [buttonEnabled, setButtonEnabled] = useState(ctxUniformWidth && (ctxNumSelectedWords === 1));

  useEffect(() => {
    ctxSetIndentNum((ctxSelectedHebWords.length === 1) ? ctxSelectedHebWords[0].numIndent : 0);
    let validIndent = (!leftIndent) ? ctxIndentNum > 0 : ctxIndentNum < 3;
    setButtonEnabled(ctxUniformWidth && (ctxNumSelectedWords === 1) && validIndent);
  }, [ctxUniformWidth, ctxNumSelectedWords, ctxSelectedHebWords, ctxIndentNum, ctxIsHebrew, ctxSetIndentNum, leftIndent]);

  const handleClick = () => {
    if (!ctxUniformWidth || ctxSelectedHebWords.length === 0)
      return;

    let numIndent = ctxSelectedHebWords[0].numIndent;
    if (!leftIndent) {
      if (numIndent > 0) {
        updateIndented(ctxStudyId, ctxSelectedHebWords[0].id, --ctxSelectedHebWords[0].numIndent);
        setButtonEnabled(ctxSelectedHebWords[0].numIndent > 0);
        ctxSetIndentNum(ctxSelectedHebWords[0].numIndent)
      }
    }
    else {
      if (numIndent < 3) {
        updateIndented(ctxStudyId, ctxSelectedHebWords[0].id, ++ctxSelectedHebWords[0].numIndent);
        setButtonEnabled(ctxSelectedHebWords[0].numIndent < 3);
        ctxSetIndentNum(ctxSelectedHebWords[0].numIndent)
      }
    }
  }
  return (
    <div className={`flex flex-col group relative inline-block items-center justify-center px-2 xsm:flex-row hbFontExemption `}>
      <button
        className={`hover:text-primary ${buttonEnabled ? '' : 'pointer-events-none'}`}
        onClick={handleClick} >
        {
          (!ctxIsHebrew && leftIndent) || (ctxIsHebrew && !leftIndent) ?
            <CgFormatIndentIncrease fillOpacity={buttonEnabled ? "1" : "0.4"} fontSize="1.5em" /> :
            <CgFormatIndentDecrease fillOpacity={buttonEnabled ? "1" : "0.4"} fontSize="1.5em" />
        }
      </button>
      <ToolTip text={(leftIndent) ? "Add indent" : "Remove indent"} />
    </div>
  );
};

export const StructureUpdateBtn = ({ updateType, toolTip }: { updateType: StructureUpdateType, toolTip: string }) => {

  const { ctxIsHebrew, ctxSelectedHebWords, ctxSetStructureUpdateType, ctxStropheCount, ctxNumSelectedStrophes, ctxSelectedStrophes, ctxStanzaCount } = useContext(FormatContext);

  let buttonEnabled = false;
  let buttonEnabled2 = false;
  let hasWordSelected = (ctxSelectedHebWords.length === 1);
  let hasStropheSelected = (ctxSelectedStrophes.length === 1);
  let hasStrophesSelected = (ctxNumSelectedStrophes === 1) && (ctxStropheCount > 1) && (ctxSelectedStrophes[0] !== undefined);
  let continuousWords = continuityTest(ctxSelectedHebWords);

  if (updateType === StructureUpdateType.newLine) {
    buttonEnabled = hasWordSelected && !ctxSelectedHebWords[0].lineBreak && !ctxSelectedHebWords[0].firstWordInStrophe;
    buttonEnabled2 = continuousWords
  } else if (updateType === StructureUpdateType.mergeWithPrevLine) {
    buttonEnabled = hasWordSelected && (ctxSelectedHebWords[0].lineId !== 0);
  } else if (updateType === StructureUpdateType.mergeWithNextLine) {
    buttonEnabled = hasWordSelected && (!ctxSelectedHebWords[0].lastLineInStrophe);
  } else if (updateType === StructureUpdateType.newStrophe) {
    buttonEnabled = hasWordSelected && (!ctxSelectedHebWords[0].firstWordInStrophe);
  } else if (updateType === StructureUpdateType.mergeWithPrevStrophe) {
    buttonEnabled = (hasWordSelected && (!ctxSelectedHebWords[0].firstStropheInStanza) || (hasStropheSelected && !ctxSelectedStrophes[0].firstStropheInStanza));
  } else if (updateType === StructureUpdateType.mergeWithNextStrophe) {
    buttonEnabled = (hasWordSelected && (!ctxSelectedHebWords[0].lastStropheInStanza) || (hasStropheSelected && !ctxSelectedStrophes[0].lastStropheInStanza));
  } else if (updateType === StructureUpdateType.newStanza) {
    buttonEnabled = hasStrophesSelected && (!ctxSelectedStrophes[0].firstStropheInStanza);
  } else if (updateType === StructureUpdateType.mergeWithPrevStanza) {
    buttonEnabled = hasStrophesSelected && (ctxSelectedStrophes[0].lines[0].words[0].stanzaId !== undefined && ctxSelectedStrophes[0].lines[0].words[0].stanzaId > 0)
  } else if (updateType === StructureUpdateType.mergeWithNextStanza) {
    buttonEnabled = hasStrophesSelected && (ctxSelectedStrophes[0].lines[0].words[0].stanzaId !== undefined && ctxSelectedStrophes[0].lines[0].words[0].stanzaId < ctxStanzaCount-1)
  }

  const handleClick = () => { buttonEnabled && ctxSetStructureUpdateType(updateType) };

  return (
    <div className="flex flex-col group relative inline-block items-center justify-center px-2 xsm:flex-row">
      <button
        className={`hover:text-primary ${buttonEnabled ? '' : 'pointer-events-none'}`}
        onClick={handleClick} >
          {
            (updateType === StructureUpdateType.newLine) && <MdOutlinePlaylistAdd opacity={(buttonEnabled)?`1`:`0.4`} fontSize="1.5em" />
          }
          {
            (updateType === StructureUpdateType.mergeWithPrevLine) && <LuArrowUpToLine opacity={(buttonEnabled)?`1`:`0.4`} fontSize="1.5em" />
          }
          {
            (updateType === StructureUpdateType.mergeWithNextLine) && <LuArrowDownToLine opacity={(buttonEnabled)?`1`:`0.4`} fontSize="1.5em" />
          }
          {
            (updateType === StructureUpdateType.newStrophe) && <CgArrowsBreakeV opacity={(buttonEnabled)?`1`:`0.4`} fontSize="1.5em" />
          }
          {
            (updateType === StructureUpdateType.mergeWithPrevStrophe) && <LuArrowUpNarrowWide opacity={(buttonEnabled)?`1`:`0.4`} fontSize="1.5em" />
          }
          {
            (updateType === StructureUpdateType.mergeWithNextStrophe) && <LuArrowDownWideNarrow opacity={(buttonEnabled)?`1`:`0.4`} fontSize="1.5em" />
          }  
          {
            (updateType === StructureUpdateType.newStanza) && <CgArrowsBreakeH opacity={(buttonEnabled)?`1`:`0.4`} fontSize="1.5em" />
          } 
          {
            ((updateType == StructureUpdateType.mergeWithPrevStanza && !ctxIsHebrew) || updateType == StructureUpdateType.mergeWithNextStanza && ctxIsHebrew) && <LuArrowDownWideNarrow style={{transform:'rotate(90deg)'}} opacity={(buttonEnabled)?`1`:`0.4`} fontSize="1.5em" />
          }
          {
            ((updateType == StructureUpdateType.mergeWithNextStanza && !ctxIsHebrew) || updateType == StructureUpdateType.mergeWithPrevStanza && ctxIsHebrew) && <LuArrowUpNarrowWide style={{transform:'rotate(90deg)'}} opacity={(buttonEnabled)?`1`:`0.4`} fontSize="1.5em" />
          }
        <ToolTip text={toolTip} />
      </button>
    </div>
  );
};

export const StructureBtn = ({
  setInfoPaneAction,
  infoPaneAction,
}: {
  setInfoPaneAction: (arg: InfoPaneActionType) => void;
  infoPaneAction: InfoPaneActionType;
}) => {

  const handleClick = () => {
    if (infoPaneAction != InfoPaneActionType.structure) {
      setInfoPaneAction(InfoPaneActionType.structure);
    } else {
      setInfoPaneAction(InfoPaneActionType.none);
    }
  }
  return (
    <div>
      <button className="text-gray-200 border-gray-400 font-semibold 
        py-1 px-2 border rounded shadow cursor-not-allowed
        text-xs sm:text-sm lg:text-base 
        sm:py-0.25 sm:px-0.5 md:py-0.5 md:px-1 lg:py-1 lg:x-2 xl:py-2 xl:px-4"
        style={{ color: '#d6dadf' }}
        disabled={true}
        onClick={handleClick} >
        Structure
      </button>
      <ToolTip text="Structure" />
    </div>
  );
};
export const MotifBtn = ({
  setInfoPaneAction,
  infoPaneAction,
}: {
  setInfoPaneAction: (arg: InfoPaneActionType) => void;
  infoPaneAction: InfoPaneActionType;
}) => {
  const handleClick = () => {
    if (infoPaneAction != InfoPaneActionType.motif) {
      setInfoPaneAction(InfoPaneActionType.motif);
    } else {
      setInfoPaneAction(InfoPaneActionType.none);
    }
  }
  return (
    <div>
      <button className="bg-white hover:bg-gray-100 text-gray-800 
        font-semibold py-1 px-2 border border-gray-400 rounded shadow
        text-xs sm:text-sm lg:text-base
        sm:py-0.25 sm:px-0.5 md:py-0.5 md:px-1 lg:py-1 lg:x-2 xl:py-2 xl:px-4"
        onClick={handleClick} >
        Motif
      </button>
      <ToolTip text="Motif" />
    </div>
  );
};
export const SyntaxBtn = ({
  setInfoPaneAction,
  infoPaneAction,
}: {
  setInfoPaneAction: (arg: InfoPaneActionType) => void;
  infoPaneAction: InfoPaneActionType;
}) => {
  const handleClick = () => {
    if (infoPaneAction != InfoPaneActionType.syntax) {
      setInfoPaneAction(InfoPaneActionType.syntax);
    } else {
      setInfoPaneAction(InfoPaneActionType.none);
    }
  }
  return (
    <div>
      <button
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold
        py-1 px-4 border rounded shadow cursor-not-allowed
        text-xs sm:text-sm lg:text-base
        sm:py-0.25 sm:px-0.5 md:py-0.5 md:px-1 lg:py-1 lg:x-2 xl:py-2 xl:px-4"
        style={{ color: '#d6dadf' }}
        disabled={true}
        onClick={handleClick} >
        Syntax
      </button>
      <ToolTip text="Syntax" />
    </div>
  );
};
export const SoundsBtn = ({
  setInfoPaneAction,
  infoPaneAction,
}: {
  setInfoPaneAction: (arg: InfoPaneActionType) => void;
  infoPaneAction: InfoPaneActionType;
}) => {
  const handleClick = () => {
    if (infoPaneAction != InfoPaneActionType.sounds) {
      setInfoPaneAction(InfoPaneActionType.sounds);
    } else {
      setInfoPaneAction(InfoPaneActionType.none);
    }
  }
  return (
    <div>
      <button
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold
        py-1 px-2 border rounded shadow 
        text-xs sm:text-sm lg:text-base
        sm:py-0.25 sm:px-0.5 md:py-0.5 md:px-1 lg:py-1 lg:x-2 xl:py-2 xl:px-4"
        style={{ color: '#d6dadf' }}
        disabled={true}
        onClick={handleClick} >
        Sounds
      </button>
      <ToolTip text="Sounds" />
    </div>
  );
};

