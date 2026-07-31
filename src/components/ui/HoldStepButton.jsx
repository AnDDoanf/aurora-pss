import React, { useEffect, useRef } from 'react';

export function HoldStepButton({
  direction,
  disabled,
  onStep,
  label,
  className = '',
  children
}) {
  const timerRef = useRef(null);
  const holdStartedAtRef = useRef(0);
  const onStepRef = useRef(onStep);
  const disabledRef = useRef(disabled);

  onStepRef.current = onStep;
  disabledRef.current = disabled;

  const stopRepeating = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => stopRepeating, []);

  const repeat = () => {
    if (disabledRef.current) {
      stopRepeating();
      return;
    }
    const heldFor = performance.now() - holdStartedAtRef.current;
    const amount = heldFor >= 3000 ? 5 : heldFor >= 1500 ? 2 : 1;
    const delay = Math.max(45, 140 - Math.floor(heldFor / 30));
    onStepRef.current(direction * amount);
    timerRef.current = window.setTimeout(repeat, delay);
  };

  const startRepeating = (event) => {
    if (disabled || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    stopRepeating();
    onStepRef.current(direction);
    holdStartedAtRef.current = performance.now();
    timerRef.current = window.setTimeout(repeat, 380);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={startRepeating}
      onPointerUp={stopRepeating}
      onPointerCancel={stopRepeating}
      onLostPointerCapture={stopRepeating}
      onClick={(event) => {
        if (event.detail === 0 && !disabled) onStepRef.current(direction);
      }}
      onContextMenu={(event) => event.preventDefault()}
      className={`${className} select-none touch-none`}
      aria-label={label}
      title={label}
    >
      {children ?? (direction < 0 ? '−' : '+')}
    </button>
  );
}
