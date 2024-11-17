import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateQuestion, changeType } from "../../store/surveySlice";
import QuestionControls from "./QuestionControls";
import { Question as QuestionType } from "../../store/surveySlice";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

type Props = {
  question: QuestionType;
};

const Question: React.FC<Props> = ({ question }) => {
  const dispatch = useDispatch();
  const [focusedQuestionId, setFocusedQuestionId] = useState<string | null>(
    null,
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateQuestion({ ...question, text: e.target.value }));
  };

  const handleTypeChange = (e: SelectChangeEvent) => {
    dispatch(
      changeType({
        id: question.id,
        type: e.target.value as QuestionType["type"],
      }),
    );
  };

  return (
    <div className="my-4 flex flex-col gap-4 rounded-lg bg-white p-4 shadow">
      <div className="flex h-12 gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={question.text}
            onChange={handleTextChange}
            placeholder="질문"
            onFocus={() => setFocusedQuestionId(question.id)}
            onBlur={() => setFocusedQuestionId(null)}
            className="h-12 w-full border-none bg-gray-50 px-2 text-gray-700"
          />
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
      <QuestionControls question={question} />
    </div>
  );
};

export default Question;
