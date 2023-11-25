import React from 'react';

import { config } from '@grafana/runtime';
import { keyframes, styled } from '@stitches/react';

const colors: any = config.theme.colors;

const load = keyframes({
  '0%': { width: '0%' },
  '100%': { width: 'calc(100% + 16px)' },
});

export const Bar = styled('div', {
  width: '100%',
  height: 4,
  marginTop: -16,
  marginBottom: 12,
  position: 'relative',
  '&:before': {
    content: '',
    position: 'absolute',
    top: -24,
    left: -8,
    background: colors.border1,
    width: 'calc(100% + 16px)',
    height: '100%',
  },
  '&:after': {
    content: '',
    position: 'absolute',
    top: -24,
    left: -8,
    background: colors.border2,
    width: 8,
    height: '100%',
    animationName: load,
    animationDuration: 'inherit',
    animationTimingFunction: 'ease-out',
    animationIterationCount: 'infinite',
  },
});

export const ProgressBar = ({ refresh, renderCount }: { refresh: string; renderCount: number }) => {
  return <Bar data-count={renderCount} style={{ animationDuration: `${refresh}ms` }} />;
};
