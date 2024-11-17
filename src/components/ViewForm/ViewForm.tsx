import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Box, Typography } from "@mui/material";
import ModalContent from "./ModalContent";
import Bottombar from "../Bottombar";
import ViewFormQuestion from "./ViewFormQuestion";

const ViewForm: React.FC = () => {
  const title = useSelector((state: RootState) => state.survey.title);
  const description = useSelector(
    (state: RootState) => state.survey.description,
  );
  const questions = useSelector((state: RootState) => state.survey.questions);

  const [formValues, setFormValues] = useState<
    { id: string; text: string; answer: string | string[] }[]
  >([]);
  const [updatedFormValues, setUpdatedFormValues] = useState<
    { id: string; text: string; answer: string | string[] }[]
  >([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [otherOptionValues, setOtherOptionValues] = useState<{
    [key: string]: string;
  }>({});
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  useEffect(() => {
    const initialFormValues = questions.map((question) => ({
      id: question.id,
      text: question.text || "",
      answer: question.type === "checkbox" ? [] : "",
    }));
    setFormValues(initialFormValues);
  }, [questions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    const updatedData = formValues.map((item) => {
      if (item.answer === "기타") {
        return {
          ...item,
          answer: otherOptionValues[item.id] || "",
        };
      }
      // 체크박스의 경우 배열에 있는 기타 값을 otherOptionValues에서 가져옴
      if (Array.isArray(item.answer) && item.answer.includes("기타")) {
        return {
          ...item,
          answer: item.answer.map((v) =>
            v === "기타" ? otherOptionValues[item.id] : v,
          ),
        };
      }

      return item;
    });

    updatedData.forEach((item) => {
      const question = questions.find((q) => q.id === item.id);
      if (question?.isRequired && (!item.answer || item.answer.length === 0)) {
        errors.push(item.id); // 오류 추가
      }
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
    } else {
      setUpdatedFormValues(updatedData);
      setIsModalOpen(true);
    }
  };

  const handleClear = () => {
    if (
      window.confirm("작성 중인 내용이 모두 사라집니다. 정말 지우시겠습니까?")
    ) {
      setFormValues(
        questions.map((question) => ({
          id: question.id,
          text: question.text,
          answer: question.type === "checkbox" ? [] : "",
        })),
      );
      setValidationErrors([]);
      setOtherOptionValues({});
      setUpdatedFormValues([]);
    }
  };
  return (
    <>
      <Box className="min-h-screen space-y-4 bg-violet-100 p-6">
        <Box className="mx-auto max-w-3xl rounded-lg bg-white shadow-md">
          <div className="h-3 rounded-t-lg bg-violet-600"></div>
          <div className="p-8">
            <Typography variant="h3" color="standard" className="mb-2">
              {title}
            </Typography>
            <Typography
              className="border-b pb-4 pt-2"
              variant="h5"
              color="textSecondary"
            >
              {description}
            </Typography>
            <p className="pt-4 text-xs text-red-500">필수 항목 *</p>
          </div>
        </Box>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {questions.map((question) => (
            <ViewFormQuestion
              key={question.id}
              question={question}
              formValues={formValues}
              setFormValues={setFormValues}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
              otherOptionValues={otherOptionValues}
              setOtherOptionValues={setOtherOptionValues}
            />
          ))}
          <Bottombar handleClear={handleClear} handleSubmit={handleSubmit} />
        </form>
      </Box>

      <ModalContent
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        updatedFormValues={updatedFormValues}
        questions={questions}
      />
    </>
  );
};

export default ViewForm;
