import { UndoBtn, RedoBtn, ColorActionBtn, ClearFormatBtn, 
  IndentBtn, UniformWidthBtn, StructureUpdateBtn } from "./Buttons";
import ScaleDropDown from "./ScaleDropDown";
import { useContext } from "react";
import { FormatContext } from '../index';
import { ColorActionType, StructureUpdateType } from "@/lib/types";
import Structure from "../InfoPane/Structure";
import { PassageData } from "@/lib/data";

const Toolbar = ({
  setScaleValue,
  //color functions
  setColorAction,
  setSelectedColor,
  setUniformWidth,
  content
}: {
  setScaleValue: (arg: number) => void;
  //color functions
  setColorAction: (arg: number) => void,
  setSelectedColor: (arg: string) => void;
  setUniformWidth: (arg: boolean) => void;
  content: PassageData;
} ) => {
  
  const { ctxInViewMode, ctxIsHebrew } = useContext(FormatContext);
  
  /* TODO: may need to refactor this part after more features are added to view mode*/
  return (
    <div className="fixed top-19 left-0 mr-auto ml-auto z-20 flex justify-center w-full max-w-full hbFontExemption">
      <div className="fixed left-0 mx-auto pl-11 pr-11 max-w-220 bg-white py-2 w-full">

      { // only show zoom in/out & uniform width buttons in view only mode
        ctxInViewMode
        ? (<div className="flex">
            <ScaleDropDown setScaleValue={setScaleValue} />
            <UniformWidthBtn setUniformWidth={setUniformWidth}/>
        </div>)
        : (<div className="flex">
          {/*<div className="border-r border-stroke flex flex-row">
            <UndoBtn />
            <RedoBtn />
          </div>*/}
          <ScaleDropDown setScaleValue={setScaleValue} />
          <div className="border-r border-stroke flex flex-row">
            <ColorActionBtn colorAction={ColorActionType.colorFill} setColorAction={setColorAction} setSelectedColor={setSelectedColor}/>
            <ColorActionBtn colorAction={ColorActionType.borderColor} setColorAction={setColorAction} setSelectedColor={setSelectedColor}/>
            <ColorActionBtn colorAction={ColorActionType.textColor} setColorAction={setColorAction} setSelectedColor={setSelectedColor}/>
            <ClearFormatBtn setColorAction={setColorAction} />          
          </div>
          <div className="border-r border-stroke flex flex-row">
            <UniformWidthBtn setUniformWidth={setUniformWidth}/>
            <IndentBtn leftIndent={true} />
            <IndentBtn leftIndent={false} />
          </div>
          <div className="border-r border-stroke flex flex-row">
            <StructureUpdateBtn updateType={StructureUpdateType.newLine} toolTip="New line" />
            <StructureUpdateBtn updateType={StructureUpdateType.mergeWithPrevLine} toolTip="Move to previous line" />
            <StructureUpdateBtn updateType={StructureUpdateType.mergeWithNextLine} toolTip="Move to next line" />
          </div>
          <div className="border-r px-3 border-stroke flex flex-row">
            <StructureUpdateBtn updateType={StructureUpdateType.newStrophe} toolTip="New strophe" />
            <StructureUpdateBtn updateType={StructureUpdateType.mergeWithPrevStrophe} toolTip="Merge with previous strophe" />
            <StructureUpdateBtn updateType={StructureUpdateType.mergeWithNextStrophe} toolTip="Merge with next strophe" />
          </div>
          <div className="border-r px-3 border-stroke flex flex-row">
            <StructureUpdateBtn updateType={StructureUpdateType.newStanza} toolTip="New stanza" />
            <StructureUpdateBtn updateType={ctxIsHebrew ? StructureUpdateType.mergeWithNextStanza : StructureUpdateType.mergeWithPrevStanza} toolTip={ctxIsHebrew ? "Merge with next stanza" : "Merge with previous stanza"} />
            <StructureUpdateBtn updateType={ctxIsHebrew ? StructureUpdateType.mergeWithPrevStanza : StructureUpdateType.mergeWithNextStanza} toolTip={ctxIsHebrew ? "Merge with previous stanza" : "Merge with next stanza"} />
          </div>
        </div>)
      }
    </div>
  </div>
  );
};


export default Toolbar;
