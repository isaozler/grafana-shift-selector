import React, { createContext, ReactElement, useContext, useEffect, useMemo } from 'react';
import { createStitches } from '@stitches/react';
import { useTheme2, useTheme } from '@grafana/ui';
import { flattenKeysWithValues } from '../utils/panels/global';
import Stitches from '@stitches/react/types/stitches';
import { GrafanaTheme, GrafanaTheme2 } from '@grafana/data';

type TTheme = {
  styled: Stitches['styled'];
  utils: TUtils;
  theme: {
    v1: GrafanaTheme['colors'];
    v2: GrafanaTheme2['colors'];
  };
};

type TUtils = {
  colors: {
    emphasize: GrafanaTheme2['colors']['emphasize'];
    getContrastText: GrafanaTheme2['colors']['getContrastText'];
    getHoverColor: (color: string) => string;
    getTonalOffset: (color: string) => string;
  };
};

const ThemeContext = createContext<TTheme | null>(null);

export const ThemeProvider = ({ children }: { children: ReactElement<any, any> }) => {
  const grafanaTheme = useTheme();
  const grafanaTheme2 = useTheme2();

  const utils = useMemo(() => {
    return {
      colors: {
        emphasize: grafanaTheme2.colors.emphasize,
        getContrastText: grafanaTheme2.colors.getContrastText,
        getHoverColor: (color: string) => {
          return grafanaTheme2.colors.emphasize(color, 1 - grafanaTheme2.colors.hoverFactor);
        },
        getTonalOffset: (color: string) => {
          return grafanaTheme2.colors.emphasize(color, 1 - grafanaTheme2.colors.tonalOffset);
        },
      },
    };
  }, [grafanaTheme2.colors]);

  const stitchesTheme = useMemo(() => {
    const { styled, css, theme } = createStitches({
      theme: {
        colors: {
          ...flattenKeysWithValues({
            theme: grafanaTheme.colors,
            theme2: grafanaTheme2.colors,
          }),
        },
        fontSizes: {
          title: grafanaTheme2.typography.h6.fontSize,
          body: grafanaTheme2.typography.body.fontSize,
        },
        sizes: {},
        space: {
          padding: grafanaTheme2.spacing('md'),
          margin: grafanaTheme2.spacing('sm'),
        },
      },
    });

    return { styled, css, theme };
  }, [grafanaTheme, grafanaTheme2]);

  const contextValue = useMemo(
    () => ({
      styled: stitchesTheme.styled,
      utils,
      theme: {
        v1: grafanaTheme.colors,
        v2: grafanaTheme2.colors,
      },
    }),
    [stitchesTheme.styled, utils, grafanaTheme.colors, grafanaTheme2.colors]
  );

  useEffect(() => {
    console.log({
      theme: {
        ...flattenKeysWithValues(grafanaTheme.colors),
      },
      theme2: {
        ...flattenKeysWithValues(grafanaTheme2.colors),
      },
    });
  }, [grafanaTheme, grafanaTheme2]);

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useStitchesTheme = () => useContext(ThemeContext) as TTheme;
