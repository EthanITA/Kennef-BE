import { z } from 'zod';

export const SteppedMetricQuery = z.object({
  tenant: z.string().optional(),
  start: z.string(),
  end: z.string(),
  step: z.string(),
});
export type SteppedMetricQuery = z.infer<typeof SteppedMetricQuery>;
export const TimeSteppedValues = z.array(z.tuple([z.number(), z.string()]));
export type TimeSteppedValues = z.infer<typeof TimeSteppedValues>;
export const TimeSteppedMessagesMetric = z.object({
  count: TimeSteppedValues,
  size: TimeSteppedValues,
  avg: TimeSteppedValues,
});
export type TimeSteppedMessagesMetric = z.infer<typeof TimeSteppedMessagesMetric>;
export const TimeSteppedCommandsMetric = z.object({
  count: TimeSteppedValues,
});
export type TimeSteppedCommandsMetric = z.infer<typeof TimeSteppedCommandsMetric>;
