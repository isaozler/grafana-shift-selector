import React, { useEffect, useState } from 'react';
import { CircleActive, CircleBackground, CirclePulse, IndicatorsDiv } from '../../styles/ui/indicators';
import { useStore } from '../../store';

export const Indicators = () => {
  const store = useStore();

  if (!store.props?.ui.element.progressBar.isVisible) {
    return null
  }

  return (
    <IndicatorsDiv>
      {
      store.props?.ux.realtime.shift.isCustomRefreshInterval &&
      store.props?.ux.realtime.shift.refreshInterval ? (
        <Timer
          duration={store.props.ux.realtime.shift.refreshInterval}
          isAutoSelect={store.props?.ux.realtime.shift.isAutoSelect}
        />
      ) : null}
    </IndicatorsDiv>
  );
};

interface TimerProps {
  duration: number;
  isAutoSelect: boolean;
}

export const Timer: React.FC<TimerProps> = ({ duration, isAutoSelect }) => {
  const [elapsed, setElapsed] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [disableTransition, setDisableTransition] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev < duration) {
          return prev + 1000;
        } else {
          setIsFading(true); // Trigger fade-out effect
          setTimeout(() => {
            setDisableTransition(true); // Disable transition temporarily
            setElapsed(0); // Reset progress
            setTimeout(() => {
              setDisableTransition(false); // Re-enable transition
              setIsFading(false); // Reset fade-out state
            }, 50); // Small delay to ensure transition is re-enabled
          }, 500); // Duration of fade-out effect
          return prev; // Keep the progress at max during fade-out
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = (elapsed / duration) * circumference;
  let transition = disableTransition ? 'none' : 'stroke-dashoffset 1s linear';
  transition = isFading ? 'opacity 0.5s ease' : transition;

  return (
    <svg width="20" height="20" viewBox="0 0 120 120">
      <CircleBackground />
      <CircleActive
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        transform="rotate(-90 60 60)"
        style={{
          transition,
          opacity: isFading ? 0 : 1,
        }}
      />
      {isAutoSelect ? <CirclePulse /> : null}
    </svg>
  );
};
