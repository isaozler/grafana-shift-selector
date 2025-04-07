import { css } from '@stitches/react';

export const InputClass = css({
  display: 'block',
  padding: '0 8px',
  backgroundColor: '$FormInputBg',
  lineHeight: 1.57143,
  fontSize: 14,
  color: '$FormInputText',
  border: '1px solid rgba(36, 41, 46, 0.3)',
  position: 'relative',
  borderRadius: 2,
  height: '2.3rem',
  width: '100%',
  '&:focus': {
    outline: 'transparent dotted 2px',
    outlineOffset: 2,
    boxShadow: 'rgb(244, 245, 245) 0px 0px 0px 2px, rgb(56, 113, 220) 0px 0px 0px 4px',
    transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
    transitionDuration: '0.2s',
    transitionProperty: 'outline, outline-offset, box-shadow',
  },
  variants: {
    minContent: {
      true: {
        width: 'calc(100%/2)',
        minWidth: 'unset',
        maxWidth: '100%',
      },
    },
  },
});
