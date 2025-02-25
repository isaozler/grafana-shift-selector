import { styled } from '@stitches/react';

export const ShiftConfiguratorInput = styled('div', {
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

export const ShiftConfiguratorButton = styled('button', {
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '12px',
  fontWeight: '500',
  fontFamily: 'Inter, Helvetica, Arial, sans-serif',
  padding: '0px 7px',
  height: '24px',
  lineHeight: '22px',
  verticalAlign: 'middle',
  cursor: 'pointer',
  borderRadius: '2px',
  background: 'rgba(36, 41, 46, 0.08)',
  color: 'rgb(36, 41, 46)',
  border: '1px solid rgba(36, 41, 46, 0.12)',
  transition:
    'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  touchAction: 'manipulation',
  '&:hover': {
    background: 'rgba(36, 41, 46, 0.15)',
    color: 'rgb(36, 41, 46)',
    boxShadow: 'rgba(24, 26, 27, 0.2) 0px 1px 2px',
    borderColor: 'rgba(90, 94, 98, 0.12)',
  },
  '&[disabled]': {
    background: 'rgba(36, 41, 46, 0.08)',
    color: 'rgba(36, 41, 46, 0.5)',
    borderColor: 'rgba(36, 41, 46, 0.12)',
    cursor: 'not-allowed',
  },
  '& > svg': {
    display: 'inline-block',
    fill: 'currentcolor',
    flexShrink: 0,
    lineHeight: 0,
    verticalAlign: 'middle',
    marginRight: '4px',
  },
});

export const ShiftConfiguratorInputRow = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: '12px',
  '& > div': {
    flexGrow: 1,
  },
});

export const ActionButtonsWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  marginTop: 16,
  gap: 8,
});
