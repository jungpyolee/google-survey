import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Question {
  id: string;
  type: string;
  text: string;
  options: string[];
  isRequired: boolean;
  index: number;
  isEtc: boolean;
  etcIndex?: number;
}

interface SurveyState {
  title: string;
  description: string;
  questions: Question[];
}

const initialState: SurveyState = {
  title: "제목이 없는 설문지입니다.",
  description: "",
  questions: [
    {
      id: Date.now().toString(),
      type: "multiple-choice",
      text: "",
      isRequired: false,
      index: 0,
      options: ["옵션 1"],
      isEtc: false,
    },
  ],
};

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.push(action.payload);
    },
    copyQuestion: (state, action: PayloadAction<string>) => {
      // 복사할 질문은 그대로 들어오는것으로가정하고 현재 질문의 인덱스 바로 다음에 추가
      let id = Date.now().toString();

      const index = state.questions.findIndex((q) => q.id === action.payload);
      if (index !== -1) {
        const question = state.questions[index];
        state.questions.splice(index + 1, 0, {
          ...question,
          id,
        });
      }
      return state;
    },
    removeQuestion: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter((q) => q.id !== action.payload);
    },
    addOption: (state, action: PayloadAction<string>) => {
      const question = state.questions.find((q) => q.id === action.payload);
      if (question) {
        if (question.isEtc) {
          // 기타 옵션을 추가하는 경우 기타옵션을 항상 마지막인덱스로 유지하기 위해 끝에서 두번째에 추가

          question.options?.splice(question.options.length - 1, 0, "");
        } else {
          question.options?.push(`옵션 ${question.options.length + 1}`);
        }
      }
    },
    addEtcOption: (state, action: PayloadAction<string>) => {
      const question = state.questions.find((q) => q.id === action.payload);
      if (question) {
        question.options?.push("기타...");
        question.isEtc = true;
      }
    },
    removeOption: (
      state,
      action: PayloadAction<{ questionId: string; optionIndex: number }>,
    ) => {
      const question = state.questions.find(
        (q) => q.id === action.payload.questionId,
      );
      if (question) {
        // 기타 옵션을 삭제하는 경우
        if (
          question.isEtc &&
          question.options?.length - 1 === action.payload.optionIndex
        ) {
          question.isEtc = false;
        }

        question.options?.splice(action.payload.optionIndex, 1);
      }
    },

    updateQuestion: (state, action: PayloadAction<Question>) => {
      const index = state.questions.findIndex(
        (q) => q.id === action.payload.id,
      );
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
    },
    changeType: (
      state,
      action: PayloadAction<{ id: string; type: string }>,
    ) => {
      const question = state.questions.find((q) => q.id === action.payload.id);
      if (question) {
        question.type = action.payload.type;
        question.isEtc = false;
      }
    },
    clearSurvey: (state) => {
      state.title = "";
      state.description = "";
      state.questions = [];
    },
    submitSurvey: (state) => {},
    moveQuestion: (
      state,
      action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>,
    ) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.questions.splice(sourceIndex, 1);

      const updatedQuestions = [
        ...state.questions.slice(0, destinationIndex),
        removed,
        ...state.questions.slice(destinationIndex),
      ];

      state.questions = updatedQuestions;
    },
    moveOption: (
      state,
      action: PayloadAction<{
        questionId: string;
        sourceIndex: number;
        destinationIndex: number;
      }>,
    ) => {
      const { questionId, sourceIndex, destinationIndex } = action.payload;
      const question = state.questions.find((q) => q.id === questionId);

      if (question) {
        const [removed] = question.options.splice(sourceIndex, 1);
        question.options.splice(destinationIndex, 0, removed);
      }
    },
  },
});

export const {
  setTitle,
  setDescription,
  addQuestion,
  copyQuestion,
  removeQuestion,
  updateQuestion,
  addOption,
  addEtcOption,
  removeOption,
  changeType,
  clearSurvey,
  submitSurvey,
  moveQuestion,
  moveOption,
} = surveySlice.actions;

export default surveySlice.reducer;
