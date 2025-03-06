import { z } from "zod"

const proxySchema = z.object({
  type: z.string(),
  ip: z.string(),
  port: z.number().transform(String), // Convert port to string during parsing
});

// Success schema (no extra fields allowed)
const successSchema = z.object({
  proxies: z.array(proxySchema),
  total_count: z.number(),
}).strict(); // Strict ensures no extra fields (like 'error') are present

// Error schema (no extra fields allowed)
const errorSchema = z.object({
  error: z.string(),
}).strict(); // Strict ensures no extra fields (like 'proxies') are present

// Combined schema
export const apiSchema = z.union([
  successSchema,
  errorSchema,
]);

// Type inference (optional)
export type ApiResponse = z.infer<typeof apiSchema>;