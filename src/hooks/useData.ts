import { PanelProps } from '@grafana/data';
import type { TPropOptions } from '../types';
import { parseStaticData } from '../utils/static.data';
import { processProps } from '../utils/props';
import { initShiftsData } from '../utils/shift';
import { globalData } from '../data';
import { useDispatch, useSubscribe } from '../store/hook';
import { store, TState } from '../store/reducer/props';
import { useEffect, useState } from 'react';

export const useData = (props: PanelProps<TPropOptions>) => {
  const [options, setOptions] = useState<TState>(processProps(props.options) ?? store.subject.getValue())
  const dispatch = useDispatch();
  const propsStore = useSubscribe(store.subject)

  // let { options } = props;
  // const [shiftsData, setShiftsData] = useState<TShiftGroupedData | null>(null);

  // options = processProps(options);

  useEffect(() => {
    const subscriptionState = propsStore(setOptions)
    
    return () => {
      subscriptionState.unsubscribe()
    }
  }, [propsStore])
  
    useEffect(() => {
      let payload

      if (options.settings.dataSource.type === 'static' && options.settings.dataSource.static.data) {
        const shifts = parseStaticData(options);
        globalData.options = initShiftsData(options, shifts);
        payload = globalData.options;
        setOptions(globalData.options)
      } else if (options.settings.dataSource.type === 'database') {
        payload = props.options
        setOptions(props.options);
      }

      dispatch({
        type: 'SET_PROPS',
        payload,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // useEffect(() => {
      
    // }, [dispatch, options])
  
  return {
    data: options,
  };
};
