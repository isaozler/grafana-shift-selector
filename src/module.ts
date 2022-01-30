import { PanelPlugin } from '@grafana/data';
import ShiftSelector from './ShiftSelector';

export const plugin = new PanelPlugin(ShiftSelector).setPanelOptions((builder) => {
  return builder;
});
