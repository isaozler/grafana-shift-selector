import { styled } from '@stitches/react';
import { config } from '@grafana/runtime';
import { containerMinWidth } from './container';

const { colors, spacing } = config.theme2;

export const Wrapper = styled('div', {
  // containerType: 'size',
  // containerName: 'dateindicator',
  display: 'flex',
  flexDirection: 'row',
  flex: '0 0 auto',
  gap: spacing.x1,
  height: '100%',
  minHeight: 24,
  fontFamily: 'Kode Mono, monospace',
  fontSize: 12,
  marginLeft: spacing.x1,

  '> div': {
    display: 'flex',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '100%',
    alignItems: 'center',
  },

  [`@container panel (width < 60px)`]: {
    height: 'auto',
    writingMode: 'vertical-rl',
    textOrientation: 'sideways',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 1,
    fontSize: '0.75rem',
  },

  [`@container panel (width > 60px) and (width < ${containerMinWidth})`]: {
    height: '24px !important',
    flexDirection: 'row',
  },

  [`@container panel (width < ${containerMinWidth})`]: {
    marginLeft: 0,
  },
});

export const Label = styled('div', {
  whiteSpace: 'nowrap',
  color: colors.text.secondary,
});

export const Value = styled('div', {
  whiteSpace: 'nowrap',
  color: colors.text.primary,
});
