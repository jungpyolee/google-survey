import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { setDescription, setTitle } from "../store/surveySlice";
import TextareaAutosize from "react-textarea-autosize";
import clsx from "clsx";

const Title: React.FC = () => {
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);

  const dispatch = useDispatch();
  const title = useSelector((state: RootState) => state.survey.title);
  const description = useSelector(
    (state: RootState) => state.survey.description,
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setTitle(e.target.value));
  };
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    dispatch(setDescription(e.target.value));
  };

  return (
    <div className="rounded-lg bg-white shadow-md">
      <div className="h-3 rounded-t-lg bg-violet-600"></div>
      <div className="px-8 py-6">
        <TextareaAutosize
          className="mt-4 h-auto w-full resize-none text-3xl focus:outline-none focus:ring-0"
          value={title}
          minRows={1}
          maxRows={5}
          onChange={handleTitleChange}
          placeholder="설문지 제목"
          onFocus={() => setTitleFocused(true)}
          onBlur={() => setTitleFocused(false)}
        />
        <div
          className={clsx(
            "h-0.5",
            titleFocused ? "animate-expand bg-violet-600" : "bg-gray-200",
          )}
        ></div>
        <TextareaAutosize
          className="mt-4 w-full resize-none text-sm focus:outline-none focus:ring-0"
          value={description}
          minRows={1}
          maxRows={5}
          onChange={handleDescriptionChange}
          placeholder="설문지 설명"
          onFocus={() => setDescriptionFocused(true)}
          onBlur={() => setDescriptionFocused(false)}
        />
        <div
          className={clsx(
            "h-0.5",
            descriptionFocused ? "animate-expand bg-violet-600" : "bg-gray-200",
          )}
        ></div>
      </div>
      {/* 설문지 설명 */}
    </div>
  );
};

export default Title;
