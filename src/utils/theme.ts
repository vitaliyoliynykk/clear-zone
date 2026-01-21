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
    gray: '#c3c4c5',
    grayDark: '#6e7a87',

    greenLightest: '#e6f4ea',
    greenLight: '#8da300ff',
    green: '#4caf50',
    greenDark: '#2e7d32',

    orange: '#d89f00ff',

    red: '#d80e00ff',
  },
};

export type ThemeType = typeof theme;
