import { styled } from '@stitches/react';

export const Dl = styled('dl', {
  display: 'inline-block',
  '& > dt': {
    float: 'left',
    clear: 'left',
    marginTop: 2,
  },
  '& > dd': {
    marginLeft: 4,
    padding: '2px 8px',
    backgroundColor: 'red',
    color: 'white',
    fontWeight: 'bold',
    float: 'left',
    height: 26,
  },
});

export const DebugShiftGroupTable = styled('div', {
  padding: 4,
  border: 'solid 1px red',
  marginBottom: 4,
  '& > div': {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    margin: 4,
  },
});

export const DebugShiftTable = styled('div', {
  padding: 8,
  border: 'solid 1px green',
  marginBottom: 4,
  fontSize: 9,
  variants: {
    isActive: {
      true: {
        borderTop: '10px solid rgba(255, 0,0, 0.5)',
      },
    },
    isClosest: {
      true: {
        borderBottom: '10px dashed purple',
      },
    },
    isManualActive: {
      true: {
        backgroundColor: 'blue !important',
      },
    },
  },
});
