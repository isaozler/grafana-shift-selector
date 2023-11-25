import React from 'react';
import { TAlert } from '../types';
import { Alerts as AlertsDiv } from '../styles/components';

export const Alerts = ({
  alerts,
  resetAlert,
  setClosedAlerts,
}: {
  alerts: TAlert[];
  resetAlert: (id: number) => void;
  setClosedAlerts: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  if (!alerts.length) {
    return <></>;
  }

  return (
    <>
      {alerts.map((alert: { id: number; text: string; type: string }) => {
        const { text, type, id } = alert || {};

        if (!type || !text) {
          return <></>;
        }

        return (
          <AlertsDiv key={`alerts-${id}`} type={type as any}>
            {text}
            <button
              onClick={() => {
                resetAlert(id);
                setClosedAlerts((d: number[]) => [...(new Set([...d, id]) as any)]);
              }}
            >
              x
            </button>
          </AlertsDiv>
        );
      })}
    </>
  );
};
