import React from 'react';
import { TRangeButtonViewType } from '../types';
import { RangeButtonComp } from '../styles/components';
import { config } from '@grafana/runtime';

const isDark = config.theme.isDark;

export const RangeButton = ({
  title,
  label,
  icon,
  isActive,
  onClick,
  viewType,
  buttonType,
}: {
  title: string;
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
  viewType: TRangeButtonViewType;
  buttonType: 'start-end' | 'start' | 'end';
}) => {
  return (
    <RangeButtonComp
      title={title}
      onClick={onClick}
      isDark={isDark}
      isActive={isActive}
      className={['btn', 'mdi', icon, `type--${viewType}`, `input-type--${buttonType}`].join(' ')}
    >
      {viewType === 'text-and-icon' || viewType === 'text-only' ? label : ''}
    </RangeButtonComp>
  );
};
