import { z } from 'zod';

export const Device = z.record(z.string(), z.any());
export type Device = z.infer<typeof Device>;
export const DeviceQueryParams = z.object({
  tenantId: z.string(),
});
export type DeviceQueryParams = z.infer<typeof DeviceQueryParams>;
export const TenantsListBody = z.array(z.string().min(1));
export type TenantsListBody = z.infer<typeof TenantsListBody>;
export const DeviceListResponse = z.array(Device);
export type DeviceListResponse = z.infer<typeof DeviceListResponse>;
