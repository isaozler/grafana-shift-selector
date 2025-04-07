import { styled } from '@stitches/react';
import { config } from '@grafana/runtime';

export const containerMinWidth = '560px';
export const containerMinHeight = '560px';

const {
  // colors,
  spacing,
} = config.theme2;

export const Container = styled('div', {
  containerType: 'size',
  containerName: 'panel',
  height: '100%',
});

export const ResponsiveBox = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: spacing.x2,
  height: '100%',
  // overflow: 'hidden',

  '@container panel (height < 40px)': {
    height: 'calc(100% + 12px)',
    width: 'calc(100% + 12px)',
    margin: -6,
  },
  [`@container panel (width < ${containerMinWidth})`]: {
    width: '100%',
    height: '100% !important',
    gap: spacing.x0_5,
    flexDirection: 'column',
  },
});
