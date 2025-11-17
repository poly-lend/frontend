"use client";
import { createTheme } from "@mui/material/styles";

const BRAND_NAVY = "#091926";
const BRAND_YELLOW = "#d7ad4d";

export const theme = createTheme({
  palette: {
    mode: "dark",
    // Accent drives interactive elements (buttons, links, active nav)
    primary: {
      main: BRAND_YELLOW,
      light: "#e5c26e",
      dark: "#b88d2f",
      contrastText: BRAND_NAVY,
    },
    // Navy as secondary brand swatch when needed
    secondary: {
      main: BRAND_NAVY,
      light: "#0c2233",
      dark: "#06121b",
      contrastText: "#ededed",
    },
    background: {
      default: BRAND_NAVY,
      paper: "#0c2233",
    },
    text: {
      primary: "#ededed",
      secondary: "rgba(237,237,237,0.72)",
    },
    divider: "rgba(255,255,255,0.08)",
    success: { main: "#22c55e" },
    warning: { main: "#f59e0b" },
    error: { main: "#ef4444" },
    info: { main: "#60a5fa" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
        containedPrimary: {
          // hover/active grounded in brand yellow
          "&:hover": { backgroundColor: "#b88d2f" },
          "&:active": { backgroundColor: "#a47a24" },
        },
        outlinedPrimary: {
          borderColor: "rgba(215,173,77,0.5)",
          "&:hover": {
            borderColor: BRAND_YELLOW,
            backgroundColor: "rgba(215,173,77,0.08)",
          },
        },
        outlinedSecondary: {
          color: "#ededed",
          borderColor: "rgba(255,255,255,0.28)",
          "&:hover": {
            color: "#ededed",
            borderColor: "#ededed",
            backgroundColor: "rgba(255,255,255,0.06)",
          },
          "&.Mui-disabled": {
            color: "rgba(237,237,237,0.38)",
            borderColor: "rgba(255,255,255,0.12)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#ededed",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.08)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ededed",
          },
        },
        input: {
          color: "#ededed",
          "&&:-webkit-autofill": {
            WebkitTextFillColor: "#ededed",
            WebkitBoxShadow: "0 0 0 1000px #0c2233 inset",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: { root: { color: BRAND_YELLOW } },
    },
  },
});
