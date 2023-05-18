import { config } from '@grafana/runtime';
import { styled } from '@stitches/react';

const palette: any = config.theme.palette;
const colors: any = config.theme.colors;

export const RangeButtonComp = styled('button', {
  width: '30px',
  height: '30px',
  borderRadius: '0 !important',
  '&:hover': {
    background: 'black',
    color: 'white',
  },
  '&::before': {
    fontSize: '20px',
  },
  variants: {
    isDark: {
      true: {
        borderLeft: `1px solid ${colors.border2}`,
        backgroundColor: palette.gray1,
      },
      false: {
        borderLeft: `1px solid ${colors.border2}`,
      },
    },
    isActive: {
      true: {
        backgroundColor: palette.orange,
        color: 'white',
      },
    },
  },
  '&.type--icon-only': {
    '&:before': {
      display: 'unset',
      margin: 'unset !important',
    },
  },
  '&.type--text-only': {
    whiteSpace: 'nowrap',
    width: 'unset',
    '&:before': {
      content: 'unset',
    },
  },
  '&.type--text-and-icon': {
    whiteSpace: 'nowrap',
    width: 'unset',
  },
  '&.input-type': {
    '&--start': {
      flexDirection: 'row-reverse',
      '&:before': {
        display: 'inline-block',
        marginLeft: 10,
      },
    },
    '&--end, &--start-end': {
      '&:before': {
        display: 'inline-block',
        marginRight: 10,
      },
    },
  },
});

export const ShiftOptionsWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  variants: {
    viewType: {
      row: {
        flexGrow: 1,
        flexShrink: 1,
      },
    },
  },
});

export const ShiftsWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  margin: '0 0 10px 0',
  justifyContent: 'space-between',
  marginLeft: '10px',
  padding: '4px 4px 0 4px',
  variants: {
    viewType: {
      column: {
        flexDirection: 'column',
        justifyContent: 'unset',
        margin: '0 0 10px 0',
      },
    },
    isDark: {
      true: {
        border: `1px solid ${palette.gray1}`,
      },
      false: {
        border: `1px solid ${colors.border2}`,
      },
    },
    isSingleOption: {
      true: {
        padding: 0,
        border: 'none',
      },
    },
    isRealtime: {
      true: {
        borderColor: palette.orange,
      },
    },
  },
});

export const ShiftLabel = styled('span', {
  display: 'flex',
  width: '100%',
  maxWidth: '130px',
  alignItems: 'center',
  fontWeight: 'bold',
  marginBottom: ' 4px',
  marginLeft: ' 4px',
  variants: {
    viewType: {
      column: {
        maxWidth: '100%',
      },
      row: {
        maxWidth: '130px',
      }
    },
  }
});

export const ShiftButtonsWrapper = styled('div', {
  display: 'flex',
  flexGrow: '1',
  flexShrink: '1',
  flexWrap: 'wrap',
  justifyContent: 'stretch',
});

export const ShiftButton = styled('button', {
  position: 'relative',
  display: 'flex',
  flexGrow: 1,
  flexShrink: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  paddingLeft: '40px',
  marginBottom: '4px',
  borderRadius: '0px',
  border: '1px solid transparent',
  padding: '0 10px',

  "&[class*='mdi-']::before": {
    marginRight: '5px',
    fontSize: '24px',
    // position: 'absolute',
    // left: '10px',
  },

  '&-invaliddata pre': {
    display: 'inline',
    color: 'red',
  },

  '&-nodata .feedback, &-nobrewery .feedback': {
    height: '35px',
    lineHeight: '35px',
  },

  variants: {
    isDark: {
      true: {
        backgroundColor: palette.gray1,
        color: palette.white,
        borderColor: colors.formInputBorder,
        '&:hover': {
          backgroundColor: 'black',
          borderColor: colors.formInputBorderHover,
          color: 'white',
        },
      },
      false: {
        backgroundColor: 'whitesmoke',
        color: palette.gray10,
        borderColor: colors.formInputBorder,
        '&:hover': {
          backgroundColor: 'black',
          borderColor: colors.formInputBorderHover,
          color: 'white',
        },
      },
    },
    isActive: {
      true: {
        backgroundColor: palette.orange,
        color: palette.white,
        borderColor: palette.orange,
      },
    },
    isRealtime: {
      true: {
        content: '',
      },
      false: {},
    },
  },
});

export const ShiftLabelSpan = styled('span', {
  display: 'block',
  maxWidth: '100%',
  overflow: 'hidden',
})

export const SelectorInputs = styled('div', {
  flexDirection: 'column',
  flexBasis: 0,
  flexGrow: 0,
  flexShrink: 1,
});

export const ProductionDay = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '6px',
  padding: '0 0 0 4px !important',
  justifyContent: 'space-between',
  alignItems: 'center',

  span: {
    display: 'flex',
    whiteSpace: 'nowrap',
    flexGrow: 1,
    width: '100%',
    fontWeight: 'bold',
  },

  '.production-day-selector': {
    maxWidth: '100px',
    textAlign: 'right',
    marginRight: '10px',
    cursor: 'pointer',

    '&:hover': {
      textDecoration: 'underline',
    },
  },
  variants: {
    isDark: {
      true: {
        border: `1px solid ${palette.gray1}`,
      },
      false: {
        border: `1px solid ${colors.border2}`,
      },
    },
  },
});

export const ShiftSelectorWrapper = styled('div', {});

export const ShiftSelectorContainer = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',

  variants: {
    viewType: {
      column: {
        flexDirection: 'column',
        select: {
          width: '100%',
          marginBottom: '30px',
        },
      },
    },
  },
});

export const Alerts = styled('div', {
  padding: '10px 20px',
  width: '100%',
  marginBottom: '20px',
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
  color: 'white',

  variants: {
    type: {
      brandDanger: {
        backgroundColor: palette.brandDanger,
        button: {
          color: 'black',
        },
      },
      brandWarning: {
        backgroundColor: palette.brandWarning,
        color: 'black',
      },
      brandPrimary: {
        backgroundColor: palette.brandPrimary,
      },
      brandSuccess: {
        backgroundColor: palette.brandSuccess,
      },
    },
  },

  button: {
    border: '1px solid rgba(0, 0, 0, 1)',
    background: 'rgba(255, 255, 255, 0.5)',
    width: '20px',
    minWidth: '20px',
    height: '20px',
    flexShrink: 0,
    lineHeight: '16px',
    padding: 0,
    margin: 0,
    fontWeight: 'bold',
    marginLeft: 16,
  },
});
