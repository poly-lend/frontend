"use client";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0a0a0a", paper: "#0a0a0a" },
    text: { primary: "#ededed", secondary: "rgba(237,237,237,0.7)" },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: { root: { color: "rgba(237,237,237,0.7)" } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#ededed",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(237,237,237,0.3)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ededed",
          },
        },
        input: {
          color: "#ededed",
          "&&:-webkit-autofill": {
            WebkitTextFillColor: "#ededed",
            WebkitBoxShadow: "0 0 0 1000px #0a0a0a inset",
          },
        },
      },
    },
  },
});
