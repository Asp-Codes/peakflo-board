// src/theme/index.ts
import { createTheme } from '@mui/material/styles';
import { colors } from './colors';

// Create Material UI theme using your custom colors
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
    success: {
      main: colors.success,
    },
    error: {
      main: colors.error,
    },
    info: {
      main: colors.info,
    },
    warning: {
      main: colors.warning,
    },
  },
});
