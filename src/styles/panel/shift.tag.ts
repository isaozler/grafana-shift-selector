import { styled } from '@stitches/react';

export const AvailableShiftWrapper = styled('div', {
  padding: 4,
});

export const AvailableShiftTagWrapper = styled('div', {
  display: 'inline-flex',
  alignItems: 'center',
  lineHeight: '1',
  background: 'rgb(244, 245, 245)',
  borderRadius: '2px',
  margin: '2px 8px 2px 0px',
  padding: '2px 0px 2px 8px',
  color: 'rgb(36, 41, 46)',
  fontSize: '12px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  '&:hover': {
    background: 'rgb(236, 237, 237)',
  },
  variants: {
    isActive: {
      true: {
        border: '1px solid black',
      },
    },
  },
});

export const AvailableShiftTagLabel = styled('div', {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  cursor: 'pointer',
  '&:hover': {},
});

export const AvailableShiftTagRemoveButton = styled('button', {
  zIndex: 0,
  position: 'relative',
  boxShadow: 'none',
  border: 'none',
  display: 'inline-flex',
  background: 'transparent',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 0,
  color: 'rgb(36, 41, 46)',
  margin: '0px 4px',
  cursor: 'pointer',
  '&:before': {
    zIndex: -1,
    position: 'absolute',
    opacity: 0,
    width: 22,
    height: 22,
    borderRadius: 2,
    content: '""',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionProperty: 'opacity',
  },
  '&:hover': {
    '&::before': {
      backgroundColor: 'rgba(36, 41, 46, 0.12)',
      opacity: 1,
    },
  },
  '& > svg': {
    marginBottom: 0,
    display: 'inline-block',
    fill: 'currentcolor',
    flexShrink: 0,
    lineHeight: 0,
    verticalAlign: 'baseline',
  },
});
