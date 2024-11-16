import React, { useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  updateQuestion,
  addOption,
  removeOption,
  Question,
  addEtcOption,
  changeType,
  removeQuestion,
  copyQuestion,
} from "../store/surveySlice";
import clsx from "clsx";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
} from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Clear } from "@mui/icons-material";
type QuestionType =
  | "short-answer"
  | "long-answer"
  | "multiple-choice"
  | "checkbox"
  | "dropdown";

const Questions: React.FC = () => {
  const dispatch = useDispatch();
  const questions = useSelector((state: RootState) => state.survey.questions);

  const [focusedQuestionContainerId, setFocusedQuestionContainerId] = useState<
    string | null
  >(null);
  const [focusedQuestionId, setFocusedQuestionId] = useState<string | null>(
    null,
  );
  const [focusedOption, setFocusedOption] = useState<{
    questionId: string | null;
    optionIndex: number | null;
  }>({
    questionId: null,
    optionIndex: null,
  });

  const optionRefs = useRef<{ [key: string]: HTMLInputElement[] }>({});

  const handleTextChange = useCallback(
    (question: Question) => (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateQuestion({ ...question, text: e.target.value }));
    },
    [dispatch],
  );

  const handleTypeChange = useCallback(
    (question: Question) => (e: SelectChangeEvent) => {
      dispatch(
        changeType({ id: question.id, type: e.target.value as QuestionType }),
      );
    },
    [dispatch],
  );

  const handleCopyQuestion = (questionId: string) => {
    // 복사 액션 디스패치
    dispatch(copyQuestion(questionId));
  };

  const handleDeleteQuestion = (questionId: string) => {
    const deletedIndex = questions.findIndex((q) => q.id === questionId);

    // 삭제 액션 디스패치
    dispatch(removeQuestion(questionId));

    // 삭제 후 포커스를 이전 질문으로 설정
    setTimeout(() => {
      const newFocusId =
        questions[deletedIndex - 1]?.id || questions[0]?.id || null;
      setFocusedQuestionContainerId(newFocusId);
    }, 100);
  };

  const handleOptionChange = useCallback(
    (question: Question, optionIndex: number) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedOptions = [...question.options];
        updatedOptions[optionIndex] = e.target.value;
        dispatch(updateQuestion({ ...question, options: updatedOptions }));
      },
    [dispatch],
  );

  const handleAddOption = useCallback(
    (question: Question) => () => {
      dispatch(addOption(question.id));
    },
    [dispatch],
  );

  const handleAddEtcOption = useCallback(
    (question: Question) => () => {
      dispatch(addEtcOption(question.id));
    },
    [dispatch],
  );

  const handleRemoveOption = useCallback(
    (question: Question, optionIndex: number) => () => {
      dispatch(removeOption({ questionId: question.id, optionIndex }));
    },
    [dispatch],
  );

  const renderQuestion = (question: Question) => {
    if (!optionRefs.current[question.id]) {
      optionRefs.current[question.id] = [];
    }

    return (
      <div
        key={question.id}
        className="my-4 flex flex-col gap-4 rounded-lg bg-white p-4 shadow"
        tabIndex={-1}
        onFocus={() => setFocusedQuestionContainerId(question.id)}
      >
        <div className="flex h-12 gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={question.text}
              onChange={handleTextChange(question)}
              placeholder="질문"
              onFocus={() => setFocusedQuestionId(question.id)}
              onBlur={() => setFocusedQuestionId(null)}
              className="h-12 w-full border-none bg-gray-50 px-2 text-gray-700 ring-0 hover:bg-gray-100 focus:outline-none focus:ring-0"
            />
            <div
              className={clsx(
                "h-0.5",
                focusedQuestionId === question.id &&
                  "animate-expand bg-violet-600",
              )}
            ></div>
          </div>
          <FormControl>
            <InputLabel id="answer-type-label">유형</InputLabel>

            <Select
              labelId="answer-type-label"
              id="answer-type-select"
              value={question.type}
              label="유형"
              onChange={handleTypeChange(question)}
              className="h-12"
            >
              <MenuItem value="short-answer">단답형</MenuItem>
              <MenuItem value="long-answer">장문형</MenuItem>
              <MenuItem value="multiple-choice">객관식 질문</MenuItem>
              <MenuItem value="checkbox">체크박스</MenuItem>
              <MenuItem value="dropdown">드롭다운</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="flex flex-col gap-2">
          {question.type === "short-answer" ||
          question.type === "long-answer" ? (
            <div className="flex flex-1">
              <input
                type="text"
                disabled
                placeholder={
                  question.type === "short-answer"
                    ? "단답형 텍스트"
                    : "장문형 텍스트"
                }
                className="flex-1 border-b border-gray-300 p-2 text-gray-700 ring-0 focus:outline-none focus:ring-0"
              />
            </div>
          ) : (
            question.options.map((option, index) => (
              <div key={index} className="relative">
                <div className="flex items-center gap-2">
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
                    ref={(el) => {
                      if (el) optionRefs.current[question.id][index] = el;
                    }}
                    value={option}
                    disabled={
                      question.isEtc && index === question.options.length - 1
                    }
                    onChange={handleOptionChange(question, index)}
                    onFocus={() =>
                      setFocusedOption({
                        questionId: question.id,
                        optionIndex: index,
                      })
                    }
                    onBlur={() =>
                      setFocusedOption({ questionId: null, optionIndex: null })
                    }
                    className="flex-1 border-b border-transparent p-2 text-gray-700 ring-0 hover:border-gray-300 focus:outline-none focus:ring-0 disabled:border-dotted disabled:bg-white disabled:text-xs disabled:text-gray-500"
                  />
                  {question.options.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={handleRemoveOption(question, index)}
                    >
                      <Clear />
                    </IconButton>
                  )}
                </div>

                <div
                  className={clsx(
                    "h-0.5",
                    focusedOption.questionId === question.id &&
                      focusedOption.optionIndex === index &&
                      "animate-expand bg-violet-600",
                  )}
                ></div>
              </div>
            ))
          )}
          {question.type !== "short-answer" &&
            question.type !== "long-answer" &&
            focusedQuestionContainerId === question.id && (
              <div className="relative">
                <div className="flex items-center gap-2">
                  {question.type === "multiple-choice" && (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-500"></div>
                  )}
                  {question.type === "checkbox" && (
                    <div className="h-4 w-4 rounded border-2 border-gray-500"></div>
                  )}
                  {question.type === "dropdown" && (
                    <div className="w-3 pr-2">
                      <span className="text-gray-500">
                        {question.options.length + 1}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 gap-2 p-2 text-sm text-gray-700 ring-0 focus:outline-none focus:ring-0">
                    <button
                      onClick={handleAddOption(question)}
                      className="cursor-default border-b border-transparent text-sm text-gray-500 hover:border-gray-300"
                    >
                      옵션 추가
                    </button>
                    {!question.isEtc && question.type !== "dropdown" && (
                      <div className="flex gap-2">
                        <span>또는</span>
                        <button
                          onClick={handleAddEtcOption(question)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          '기타' 추가
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          {focusedQuestionContainerId === question.id && (
            <div className="mt-4 flex items-center justify-end gap-1 border-t px-4 pt-4">
              <div className="mr-4 flex gap-2 border-r pr-4">
                <IconButton
                  aria-label="복사"
                  onClick={() => {
                    handleCopyQuestion(question.id);
                  }}
                >
                  <ContentCopyRoundedIcon />
                </IconButton>

                {questions?.length > 1 && (
                  <IconButton
                    aria-label="삭제"
                    onClick={() => {
                      handleDeleteQuestion(question.id);
                    }}
                  >
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                )}
              </div>

              <p className="text-sm">필수</p>
              <Switch
                checked={question.isRequired}
                inputProps={{ "aria-label": "필수" }}
                color="secondary"
                onChange={(e) =>
                  dispatch(
                    updateQuestion({
                      ...question,
                      isRequired: e.target.checked,
                    }),
                  )
                }
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return <div>{questions.map(renderQuestion)}</div>;
};

export default Questions;
