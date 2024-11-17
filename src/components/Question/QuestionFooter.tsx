import React, { useCallback } from "react";
import { addEtcOption, addOption, Question } from "../../store/surveySlice";
import { useDispatch } from "react-redux";

const QuestionFooter: React.FC<{ question: Question }> = ({ question }) => {
  const dispatch = useDispatch();

  const handleAddOption = useCallback(() => {
    dispatch(addOption(question.id));
  }, [dispatch, question]);

  const handleAddEtcOption = useCallback(() => {
    dispatch(addEtcOption(question.id));
  }, [dispatch, question]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button onClick={handleAddOption} className="text-sm text-gray-500">
          옵션 추가
        </button>
        {!question.isEtc && question.type !== "dropdown" && (
          <div className="flex gap-2">
            <span>또는</span>
            <button onClick={handleAddEtcOption} className="text-blue-500">
              '기타' 추가
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionFooter;
