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
    darkBlue: 'rgb(163, 176, 194)',

    grayLight: '#f2f4f7',
    gray: '#c3c4c5',
    grayDark: '#6e7a87',
    grayTransparent: '#6e7a8733',

    greenLightest: '#e6f4ea',
    greenLight: '#8da300ff',
    green: '#4caf50',
    greenDark: '#2e7d32',

    yellowGreen: '#8bc34a',
    yellow: '#ffb300',

    orange: '#d89f00ff',

    red: '#d80e00ff',
    redOrange: '#f44336',
  },
  boxShadow: {
    elevation:
      ' rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
  },
};

export type ThemeType = typeof theme;
