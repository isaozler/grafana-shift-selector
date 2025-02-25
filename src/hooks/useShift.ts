import { useEffect, useState } from 'react';
import { TShift, TShiftGroupedData } from '../types/shifts';
import { TPropOptions } from '../types';
import { PanelProps } from '@grafana/data';
import { hasMultipleShiftGroups } from '../utils/shift';

export const useShift = (props: PanelProps<TPropOptions>) => {
  const { options } = props;
  const [hasMultipleGroups, setHasMultipleGroups] = useState(false);
  const [activeGroup /* setActiveGroup */] = useState<TShiftGroupedData['uuid'] | null>(null);
  const [activeShift /* setActiveShift */] = useState<TShift | null>(null);

  // useEffect(() => {
  //   console.log('hasMultipleGroups', { hasMultipleGroups });
  // }, [hasMultipleGroups]);

  // useEffect(() => {
  //   console.log('activeGroup', { activeGroup });
  // }, [activeGroup]);

  // useEffect(() => {
  //   console.log('activeShift', { activeShift });
  // }, [activeShift]);

  useEffect(() => {
    setHasMultipleGroups(hasMultipleShiftGroups(options?.data?.shifts || null));
  }, [options]);

  return {
    hasMultipleGroups,
    activeGroup,
    activeShift,
  };
};
