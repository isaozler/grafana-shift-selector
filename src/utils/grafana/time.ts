import { locationService } from '@grafana/runtime';
import { PanelProps } from '@grafana/data';
import { TShiftStore } from '../../store/shifts';
import { TPropOptions } from '../../types';
import { getDateByTimeObjectByContext } from '../time';
import { TShift } from '../../types/shifts';
import { TStore } from '../../store';

export const changeShift = (uuid: string, shift: TShift, store: TStore) => {
  const path = locationService.getLocation();
  const url = new URLSearchParams(path.search);

  if (store.props?.ux.realtime.shift.isEndToNow) {
    return
  }

  if (store.props && shift) {
    const { startDate, endDate } = getDateByTimeObjectByContext(store.props, shift) ?? {};

    if (startDate && endDate) {
      url.set('from', startDate.toISOString());
      url.set('to', typeof endDate === 'string' ? endDate : endDate.toISOString());
    }
  }

  if (store.setToActive?.uuid === shift.uuid) {
    url.delete('group_uuid');
    url.delete('active_shift_uuid');
    store.unsetClickedShift();
  } else {
    url.set('group_uuid', uuid);
    url.set('active_shift_uuid', shift.uuid);
    store.setClickedShift(uuid, shift);
  }

  locationService.push('?' + url.toString());
};

export const checkIfDashboardTimeIsSet = () => {
  const { shift_uuid, active_shift_uuid } = locationService.getSearchObject() || {};

  return !!shift_uuid && !!active_shift_uuid;
};

export const setDashboardTime = (shifts: TShiftStore['shifts'], props: PanelProps<TPropOptions>): TShift | null => {
  if (!shifts) {
    return null;
  }

  let active = null;
  const path = locationService.getLocation();
  const url = new URLSearchParams(path.search);
  const isSetTime = checkIfDashboardTimeIsSet();
  const isFixedTime = props.options.ux.time.isFixed;

  if (shifts) {
    Object.entries(shifts).forEach(([, shiftGroup]) => {
      if (shiftGroup.activeShift) {
        const shift = shiftGroup.shifts.find((shift) => shift.uuid === shiftGroup.activeShift);
        active = shift;

        if (shift?.start) {
          const { startDate, endDate } = getDateByTimeObjectByContext(props.options, shift);

          if (!isSetTime) {
            url.set('from', startDate.toISOString());
            url.set('to', typeof endDate === 'string' ? endDate : endDate.toISOString());
          } else if (props.options.ux.realtime.shift.isAutoSelect) {
            if (url.get('shift_uuid') !== shiftGroup.activeShift || isFixedTime) {
              url.set('from', startDate.toISOString());
              url.set('to', typeof endDate === 'string' ? endDate : endDate.toISOString());
            }
          }

          url.set('shift_uuid', shiftGroup.activeShift ?? '');
        }
      }
    });
  }

  locationService.push('?' + url.toString());

  return active;
};

export const customRefreshIntervalOptions = [
  {
    label: '5 seconds',
    value: 5 * 1000,
  },
  {
    label: '10 seconds',
    value: 10 * 1000,
  },
  {
    label: '30 seconds',
    value: 30 * 1000,
  },
  {
    label: '1 minute',
    value: 60 * 1000,
  },
  {
    label: '30 minutes',
    value: 30 * 60 * 1000,
  },
  {
    label: '1 hour',
    value: 60 * 60 * 1000,
  },
  {
    label: '6 hours',
    value: 6 * 60 * 60 * 1000,
  },
  {
    label: '12 hours',
    value: 12 * 60 * 60 * 1000,
  },
  {
    label: '24 hours',
    value: 24 * 60 * 60 * 1000,
  },
];
