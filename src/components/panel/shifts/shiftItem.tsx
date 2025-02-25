import React, {
  RefObject,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { InputClass } from '../../../styles/panel/input';
import { ShiftConfiguratorInputRow } from '../../../styles/shifts/config';
import { useDispatch, useStoreState, useSubscribe } from '../../../store/hook';
import { store, TState } from '../../../store/reducer/shift';

const formatUUID = (value: string) => {
  return value.trim().replace(/\w/g, '_');
};

export const ShiftItem = () => {
    const [state, setState] = useState<TState>(useStoreState("STORE_SHIFT") ?? store.subject.getValue())
    const shiftsStore = useSubscribe(store.subject)

    const groupRef = React.useRef<HTMLInputElement>(null);
    const groupUUIDRef = React.useRef<HTMLInputElement>(null);
    const shiftUUIDRef = React.useRef<HTMLInputElement>(null);
    const labelRef = React.useRef<HTMLInputElement>(null);
    const startTimeRef = React.useRef<HTMLInputElement>(null);
    const endTimeRef = React.useRef<HTMLInputElement>(null);
    const orderRef = React.useRef<HTMLInputElement>(null);
    const formInputs: Array<RefObject<HTMLInputElement>> = [
      groupRef,
      groupUUIDRef,
      shiftUUIDRef,
      labelRef,
      startTimeRef,
      endTimeRef,
      orderRef,
    ];

    // const shiftState_ = useSelector<TStoreState>((state) => state[SHIFT_STORE_KEY]);
    const dispatch = useDispatch();
    // const storeState = useStoreState<TState>(SHIFT_STORE_KEY)
    const storeStateShift = useStoreState("STORE_SHIFT")
    // const storeStateTime = useStoreState("STORE_TIME")

    // console.log({ storeStateShift })


    const handleInput = useCallback(
      (e: Event) => {
        const target = e.target as HTMLInputElement;
        const { name, value } = target;

        dispatch({
          type: 'SET_SHIFT',
          payload: {
            [name]: value,
          }
        });
      },
      [dispatch]
    );

    useEffect(() => {
      formInputs.forEach((input) => {
        if (input.current) {
          input.current.addEventListener('input', handleInput);
        }
      });

      return () => {
        formInputs.forEach((input) => {
          if (input.current) {
            console.log('REMOVING EVENT LISTENER');
            input.current.removeEventListener('input', handleInput);
          }
        });
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      console.log('state debug', 'shift item', {state})
    }, [state])
  
    useEffect(() => {
      const subscriptionState = shiftsStore(setState)
  
      return () => {
        subscriptionState.unsubscribe()
      }
    }, [shiftsStore])

    return (
      <div>
        <div>
          <ShiftConfiguratorInputRow>
            <div>
              <label htmlFor="group">Group</label>
              <input
                className={InputClass()}
                ref={groupRef}
                maxLength={40}
                type="text"
                name="group"
                id="group"
                defaultValue={groupUUIDRef?.current?.value ? state.raw.data?.[groupUUIDRef.current.value]?.group : ''}
              />
            </div>
            <div>
              <label htmlFor="group">Group UUID</label>
              <input
                className={InputClass()}
                ref={groupUUIDRef}
                type="text"
                name="group_uuid"
                id="group_uuid"
                defaultValue={groupUUIDRef?.current?.value ? state.raw.data?.[groupUUIDRef.current.value]?.group_uuid : ''}
              />
            </div>
          </ShiftConfiguratorInputRow>
        </div>

        {groupUUIDRef?.current?.value ? <>
        
          <div>
          <ShiftConfiguratorInputRow>
            <div>
              <label htmlFor="label">Label</label>
              <input
                className={InputClass()}
                ref={labelRef}
                type="text"
                name="label"
                id="label"
                defaultValue={state.raw.data?.[groupUUIDRef.current.value]?.label}
              />
            </div>
            <div>
              <label htmlFor="label">Shift UUID</label>
              <input
                className={InputClass()}
                ref={shiftUUIDRef}
                type="text"
                name="uuid"
                id="uuid"
                defaultValue={state.raw.data?.[groupUUIDRef.current.value]?.uuid}
              />
            </div>
          </ShiftConfiguratorInputRow>
        </div>
        <div>
          <ShiftConfiguratorInputRow>
            <div>
              <label htmlFor="startTime">Start</label>
              <input
                className={InputClass()}
                ref={startTimeRef}
                type="time"
                name="startTime"
                id="startTime"
                defaultValue={state.raw.data?.[groupUUIDRef.current.value]?.startTime}
              />
            </div>
            <div>
              <label htmlFor="endTime">End Time</label>
              <input
                className={InputClass()}
                ref={endTimeRef}
                type="time"
                name="endTime"
                id="endTime"
                defaultValue={state.raw.data?.[groupUUIDRef.current.value]?.endTime}
              />
            </div>
          </ShiftConfiguratorInputRow>
        </div>
        <div>
          <ShiftConfiguratorInputRow>
            <div>
              <label htmlFor="order">Order</label>
              <input
                className={InputClass({ minContent: true })}
                ref={orderRef}
                type="number"
                name="order"
                id="order"
                defaultValue={state.raw.data?.[groupUUIDRef.current.value]?.order}
              />
            </div>
            <div>&nbsp;</div>
          </ShiftConfiguratorInputRow>
        </div>

        </> : null}
      </div>
    );
  }
