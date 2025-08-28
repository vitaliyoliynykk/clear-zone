export const theme = {
  spacing: {
    xxs: '4px',
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xlg: '32px',
  },
  radius: {
    small: '4px',
    medium: '8px',
    round: '50%',
  },
  fontSize: {
    base: '1rem',
    lg: '1.5rem',
    xlg: '2rem',
  },
  colors: {
    white: '#ffffffde',
    lightBlue: '#d8e0ebff',

    grayLight: '#f2f4f7',
    gray: '#c4cdd5',
    grayDark: '#6e7a87',

    greenLight: '#e6f4ea',
    green: '#4caf50',
    greenDark: '#2e7d32',
  },
};

export type ThemeType = typeof theme;
