// 제출버튼 왼쪽에, 오른쪽엔 양식지우기 버튼을 만들어주세요.

import React from "react";
import { useDispatch } from "react-redux";
import { clearSurvey } from "../store/surveySlice";
import { submitSurvey } from "../store/surveySlice";
import { Button } from "@mui/material";

const Bottombar: React.FC = () => {
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(submitSurvey());
  };

  const handleClear = () => {
    // 컨펌 한번하기
    if (window.confirm("정말로 양식을 지우시겠습니까?")) {
      dispatch(clearSurvey());
    }
  };

  return (
    <div className="mt-4 flex items-center justify-between">
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        aria-label="Submit Form"
      >
        제출
      </Button>
      <div>
        <Button
          color="secondary"
          onClick={handleClear}
          aria-label="양식 지우기"
        >
          양식 지우기
        </Button>
      </div>
    </div>
  );
};

export default Bottombar;
