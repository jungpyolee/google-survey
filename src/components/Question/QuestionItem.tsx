import React, { useCallback, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import QuestionControls from "./QuestionControls";
import OptionList from "./Option/OptionList";
import QuestionFooter from "./QuestionFooter";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { changeType, Question, updateQuestion } from "../../store/surveySlice";
import { useDispatch } from "react-redux";
import clsx from "clsx";

type QuestionType =
  | "short-answer"
  | "long-answer"
  | "multiple-choice"
  | "checkbox"
  | "dropdown";

const QuestionItem: React.FC<{
  question: Question;
  index: number;
}> = ({ question, index }) => {
  const dispatch = useDispatch();
  const [isFocused, setIsFocused] = useState(false);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  // Handle text changes
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateQuestion({ ...question, text: e.target.value }));
    },
    [dispatch, question],
  );

  // Handle type changes
  const handleTypeChange = useCallback(
    (e: SelectChangeEvent) => {
      dispatch(
        changeType({ id: question.id, type: e.target.value as QuestionType }),
      );
    },
    [dispatch, question.id],
  );

  // Determine if the question type is text-based (short or long answer)
  const isTextType =
    question.type === "short-answer" || question.type === "long-answer";

  return (
    <Draggable key={question.id} draggableId={question.id} index={index}>
      {(provided) => (
        <div
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="my-4 flex flex-col gap-4 rounded-lg bg-white p-4 shadow"
        >
          {/* Drag Indicator */}
          <div className="flex items-center justify-center text-center text-xs text-gray-500">
            <div className="h-4 w-4 rotate-90">
              <DragIndicatorIcon fontSize="small" />
            </div>
          </div>

          {/* Question Text Input and Type Selector */}
          <div className="flex h-12 gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={question.text}
                onChange={handleTextChange}
                placeholder="질문"
                className="h-12 w-full border-none bg-gray-50 px-2 text-gray-700 ring-0 hover:bg-gray-100 focus:outline-none focus:ring-0"
                onFocus={() => setIsTitleFocused(true)} // 포커스 시 상태 변경
                onBlur={() => setIsTitleFocused(false)} // 블러 시 상태 변경
              />
              <div
                className={clsx(
                  "h-0.5",
                  isTitleFocused
                    ? "animate-expand bg-violet-600"
                    : "bg-gray-200",
                )}
              ></div>
            </div>

            <FormControl>
              <InputLabel id="answer-type-label">유형</InputLabel>
              <Select
                labelId="answer-type-label"
                value={question.type}
                onChange={handleTypeChange}
              >
                <MenuItem value="short-answer">단답형</MenuItem>
                <MenuItem value="long-answer">장문형</MenuItem>
                <MenuItem value="multiple-choice">객관식 질문</MenuItem>
                <MenuItem value="checkbox">체크박스</MenuItem>
                <MenuItem value="dropdown">드롭다운</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Conditional Rendering for Input or Options */}
          {isTextType ? (
            <div className="flex flex-1">
              <input
                type="text"
                disabled
                placeholder={
                  question.type === "short-answer"
                    ? "단답형 텍스트"
                    : "장문형 텍스트"
                }
                className="w-full border-b border-gray-300 p-2 text-gray-700 ring-0 focus:outline-none focus:ring-0"
              />
            </div>
          ) : (
            <OptionList question={question} />
          )}

          {/* Footer and Controls */}
          {(question.type === "multiple-choice" ||
            question.type === "dropdown" ||
            question.type === "checkbox") &&
            isFocused && <QuestionFooter question={question} />}

          {isFocused && <QuestionControls question={question} />}
        </div>
      )}
    </Draggable>
  );
};

export default QuestionItem;
