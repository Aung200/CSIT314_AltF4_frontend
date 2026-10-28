//shadcn/ui Slider (MIT), adapted for multiple thumbs. See LICENSE.shadcn-ui.md.
"use client";

//libraries
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

//utils
import { cn } from "../../lib/utils";

const Slider = React.forwardRef(({ className, thumbLabels = [], getValueLabel, ...props }, ref) => {
  const values = props.value || props.defaultValue || [0];
  return (
    <SliderPrimitive.Root ref={ref} className={cn("relative flex w-full touch-none select-none items-center py-2", className)} {...props}>
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-sage-200">
        <SliderPrimitive.Range className="absolute h-full bg-sage-700" />
      </SliderPrimitive.Track>
      {values.map((value, index) => (
        <SliderPrimitive.Thumb key={index} aria-label={thumbLabels[index]} aria-valuetext={getValueLabel?.(value, index)} className="block h-5 w-5 rounded-full border-2 border-sage-700 bg-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
