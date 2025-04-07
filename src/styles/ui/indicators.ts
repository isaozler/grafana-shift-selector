import { styled, keyframes } from '@stitches/react';
import { config } from '@grafana/runtime';

const { colors, spacing } = config.theme2;

export const IndicatorsDiv = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 6,

  '@container panel (height < 40px)': {
    marginTop: -2,
    marginRight: spacing.x1_5,
  },
});

export const CircleBackground = styled('circle', {
  fill: 'none',
  r: 50,
  cx: 60,
  cy: 60,
  stroke: colors.border.medium,
  strokeWidth: 20,
});

export const CircleActive = styled('circle', {
  fill: 'none',
  r: 50,
  cx: 60,
  cy: 60,
  stroke: colors.info.border,
  strokeWidth: 20,
  transition: 'stroke-dashoffset 1s linear',
});

const pulse = keyframes({
  '0%': {
    opacity: 1,
  },
  '50%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

export const CirclePulse = styled('circle', {
  cx: 60,
  cy: 60,
  r: 20,
  fill: colors.error.border,
  animation: `${pulse} 1s infinite`,
});
