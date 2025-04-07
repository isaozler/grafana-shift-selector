import React, { ComponentType } from 'react';
import { Button, ButtonLabel, ButtonWrapper, Container, Horizontal, Shift, ShiftButtonProgress, ShiftTimeRange, Vertical, Wrapper } from '../../styles/ui/shifts';
import { useStore } from '../../store';
import { TShift, TShiftGroup } from '../../types/shifts';
import { changeShift } from '../../utils/grafana/time';
import { calculateShiftProgress, stringifyTime } from '../../utils/time';
import { Lock } from '../icon/icon';

export const Shifts = () => {
  const store = useStore();

  const [shiftGroups, setShiftGroups] = React.useState<TShiftGroup | null>(null);

  React.useEffect(() => {
    if (store?.shifts) {
      const group = store.getShiftsByActiveGroup();

      if (group) {
        setShiftGroups(group);
      } else {
        const initGroup = store.getShiftsByInitGroup();
        if (initGroup) {
          setShiftGroups(initGroup);
        }
      }
    }
  }, [setShiftGroups, store]);

  return (
    <Wrapper>
      <Container>
        {shiftGroups?.shifts?.map((shift) => (
          <ShiftComponent key={shift.uuid} data={shift} />
        ))}
      </Container>
    </Wrapper>
  );
};

export const ShiftComponent: ComponentType<{ children?: React.ReactNode; data: TShift }> = ({ data }) => {
  const store = useStore();

  if (!data.start || !data.end) {
    return null;
  }

  return (
    <Shift>
      <ButtonWrapper>
        {data.isActive ? <ShiftProgress shift={data} /> : null}
        <Button
          data-active={data.isActive}
          data-closest={data.isClosest}
          data-is-fixed={store.props?.ux.time.isFixed}
          disabled={store.props?.ux.realtime.shift.isEndToNow}
          data-manual-active={store.setToActive?.uuid === data.uuid}
          {...(store.props?.ux.time.isFixed && data.isActive ? { title: `Time is fixed to: ${stringifyTime(store.props.settings.time.current)}` } : {})}
          onClick={() => changeShift(data.uuid, data, store)}
        >
          <ButtonLabel>
            {store.props?.ux.time.isFixed && data.isActive ? <Lock /> : '' }
            <span>{data.label}</span>
          </ButtonLabel>
          {store.props?.ux.time.isFixed && data.isActive
            ? <ShiftTimeRange>{stringifyTime(store.props.settings.time.current)}</ShiftTimeRange>
            : <ShiftTimeRange>{[stringifyTime(data.start),stringifyTime(data.end)].join('-')}</ShiftTimeRange>
          }
        </Button>
      </ButtonWrapper>
    </Shift>
  );
};

export const ShiftProgress: ComponentType<{ children?: React.ReactNode; shift: TShift }> = ({ shift }) => {
  const store = useStore();
  const progress = calculateShiftProgress(shift, store.props);

  return (
    <ShiftButtonProgress>
      <Horizontal
        style={{
          width: `${progress}%`,
        }}
      />
      <Vertical
        style={{
          height: `${progress}%`,
        }}
      />
    </ShiftButtonProgress>
  );
};
