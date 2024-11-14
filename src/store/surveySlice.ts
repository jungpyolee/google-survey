import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Question {
  id: string;
  type: string;
  text: string;
  options?: string[];
  isRequired: boolean;
}

interface SurveyState {
  title: string;
  description: string;
  questions: Question[];
}

const initialState: SurveyState = {
  title: "제목이 없는 설문지입니다.",
  description: "",
  questions: [],
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
    removeQuestion: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter((q) => q.id !== action.payload);
    },
    updateQuestion: (state, action: PayloadAction<Question>) => {
      const index = state.questions.findIndex(
        (q) => q.id === action.payload.id,
      );
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
    },
  },
});

export const {
  setTitle,
  setDescription,
  addQuestion,
  removeQuestion,
  updateQuestion,
} = surveySlice.actions;

export default surveySlice.reducer;
