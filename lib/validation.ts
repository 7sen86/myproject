import { z } from "zod";

export const createOrderSchema = z.object({
  bookletId: z.string().min(1),
  studentName: z.string().trim().min(2, "الاسم قصير جدًا").max(100),
  studentPhone: z
    .string()
    .trim()
    .regex(/^07[0-9]{9}$/, "رقم الهاتف غير صحيح"),
  governorateId: z.string().optional().nullable(),
  addressDetails: z.string().trim().max(300).optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
