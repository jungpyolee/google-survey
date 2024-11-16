import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import {
  TextField,
  Typography,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Box,
  Select,
  MenuItem,
  InputLabel,
  TextareaAutosize,
} from "@mui/material";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"; // 아이콘 추가
import Bottombar from "../components/Bottombar";

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
  const [validationErrors, setValidationErrors] = useState<string[]>([]); // 유효성 검사 상태
  const [otherOptionValues, setOtherOptionValues] = useState<{
    [key: string]: string;
  }>({});
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  useEffect(() => {
    const initialFormValues = questions.map((question) => ({
      id: question.id,
      text: question.text,
      answer: question.type === "checkbox" ? [] : "",
    }));
    setFormValues(initialFormValues);
  }, [questions]);

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
                error={validationErrors.includes(question.id)} // MUI 스타일 적용
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
                      formValues.find((item) => item.id === question.id)
                        ?.answer || ""
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
                      formValues.find((item) => item.id === question.id)
                        ?.answer || ""
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
                    {question.options.map(
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
                          onChange={() =>
                            handleOptionChange(question.id, "기타", true)
                          }
                        />
                        {formValues.find((item) => item.id === question.id)
                          ?.answer === "기타" && (
                          <TextField
                            variant="standard"
                            placeholder="기타"
                            onChange={(e) =>
                              handleOtherInputChange(
                                question.id,
                                e.target.value,
                              )
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
                    {question.options.map(
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
                              onChange={() =>
                                handleCheckboxChange(question.id, "기타")
                              }
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
                              handleOtherInputChange(
                                question.id,
                                e.target.value,
                              )
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
                        formValues.find((item) => item.id === question.id)
                          ?.answer || ""
                      }
                      onChange={(e) =>
                        handleOptionChange(
                          question.id,
                          e.target.value as string,
                          false,
                        )
                      }
                    >
                      {question.options.map((option, index) => (
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
          ))}

          <Bottombar
            handleClear={handleClear}
            handleSubmit={handleSubmit} // handleSubmit 함수 전달
          />
        </form>
      </Box>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 800,
            minWidth: 600,
            borderRadius: "md",
            p: 4,
            boxShadow: "lg",
            overflow: "auto",
            maxHeight: "80vh",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />

          <Typography variant="h4" id="modal-title" sx={{ mb: 2 }}>
            제출한 내용
          </Typography>
          <Typography
            id="modal-desc"
            variant="body1"
            sx={{ mb: 4, color: "text.secondary" }}
          >
            제출한 내용을 확인해보세요!
          </Typography>
          <Box sx={{ mb: 4 }}>
            {updatedFormValues.map((item) => (
              <Box key={item.id} sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {questions.find((q) => q.id === item.id)?.text}
                </Typography>
                <Typography variant="body2">
                  {Array.isArray(item.answer)
                    ? item.answer.join(", ")
                    : item.answer}
                </Typography>
              </Box>
            ))}
          </Box>
        </Sheet>
      </Modal>
    </>
  );
};

export default ViewForm;
