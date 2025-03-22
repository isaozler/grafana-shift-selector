import { PanelProps } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import type { TPropOptions } from '../types';
import { parseDynamicData, parseStaticData } from '../utils/static.data';
import { initShiftsData } from '../utils/shift';
import { useCallback, useEffect, useRef } from 'react';
import { transformGrafanaResponse } from '../utils/data';
import { useStore } from '../store';
import { processProps } from '../utils/props';
import { customRefreshIntervalOptions } from '../utils/grafana/time';

export const useData = (props: PanelProps<TPropOptions>) => {
  const store = useStore();
  const customRefreshInterval = useRef<NodeJS.Timeout | null>(null);

  const refreshDashboard = useCallback(() => {
    store.setProps(props.options);
    store.getShifts(props);
  }, [props, store]);

  useEffect(() => {
    const path = locationService.getLocation();
    const url = new URLSearchParams(path.search);
    let shifts;
    props.options = processProps(props.options);

    if (props.options.settings.dataSource.type === 'static' && props.options.settings.dataSource.static.data) {
      shifts = parseStaticData(props.options);
    } else if (props.options.settings.dataSource.type === 'database' && props.data) {
      shifts = parseDynamicData(transformGrafanaResponse(props.data, props.options), props.options);
    }

    if (shifts) {
      store.setProps(initShiftsData(props.options, shifts));
      store.setShifts(shifts);

      const activeGroupUUID = url.get('group_uuid');
      const activeShiftUUID = url.get('active_shift_uuid');
      const shiftUUID = url.get('shift_uuid');

      if (activeGroupUUID && activeShiftUUID) {
        const setActive = shifts[activeGroupUUID].shifts.find((shift) => shift.uuid === activeShiftUUID);
        
        if (setActive && store.setToActive !== setActive) {
          store.setClickedShift(activeGroupUUID, setActive, /* active */);
        }
      }

      if (activeGroupUUID && shiftUUID) {
        const active = shifts[activeGroupUUID].shifts.find((shift) => shift.uuid === shiftUUID);

        if (active) {
          store.setShift(activeGroupUUID, active);
        }
      }

      if (props.options.settings.time.refreshInterval && customRefreshIntervalOptions.find((option) => option.value === props.options.settings.time.refreshInterval)) {
        customRefreshInterval.current = setInterval(refreshDashboard, props.options.settings.time.refreshInterval);
      }
    }
    return () => {
      if (customRefreshInterval.current) {
        clearInterval(customRefreshInterval.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...store,
  };
};
