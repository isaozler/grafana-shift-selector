import React from 'react';

import { config } from '@grafana/runtime';
import { keyframes, styled } from '@stitches/react';

const colors: any = config.theme.colors;

const load = keyframes({
  '0%': { width: '0%' },
  '100%': { width: '100%' },
});

export const Bar = styled('div', {
  width: '100%',
  height: 4,
  marginTop: -16,
  marginBottom: 12,
  position: 'relative',
  '&:after': {
    content: '',
    position: 'absolute',
    top: 0,
    left: 0,
    background: colors.border1,
    width: 10,
    height: '100%',
    animationName: load,
    animationDuration: 'inherit',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
});

export const ProgressBar = ({ refresh, renderCount }: { refresh: string; renderCount: number }) => {
  return <Bar data-count={renderCount} style={{ animationDuration: `${refresh}ms` }} />;
};
