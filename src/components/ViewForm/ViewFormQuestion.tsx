import React from "react";
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  TextareaAutosize,
  Checkbox,
  Box,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"; // 아이콘 추가

// 타입 정의
interface FormValue {
  id: string;
  text: string;
  answer: string | string[];
}

interface ViewFormQuestionProps {
  question: {
    id: string;
    text: string;
    type: string;
    options?: string[];
    isRequired?: boolean;
    isEtc?: boolean;
  };
  formValues: FormValue[];
  setFormValues: React.Dispatch<React.SetStateAction<FormValue[]>>;
  validationErrors: string[];
  setValidationErrors: React.Dispatch<React.SetStateAction<string[]>>;
  otherOptionValues: { [key: string]: string };
  setOtherOptionValues: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
}

const ViewFormQuestion: React.FC<ViewFormQuestionProps> = ({
  question,
  formValues,
  setFormValues,
  validationErrors,
  setValidationErrors,
  otherOptionValues,
  setOtherOptionValues,
}) => {
  const handleOptionChange = (
    questionId: string,
    value: string,
    isEtc: boolean,
  ) => {
    setFormValues((prev) =>
      prev.map((item) =>
        item.id === questionId
          ? {
              ...item,
              answer: isEtc ? "기타" : value,
            }
          : item,
      ),
    );
    setValidationErrors((prev) => prev.filter((id) => id !== questionId)); // 유효성 검사 제거
  };

  const handleOtherInputChange = (questionId: string, value: string) => {
    setOtherOptionValues((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // question.id에 해당하는 formValue 찾기
  const currentFormValue = formValues.find((item) => item.id === question.id);

  const handleCheckboxChange = (id: string, value: string) => {
    setFormValues((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              answer: item.answer.includes(value)
                ? (item.answer as string[]).filter((v) => v !== value)
                : [...(item.answer as string[]), value],
            }
          : item,
      ),
    );
    setValidationErrors((prev) =>
      prev.filter((questionId) => questionId !== id),
    ); // 유효성 검사 제거
  };

  return (
    <Box
      key={question.id}
      className={`mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-md ${
        validationErrors.includes(question.id)
          ? "border border-red-500" // 유효성 검사 오류 시 테두리 붉게
          : ""
      }`}
    >
      <FormControl
        component="fieldset"
        className="relative mb-6 w-full"
        error={validationErrors.includes(question.id)}
      >
        <FormLabel className="mb-4">
          <span className="text-lg font-medium text-gray-700">
            {question.text}
          </span>
          {question.isRequired && (
            <span className="font-bold text-red-500"> *</span>
          )}
        </FormLabel>

        {/* short-answer */}
        {question.type === "short-answer" && (
          <TextField
            fullWidth
            variant="standard"
            placeholder="내 답변"
            value={
              formValues.find((item) => item.id === question.id)?.answer || ""
            }
            onChange={(e) =>
              handleOptionChange(question.id, e.target.value, false)
            }
          />
        )}

        {/* long-answer */}
        {question.type === "long-answer" && (
          <TextareaAutosize
            className="mt-4 h-auto w-full resize-none border-b border-gray-500 focus:outline-none focus:ring-0"
            minRows={1}
            maxRows={5}
            value={
              formValues.find((item) => item.id === question.id)?.answer || ""
            }
            onChange={(e) =>
              handleOptionChange(question.id, e.target.value, false)
            }
            placeholder="내 답변"
          />
        )}

        {/* multiple-choice */}
        {question.type === "multiple-choice" && (
          <RadioGroup>
            {question.options?.map(
              (option, index) =>
                option !== "기타..." && (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio />}
                    label={option}
                    checked={
                      formValues.find((item) => item.id === question.id)
                        ?.answer === option
                    }
                    onChange={() =>
                      handleOptionChange(question.id, option, false)
                    }
                  />
                ),
            )}

            {question.isEtc && (
              <Box className="flex items-center">
                <FormControlLabel
                  value="기타"
                  control={<Radio />}
                  label="기타:"
                  checked={
                    formValues.find((item) => item.id === question.id)
                      ?.answer === "기타"
                  }
                  onChange={() => handleOptionChange(question.id, "기타", true)}
                />
                {formValues.find((item) => item.id === question.id)?.answer ===
                  "기타" && (
                  <TextField
                    variant="standard"
                    placeholder="기타"
                    onChange={(e) =>
                      handleOtherInputChange(question.id, e.target.value)
                    }
                  />
                )}
              </Box>
            )}
          </RadioGroup>
        )}

        {/* checkbox */}
        {question.type === "checkbox" && (
          <Box className="flex flex-col">
            {question.options?.map(
              (option, index) =>
                option !== "기타..." && (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={
                          formValues
                            .find((item) => item.id === question.id)
                            ?.answer.includes(option) || false
                        }
                        onChange={() =>
                          handleCheckboxChange(question.id, option)
                        }
                      />
                    }
                    label={option}
                  />
                ),
            )}

            {/* 기타 옵션 */}
            {question.isEtc && (
              <Box className="flex items-center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        formValues
                          .find((item) => item.id === question.id)
                          ?.answer.includes("기타") || false
                      }
                      onChange={() => handleCheckboxChange(question.id, "기타")}
                    />
                  }
                  label="기타:"
                />
                {formValues
                  .find((item) => item.id === question.id)
                  ?.answer.includes("기타") && (
                  <TextField
                    variant="standard"
                    placeholder="기타"
                    onChange={(e) =>
                      handleOtherInputChange(question.id, e.target.value)
                    }
                  />
                )}
              </Box>
            )}
          </Box>
        )}

        {/* dropdown */}
        {question.type === "dropdown" && (
          <FormControl variant="standard" className="mt-4 w-1/2">
            <InputLabel id={`${question.id}-label`}>선택</InputLabel>
            <Select
              labelId={`${question.id}-label`}
              value={
                formValues.find((item) => item.id === question.id)?.answer || ""
              }
              onChange={(e) =>
                handleOptionChange(question.id, e.target.value as string, false)
              }
            >
              {question?.options?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {validationErrors.includes(question.id) && (
          <Box className="mt-2 flex items-center space-x-2 text-red-500">
            <ErrorOutlineIcon />
            <span>필수 입력 사항입니다.</span>
          </Box>
        )}
      </FormControl>
    </Box>
  );
};

export default ViewFormQuestion;
