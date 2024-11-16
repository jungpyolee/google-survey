import React from "react";
import { Button } from "@mui/material";

interface BottombarProps {
  handleSubmit: React.FormEventHandler<HTMLButtonElement>;
  handleClear: () => void;
}

const Bottombar: React.FC<BottombarProps> = ({ handleSubmit, handleClear }) => {
  return (
    <div className="mx-auto mt-4 flex max-w-3xl items-center justify-between px-4">
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
