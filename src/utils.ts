import { dateTime, dateTimeAsMoment } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { Option, ShiftData, ShiftI, TExtendedShift, TMappings, TUpdateActiveShiftProps, vars } from './types';

export const dateTimeFormat = `YYYY-MM-DD HH:mm:ss`;
export const fakeEpoc = '2009-10-17';

type TParsedShiftData = {
  shiftGroupName: string;
  shiftGroupUUID: string;
  start: string;
  end: string;
  order: number;
};

export const parseShiftData = (uuid: string, values: any[]): TParsedShiftData | null => {
  const { text: data } = values.find(({ value }) => value === uuid) || {};

  if (!data) {
    return null;
  }

  const [shiftGroupName, shiftGroupUUID, , start, end, order] = data.split('|');

  return {
    shiftGroupName,
    shiftGroupUUID,
    start,
    end,
    order: +order,
  };
};

export const transformShiftData = (
  shift: ShiftI & { index: number },
  hasNextDayShift: boolean,
  productionDate: number
): ShiftI & TExtendedShift => {
  const currentHour = dateTimeAsMoment(productionDate).get('hour');
  let startDate = dateTimeAsMoment(`${dateTime(productionDate).format('YYYY-MM-DD')} ${shift.start}`);
  let endDate = dateTimeAsMoment(`${dateTime(productionDate).format('YYYY-MM-DD')} ${shift.end}`);
  const isStartHourGreater = startHourIsGreater(shift.start, shift.end);
  const isActive = isCurrentTimeInShiftRange(shift);
  const endHour = endDate.get('hour');

  if (hasNextDayShift && isStartHourGreater) {
    if (currentHour <= 23 && currentHour > endHour) {
      endDate = dateTimeAsMoment(`${dateTime(productionDate).format('YYYY-MM-DD')} ${shift.end}`).add(1, 'day');
    } else {
      startDate = dateTimeAsMoment(`${dateTime(productionDate).format('YYYY-MM-DD')} ${shift.start}`).subtract(
        1,
        'day'
      );
    }
  }

  const _ = {
    startDate: startDate.format(dateTimeFormat),
    endDate: endDate.format(dateTimeFormat),
    isActive,
    timeStamps: [startDate.unix() * 1000, endDate.unix() * 1000],
  };

  return {
    ...shift,
    startDate,
    endDate,
    _,
  };
};

export const startHourIsGreater = (startHour: string, endHour: string) => {
  const startDateHour = dateTimeAsMoment(`${dateTime().format('YYYY-MM-DD')} ${startHour}`).get('hour');
  const endDateHour = dateTimeAsMoment(`${dateTime().format('YYYY-MM-DD')} ${endHour}`).get('hour');

  return startDateHour > endDateHour;
};

export const getHasNextDayShift = (options: Option[], optionsData: any[]) => {
  return options.reduce((res: boolean, option) => {
    if (res) {
      return true;
    }

    const data = parseShiftData(option.value, optionsData);

    if (!data) {
      return false;
    }

    return startHourIsGreater(data.start, data.end);
  }, false);
};

export const isCurrentTimeInShiftRange = (shift: ShiftI) => {
  let startDateTime = dateTimeAsMoment(`${fakeEpoc} ${shift.start}`).unix();
  let endDateTime = dateTimeAsMoment(`${fakeEpoc} ${shift.end}`).unix();
  const currentTime = dateTimeAsMoment(`${fakeEpoc} ${dateTimeAsMoment().format('HH:mm:ss')}`).unix();
  const nowHour = dateTimeAsMoment().get('hour');

  if (startHourIsGreater(shift.start, shift.end)) {
    if (nowHour <= 23 && currentTime > dateTimeAsMoment(`${fakeEpoc} ${shift.start}`).unix()) {
      endDateTime = dateTimeAsMoment(`${fakeEpoc} ${shift.end}`).add(1, 'day').unix();
    } else {
      startDateTime = dateTimeAsMoment(`${fakeEpoc} ${shift.start}`).subtract(1, 'day').unix();
    }
  }

  const state = currentTime >= startDateTime && currentTime < endDateTime;

  return state;
};

export const getShifts = (options: Option[], optionsData: any[], productionDate: number, isOptionGroupLabelTrimmed?: boolean) => {
  const hasNextDayShift: boolean = getHasNextDayShift(options, optionsData);
  const shifts: ShiftData = options.reduce((res: any, { text, value: uuid }, index: number) => {
    const data = parseShiftData(uuid, optionsData);

    if (isOptionGroupLabelTrimmed && data?.shiftGroupName) {
      text = text.replace(data.shiftGroupName, '').trim();
    }

    if (!data) {
      return res;
    }

    return {
      ...res,
      [data.shiftGroupUUID]: [
        ...(res[data.shiftGroupUUID] || []),
        transformShiftData(
          {
            ...data,
            uuid,
            label: text,
            index,
          },
          hasNextDayShift,
          productionDate
        ),
      ],
    };
  }, {});

  return shifts;
};

export const getBreweryUUID = (name: string): string | null => {
  const matched = new RegExp(/\((\w+)\)/g).exec(name);

  if (matched) {
    const [, breweryUUID] = matched;
    return breweryUUID;
  }

  return null;
};

export const buttonTypes = (label: string, mapping: TMappings) => {
  label = label.trim().toLowerCase();

  return Object.keys(mapping).find((icon: any) =>
    mapping[icon].filter(
      (tag: string) => label.split(' ').filter((labelPart: string) => tag.indexOf(labelPart) >= 0).length
    ).length
      ? icon
      : null
  );
};

export const setTypeChangeHandler = (
  type: string,
  updateType: string,
  setUpdateType: React.Dispatch<React.SetStateAction<string>>,
  setCustomTimeRange: React.Dispatch<any>
) => {
  if (type !== updateType) {
    setUpdateType(type);
    setCustomTimeRange((d: any) => ({
      ...d,
      uuid: null,
    }));
  }
};

export const shiftSelectHandler = (
  shift: ShiftI,
  setShiftParams: (shift: ShiftI, productionDate: number) => void,
  productionDate: number
) => setShiftParams(shift, productionDate);

export function getRelativeDates() {
  const relativeFrom = locationService.getSearch().get('from')?.includes('now');
  const relativeTo = locationService.getSearch().get('to')?.includes('now');

  return {
    relativeFrom,
    relativeTo,
  };
}

export const getInitGroupUUID = (options: TUpdateActiveShiftProps['shifts']['options'], values: TUpdateActiveShiftProps['shifts']['values']) => {
  const shifts = getShifts(options, values, dateTimeAsMoment().unix() * 1000);
  const [initGroup] = Object.keys(shifts) || [];

  return initGroup
}

export const updateActiveShift = (props: TUpdateActiveShiftProps) => {
  const queryShiftsGroup = locationService.getSearch().get(vars.queryShiftsGroup);
  const currentSetShift = locationService.getSearch().get(vars.queryShiftsOptions)
  const relativeToDate = props.isAutoSelectShift ? dateTimeAsMoment().unix() * 1000 : props.productionDate;
  const shifts = getShifts(props.shifts.options, props.shifts.values, relativeToDate);
  const initGroup = getInitGroupUUID(props.shifts.options, props.shifts.values)
  let activeShifts = shifts[initGroup]

  if (queryShiftsGroup && shifts[queryShiftsGroup]) {
    activeShifts = shifts[queryShiftsGroup]
  } else if (props.autoSelectShiftGroup && shifts[props.autoSelectShiftGroup]) {
    activeShifts = shifts[props.autoSelectShiftGroup]
  }

  const activeShift = ((activeShifts as unknown) as TExtendedShift[]).find(({ _ }) => _.isActive);
  const isShiftActive = activeShift ? isCurrentTimeInShiftRange(activeShift) : false

  if (activeShift && activeShift.uuid !== currentSetShift && isShiftActive && !props.isBlockedRender) {
    props.setShiftParams(activeShift, false);
  }
};
