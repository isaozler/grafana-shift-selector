import { TOptions } from '.';
import { TPropOptions } from '../../types';
import { StateCreator } from 'zustand';
import { processProps } from '../../utils/props';

export type TShiftActions = {
  setProps: (props: TPropOptions) => void;
};

export const StorePropActions: StateCreator<TOptions, [['zustand/devtools', never]], [], TShiftActions> = (set) => ({
  setProps: (props) =>
    set(
      (state) => {
        return {
          props: processProps({
            ...state.props,
            ...props,
          }),
        };
      },
      undefined,
      'store:props/setProps'
    ),
});
