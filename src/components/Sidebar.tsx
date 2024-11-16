import React from "react";
import { useDispatch } from "react-redux";
import { addQuestion, Question } from "../store/surveySlice"; // 가정: surveySlice에서 addQuestion 액션을 정의

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();

  // 새로운 질문을 추가하는 함수
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "multiple-choice", //
      text: "",
      isRequired: false,
      index: 0,
      options: ["옵션 1"],
      isEtc: false,
    };

    dispatch(addQuestion(newQuestion)); // 질문 추가 액션 디스패치
    // 스크롤 위치를 최하단으로 이동
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <div className="absolute bottom-8 right-8 flex flex-col items-center justify-center">
      <button
        onClick={handleAddQuestion}
        className="flex h-12 w-12 transform items-center justify-center rounded-full bg-violet-500 text-2xl text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-violet-600 active:scale-95"
        aria-label="Add Question" // 접근성 고려
      >
        +
      </button>
    </div>
  );
};

export default Sidebar;
