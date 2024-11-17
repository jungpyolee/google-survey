import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import { Box, Typography } from "@mui/material";

interface Question {
  id: string;
  text?: string;
  type: string;
  options?: string[];
  isRequired?: boolean;
  isEtc?: boolean;
}
const ModalContent: React.FC<{
  open: boolean;
  onClose: () => void;
  updatedFormValues: any[];
  questions: Question[];
}> = ({ open, onClose, updatedFormValues, questions }) => {
  return (
    // return 문 추가
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={onClose}
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
  );
};

export default ModalContent;
