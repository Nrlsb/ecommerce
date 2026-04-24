'use client';

import { useCallback, useEffect, useState, useRef } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
}

export function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (val) => `$${val.toLocaleString()}`,
}: RangeSliderProps) {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const minValRef = useRef(value[0]);
  const maxValRef = useRef(value[1]);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Handle value changes from props
  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
    minValRef.current = value[0];
    maxValRef.current = value[1];
  }, [value]);

  return (
    <div className="w-full flex flex-col gap-4 py-4">
      <div className="relative w-full h-2 bg-secondary rounded-full">
        {/* Track highlight */}
        <div
          ref={range}
          className="absolute h-full bg-primary rounded-full"
        />

        {/* Min Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(value);
            minValRef.current = value;
            onChange([value, maxVal]);
          }}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-3 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg active:[&::-webkit-slider-thumb]:scale-110 transition-transform"
        />

        {/* Max Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
            maxValRef.current = value;
            onChange([minVal, value]);
          }}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-4 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg active:[&::-webkit-slider-thumb]:scale-110 transition-transform"
        />
      </div>

      <div className="flex justify-between items-center text-xs font-semibold text-foreground/60 px-1">
        <span>{formatValue(minVal)}</span>
        <span>{formatValue(maxVal)}</span>
      </div>
    </div>
  );
}
