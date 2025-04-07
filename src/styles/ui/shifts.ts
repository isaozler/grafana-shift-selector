import { styled } from '@stitches/react';
import { config } from '@grafana/runtime';
import { containerMinHeight, containerMinWidth } from './container';

const { colors, spacing, shape } = config.theme2;

export const Wrapper = styled('div', {
  containerType: 'size',
  containerName: 'shifts',
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
  gap: 0,
  minHeight: 24,
});

export const Container = styled('div', {
  containerType: 'size',
  containerName: 'shifts',
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
  gap: spacing.x1,
  height: '100%',
  flexWrap: 'wrap',

  '@container shifts (height < 40px)': {
    gap: spacing.x0_25,
  },

  [`@container panel (width < ${containerMinWidth})`]: {
    flexDirection: 'column',
  },
  
  [`@container panel (width < 60px)`]: {
    flexWrap: 'unset',
  },
});

export const Shift = styled('div', {
  flex: 1,
  whiteSpace: 'nowrap',
  // overflow: 'hidden',
  textOverflow: 'ellipsis',
  // height: '100%',
  minHeight: 24,

  '> div': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
  },

  [`@container panel (width < ${containerMinWidth})`]: {
    // background: 'green',
  },

  '@container shifts (height < 40px)': {
    height: '24px !important',
    minHeight: '24px !important',

    button: {
      lineHeight: '24px',
      fontSize: 12,
      height: '24px !important',
    },
  },
});

export const ButtonWrapper = styled('div', {
  position: 'relative',
  width: '100%',
  lineHeight: 1,
  height: 24,
});

export const ButtonLabel = styled('span', {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.x1,
});

export const ShiftTimeRange = styled('span', {
  background: colors.action.disabledBackground,
  color: colors.text.maxContrast,
  fontSize: 'smaller',
  borderRadius: shape.radius.default,
  lineHeight: '18px',
  padding: `0 ${spacing.x0_5}`,
  fontWeight: 'normal',
});

export const Horizontal = styled('div', {
  height: '100%',
});
export const Vertical = styled('div', {
  width: '100%',
});

export const Button = styled('button', {
  fontFamily: 'Kode Mono, monospace',
  position: 'relative',
  border: 'none',
  color: colors.text.primary,
  background: colors.background.secondary,
  zIndex: 1,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing.x1,

  '&[disabled]': {
    cursor: 'not-allowed',
  },
  
  '&::after': {
    content: '',
    display: 'block',
    position: 'absolute',
    top: `calc(100% + ${spacing.x0_25})`,
    left: 0,
    width: '100%',
    height: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,

    '@container shifts (height > 40px)': {
      top: `calc(100% + ${spacing.x1})`,
    },

    [`@container shifts (height > 40px) and (width < ${containerMinWidth})`]: {
      top: 0,
      left: `calc(0% - ${spacing.x2})`,
      width: 6,
      height: '100%',
      borderBottomLeftRadius: 6,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
  
  '&[data-active="true"]': {
    color: colors.text.maxContrast,
    // background: colors.background.primary,
    background: colors.action.selected,
    fontWeight: 'bold',
    
    '&::after': {
      background: colors.gradients.brandHorizontal + ' !important',
    },
    
    '@container shifts (height < 40px)': {
      '&[data-is-fixed="true"]': {
        svg: {
          width: 16,
        }
      }
    },
  },
  '&[data-active="false"]': {},
  '&[data-closest="true"]': {
    background: 'yellow',
  },
  '&[data-manual-active="true"] ~ [data-active="true"]': {
    fontWeight: 'normal',
  },
  '&[data-manual-active="true"]': {
    fontWeight: 'bold',
    '&::after': {
      background: colors.success.border + ' !important',
    },
  },
  '&[data-manual-active="false"]': {},
  '&:hover': {
    background: colors.action.hover,
    color: colors.text.maxContrast,
  },

  [`@container shifts (width > 60px) and (width < ${containerMinWidth})`]: {
    height: '100% !important',
    flexDirection: 'column',
  },

  [`@container shifts (width < 60px)`]: {
    writingMode: 'vertical-rl',
    textOrientation: 'sideways',
    justifyContent: 'center',
    alignItems: 'center',

    [`${ShiftTimeRange}`]: {
      padding: `${spacing.x1} 0`,
    },
  },

  [`@container shifts (width < 60px) and (height < ${containerMinHeight})`]: { 
    [`${ButtonLabel}`]: {
      display: 'none',
    },
    [`${ShiftTimeRange}`]: {
      fontSize: 'unset',
      backgroundColor: 'transparent',
    },
  },

  [`@container shifts (width < 200px) and (height < 200px)`]: {
    gap: 0,
  },

});

export const ShiftButtonProgress = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  backgroundColor: colors.border.medium,
  overflow: 'hidden',
  zIndex: 0,
  opacity: 0.125,

  '> div': {
    backgroundColor: colors.info.border,
    transition: 'width 0.3s ease, height 0.3s ease',
  },

  [`${Vertical}`]: {
    display: 'none',
  },

  [`@container shifts (width < 60px)`]: {
    [`${Horizontal}`]: {
      display: 'none',
    },
    [`${Vertical}`]: {
      display: 'block',
    },
  },
});

