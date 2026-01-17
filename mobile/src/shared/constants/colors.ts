export const Colors = {
  primary: {
    main: '#3498db',
    light: '#5dade2',
    dark: '#2980b9',
  },
  semantic: {
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
    info: '#3498db',
  },
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
  },
  background: {
    default: '#F9F9FC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#0E121B',
    secondary: '#64748B',
    disabled: '#9E9E9E',
  },
  border: {
    light: '#E2E8F0',
    dark: '#CBD5E1',
  },
} as const;

export type ColorPalette = typeof Colors;
