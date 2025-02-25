import { PanelOptionsEditorBuilder, PanelPlugin } from '@grafana/data';

import { options as dataSourceOptions } from './options/dataSource';
import { options as dataSourceFiltersOptions } from './options/dataSource.filters';
import { options as dataSourceMappingsDbOptions } from './options/dataSource.mappings.db';
import { options as behaviourOptions } from './options/behaviour';
import { options as dateSelectorOptions } from './options/dateSelector';
import { options as rangeButtonOptions } from './options/rangeButton';
import { options as shiftLabelsOptions } from './options/shiftLabels';
import { options as filterOptions } from './options/filters';
import { options as replayOptions } from './options/replay';

import type { TGlobalData, TPropOptions } from './types';

import ShiftSelector from './ShiftSelector.v2';
import { globalData } from './data';
import { processGlobalProps } from './utils/panels/global';

type TBuilderFunctions = (
  builder: PanelOptionsEditorBuilder<TPropOptions>,
  globalData: TGlobalData
) => PanelOptionsEditorBuilder<TPropOptions>;

const constructBuilder = (builder: PanelOptionsEditorBuilder<TPropOptions>, ...functions: TBuilderFunctions[]) => {
  return functions.reduce((currentBuilder, fn) => {
    const globalPropsState = processGlobalProps(globalData)

    

    return fn(currentBuilder, globalPropsState);
  }, builder);
};

export const plugin = new PanelPlugin(ShiftSelector).setPanelOptions((builder) => {
  return constructBuilder(
    builder,
    dataSourceOptions,
    dataSourceMappingsDbOptions,
    dataSourceFiltersOptions,
    behaviourOptions,
    dateSelectorOptions,
    rangeButtonOptions,
    shiftLabelsOptions,
    filterOptions,
    replayOptions
  );
});
