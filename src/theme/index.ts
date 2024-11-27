// src/theme/index.ts
import { createTheme } from "@mui/material/styles";
import { colors } from "./colors";

export const Theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    background: {
      default: colors.background,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
  },
});
