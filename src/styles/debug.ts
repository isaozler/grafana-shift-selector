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
  padding: 4,
  border: 'solid 1px green',
  marginBottom: 4,
  fontSize: 9,
  variants: {
    isActive: {
      true: {
        backgroundColor: 'red',
        color: 'white',
      },
    },
    isClosest: {
      true: {
        backgroundColor: 'black',
        color: 'white',
      },
    },
  },
});
