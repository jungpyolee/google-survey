import React from "react";
import Title from "../components/Title";
import Questions from "../components/Questions";
import Sidebar from "../components/Sidebar";
import Bottombar from "../components/Bottombar";
import { RemoveRedEye } from "@mui/icons-material";
import { Button } from "@mui/material";

const Edit: React.FC = () => {
  return (
    <div className="w-full bg-violet-100 p-8 md:mx-auto md:w-1/2">
      <div className="flex justify-end pb-1">
        <Button color="secondary" aria-label="미리보기" onClick={() => {}}>
          <RemoveRedEye />
          <span className="px-1 text-sm">미리 보기</span>
        </Button>
      </div>
      <div className="flex-1">
        <Title />
        <Questions />
      </div>
      <Bottombar />

      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8">
        <Sidebar />
      </div>
    </div>
  );
};

export default Edit;
