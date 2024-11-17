import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { IconButton, Switch } from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  copyQuestion,
  Question,
  removeQuestion,
  updateQuestion,
} from "../../store/surveySlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const QuestionControls: React.FC<{ question: Question }> = ({ question }) => {
  const dispatch = useDispatch();

  const questions = useSelector((state: RootState) => state.survey.questions);
  const [focusedQuestionContainerId, setFocusedQuestionContainerId] = useState<
    string | null
  >(null);
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

  return (
    <div className="mt-4 flex items-center justify-end gap-1 border-t px-4 pt-4">
      <div className="mr-4 flex gap-2 border-r pr-4">
        <IconButton
          aria-label="복사"
          onClick={() => handleCopyQuestion(question.id)}
        >
          <ContentCopyRoundedIcon />
        </IconButton>
        <IconButton
          aria-label="삭제"
          onClick={() => handleDeleteQuestion(question.id)}
        >
          <DeleteOutlineOutlinedIcon />
        </IconButton>
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
  );
};

export default QuestionControls;
