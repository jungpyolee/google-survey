import React, { useCallback, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { IconButton } from "@mui/material";
import { Clear } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import {
  Question,
  removeOption,
  updateQuestion,
} from "../../../store/surveySlice";
import clsx from "clsx";

const OptionItem: React.FC<{
  question: Question;
  option: string;
  index: number;
}> = ({ question, option, index }) => {
  const dispatch = useDispatch();
  const handleOptionChange = useCallback(
    (question: Question, optionIndex: number, newValue: string) => {
      // Make a copy of options and update the specific option
      const updatedOptions = [...question.options];
      updatedOptions[optionIndex] = newValue;

      // Dispatch the update to Redux
      dispatch(updateQuestion({ ...question, options: updatedOptions }));
    },
    [dispatch],
  );
  const [isFocused, setIsFocused] = useState(false);
  // Handle option removal
  const handleRemoveOption = useCallback(
    (question: Question, optionIndex: number) => {
      // Dispatch removal of the option
      dispatch(removeOption({ questionId: question.id, optionIndex }));
    },
    [dispatch],
  );

  const isLastEtcOption =
    question.isEtc && index === question.options.length - 1;

  return (
    <Draggable
      draggableId={`option-${index}`}
      index={index}
      isDragDisabled={isLastEtcOption} // '기타' 옵션이 마지막이면 드래그 비활성화
    >
      {(provided) => (
        <div>
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="relative flex items-center gap-2"
          >
            {/* '기타' 옵션일 경우, 드래그를 비활성화 */}
            {question.type === "multiple-choice" && (
              <div className="h-4 w-4 rounded-full border-2 border-gray-500"></div>
            )}
            {question.type === "checkbox" && (
              <div className="h-4 w-4 rounded border-2 border-gray-500"></div>
            )}
            {question.type === "dropdown" && (
              <div className="w-3 pr-2">
                <span className="text-gray-500">{index + 1}</span>
              </div>
            )}
            <input
              type="text"
              value={option}
              disabled={question.isEtc && index === question.options.length - 1}
              onChange={(e) =>
                handleOptionChange(question, index, e.target.value)
              } // Pass the new value here
              className="flex-1 border-b border-transparent p-2 text-gray-700 ring-0 hover:border-gray-300 focus:outline-none focus:ring-0"
            />
            <IconButton
              size="small"
              onClick={() => handleRemoveOption(question, index)}
            >
              <Clear />
            </IconButton>
          </div>
          <div
            className={clsx(
              "h-0.5",
              isFocused ? "animate-expand bg-violet-600" : "bg-transparent",
            )}
          ></div>
        </div>
      )}
    </Draggable>
  );
};

export default OptionItem;
