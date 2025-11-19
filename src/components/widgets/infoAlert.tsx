import { Alert } from "@mui/material";

export default function InfoAlert({ text }: { text: string }) {
  return (
    <Alert
      severity="info"
      className="mt-2"
      sx={{
        backgroundColor: "rgba(33, 150, 243, 0.1)",
        "& .MuiAlert-message": {
          fontSize: "0.8rem",
        },
      }}
    >
      {text}
    </Alert>
  );
}
