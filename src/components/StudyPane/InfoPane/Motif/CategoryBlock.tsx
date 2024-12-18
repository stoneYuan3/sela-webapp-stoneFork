import { useContext, useState } from "react";
import { DEFAULT_BORDER_COLOR, DEFAULT_COLOR_FILL, DEFAULT_TEXT_COLOR, FormatContext } from "../..";
import { HebWord } from "@/lib/data";

export const CategoryBlock = ({
    category,
    index,
    selectedCategory,
    setSelectedCategory,
    value,
    lastSelectedHebWords,
    setLastSelectedHebWords
}: {
    category: String,
    index: number,
    selectedCategory: String,
    setSelectedCategory: React.Dispatch<React.SetStateAction<String>>,
    value: { strongNumbers: number[], count: number, hebWords: HebWord[] },
    lastSelectedHebWords: HebWord[],
    setLastSelectedHebWords: React.Dispatch<React.SetStateAction<HebWord[]>>
}) => {
    const { ctxSelectedHebWords, ctxSetSelectedHebWords } = useContext(FormatContext);
    const handleClick = () => {
        if (category === selectedCategory) {
            const newSelectedHebWords = ctxSelectedHebWords.filter(
                word => !lastSelectedHebWords.some(categoryWord => categoryWord.id === word.id)
            );
            ctxSetSelectedHebWords(newSelectedHebWords);
            setLastSelectedHebWords([]);
            setSelectedCategory("");
        } else {
            const wordsWithoutPrevCategory = ctxSelectedHebWords.filter(
                word => !lastSelectedHebWords.some(categoryWord => categoryWord.id === word.id)
            );
            
            const newSelectedHebWords = Array.from(new Set([...wordsWithoutPrevCategory, ...value.hebWords]));
            
            setSelectedCategory(category);
            ctxSetSelectedHebWords(newSelectedHebWords);
            setLastSelectedHebWords(value.hebWords);
        }
    };
    return (
        <div className="flex my-1">
            <div
                className={`wordBlock mx-1 ClickBlock ${selectedCategory === category ? 'rounded border outline outline-offset-1 outline-[3px] outline-[#FFC300] drop-shadow-md' : 'rounded border outline-offset-[-4px]'}`}
                data-clicktype="clickable"
                style={
                    {
                        background: `${DEFAULT_COLOR_FILL}`,
                        border: `2px solid ${DEFAULT_BORDER_COLOR}`,
                        color: `${DEFAULT_TEXT_COLOR}`,
                    }
                }>
                <span
                    className="flex mx-1 my-1"
                    onClick={handleClick}
                >
                    <span
                        className={`flex select-none px-2 py-1 items-center justify-center text-center hover:opacity-60 leading-none text-lg`}
                    >{category}</span>
                    <span className="flex h-6.5 w-full min-w-6.5 max-w-6.5 items-center justify-center rounded-full bg-[#EFEFEF] text-black text-sm">{value.count}</span>
                </span>
            </div>
        </div>
    )
}