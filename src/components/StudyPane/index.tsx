'use client';

import { useState, createContext, useEffect } from "react";

import Header from "./Header";
import Toolbar from "./Toolbar";
import Passage from "./Passage";
import InfoPane from "./InfoPane";
import { ColorType, ColorActionType, InfoPaneActionType, StructureUpdateType } from "@/lib/types";
import { StudyData, PassageData, HebWord, StropheData } from '@/lib/data';
import { continuityTest } from "@/lib/utils";
import { FooterComponent } from "../Footer";

export const DEFAULT_SCALE_VALUE: number = 1;
export const DEFAULT_COLOR_FILL = "#FFFFFF";
export const DEFAULT_BORDER_COLOR = "#D9D9D9";
export const DEFAULT_TEXT_COLOR = "#656565";

export const FormatContext = createContext({
  ctxStudyId: "",
  ctxScaleValue: DEFAULT_SCALE_VALUE,
  ctxIsHebrew: false,
  ctxSelectedHebWords: [] as HebWord[],
  ctxSetSelectedHebWords: (arg: HebWord[]) => {},
  ctxNumSelectedWords: 0 as number,
  ctxSetNumSelectedWords: (arg: number) => {},
  ctxSelectedStrophes: [] as StropheData[],  
  ctxSetSelectedStrophes: (arg: StropheData[]) => {},
  ctxNumSelectedStrophes: 0 as number,
  ctxSetNumSelectedStrophes: (arg: number) => {},
  ctxStropheCount: 0 as number,
  ctxSetStropheCount: (arg: number) => {},
  ctxStanzaCount: -1 as number,
  ctxSetStanzaCount: (arg: number) => {},
  ctxColorAction: {} as ColorActionType,
  ctxSelectedColor: "" as string,
  ctxSetSelectedColor: (arg: string) => {},
  ctxColorFill: "" as string,
  ctxSetColorFill: (arg: string) => {},
  ctxBorderColor: "" as string,
  ctxSetBorderColor: (arg: string) => {},
  ctxTextColor: "" as string,
  ctxSetTextColor: (arg: string) => {},
  ctxUniformWidth: false,
  ctxIndentNum: {} as number,
  ctxSetIndentNum: (arg: number) => {},
  ctxInViewMode: false,
  ctxStructureUpdateType: {} as StructureUpdateType,
  ctxSetStructureUpdateType: (arg: StructureUpdateType) => {},
  ctxRootsColorMap : {} as Map<number, ColorType>,
  ctxSetRootsColorMap : (arg: Map<number, ColorType>) =>{},
});

const StudyPane = ({
  study, content, inViewMode
}: {
  study: StudyData;
  content: PassageData;
  inViewMode: boolean;
}) => {
  const [scaleValue, setScaleValue] = useState(DEFAULT_SCALE_VALUE);
  const [isHebrew, setHebrew] = useState(false);

  const [numSelectedWords, setNumSelectedWords] = useState(0);
  const [selectedHebWords, setSelectedHebWords] = useState<HebWord[]>([]);
  const [selectedStrophes, setSelectedStrophes] = useState<StropheData[]>([]);
  const [numSelectedStrophes, setNumSelectedStrophes] = useState(0);
  const [stropheCount, setStropheCount] = useState(0);

  const [stanzaCount, setStanzaCount] = useState(-1);

  const [colorAction, setColorAction] = useState(ColorActionType.none);
  const [selectedColor, setSelectedColor] = useState("");

  const [colorFill, setColorFill] = useState(DEFAULT_COLOR_FILL);
  const [borderColor, setBorderColor] = useState(DEFAULT_BORDER_COLOR);
  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR);
  const [uniformWidth, setUniformWidth] = useState(false);
  const [indentNum, setIndentNum] = useState(0);

  const [infoPaneAction, setInfoPaneAction] = useState(InfoPaneActionType.none);
  const [structureUpdateType, setStructureUpdateType] = useState(StructureUpdateType.none);
  const [rootsColorMap, setRootsColorMap] = useState<Map<number, ColorType>>(new Map());
  
  const formatContextValue = {
    ctxStudyId: study.id,
    ctxScaleValue: scaleValue,
    ctxIsHebrew: isHebrew,
    ctxSelectedHebWords: selectedHebWords,
    ctxSetSelectedHebWords: setSelectedHebWords,
    ctxNumSelectedWords: numSelectedWords,
    ctxSetNumSelectedWords: setNumSelectedWords,
    ctxSelectedStrophes: selectedStrophes,
    ctxSetSelectedStrophes: setSelectedStrophes,
    ctxNumSelectedStrophes: numSelectedStrophes,
    ctxSetNumSelectedStrophes: setNumSelectedStrophes,
    ctxStanzaCount: stanzaCount,
    ctxSetStanzaCount: setStanzaCount,
    ctxColorAction: colorAction,
    ctxSelectedColor: selectedColor,
    ctxSetSelectedColor: setSelectedColor,
    ctxColorFill: colorFill,
    ctxSetColorFill: setColorFill,
    ctxBorderColor: borderColor,
    ctxSetBorderColor: setBorderColor,
    ctxTextColor: textColor,
    ctxSetTextColor: setTextColor,
    ctxUniformWidth: uniformWidth,
    ctxIndentNum: indentNum,
    ctxSetIndentNum: setIndentNum,
    ctxInViewMode: inViewMode,
    ctxStructureUpdateType: structureUpdateType,
    ctxSetStructureUpdateType: setStructureUpdateType,
    ctxStropheCount: stropheCount,
    ctxSetStropheCount: setStropheCount,
    ctxRootsColorMap: rootsColorMap,
    ctxSetRootsColorMap: setRootsColorMap,
  }

  useEffect(() => {
    if (selectedHebWords.length > 0) {
      continuityTest(selectedHebWords);
    }
  },[selectedHebWords])


  const passageDivStyle = {
    className: `flex overflow-y-auto h-full w-full ${isHebrew ? "hbFont" : ""}`
  };
  const studyPaneWrapperStyle = {
    className: `grid gap-x-2 ${infoPaneAction !== InfoPaneActionType.none ? 'grid-cols-[3fr_1fr]' : ''} relative h-full`
  };
  
  return (
    <>
      <FormatContext.Provider value={formatContextValue}>
        <Header
          study={study}
          setLangToHebrew={setHebrew}
          setInfoPaneAction={setInfoPaneAction}
          infoPaneAction={infoPaneAction}
        />
  
        <main {...studyPaneWrapperStyle}>
          <div {...passageDivStyle}>
            <Toolbar
              setScaleValue={setScaleValue}
              //color functions
              setColorAction={setColorAction}
              setSelectedColor={setSelectedColor}
              setUniformWidth={setUniformWidth}
              content={content}
            />
  
            <Passage content={content} />
          </div>
  
          {
            infoPaneAction !== InfoPaneActionType.none && (
              <div className="top-19 right-0 w-1/4 h-full z-30 bg-white border-l border-gray-300">
                <InfoPane
                  infoPaneAction={infoPaneAction}
                  setInfoPaneAction={setInfoPaneAction}
                  content={content}
                />
              </div>
            )
          }
        </main>
        <FooterComponent/>
      </FormatContext.Provider>
    </>
  );

};

export default StudyPane;

