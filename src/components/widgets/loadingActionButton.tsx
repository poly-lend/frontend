import { Box, Button, CircularProgress, type ButtonProps } from "@mui/material";
import { ReactNode } from "react";

type LoadingActionButtonProps = {
  children: ReactNode;
  loading?: boolean;
} & ButtonProps;

export default function LoadingActionButton({
  children,
  loading = false,
  disabled,
  ...buttonProps
}: LoadingActionButtonProps) {
  return (
    <Box sx={{ position: "relative" }}>
      <Button disabled={loading || disabled} {...buttonProps}>
        {children}
      </Button>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-12px",
            marginLeft: "-12px",
          }}
        />
      )}
    </Box>
  );
}
