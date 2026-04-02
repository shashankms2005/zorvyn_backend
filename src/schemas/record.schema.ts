import { z } from 'zod';

export const createRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be positive"),
    type: z.enum(['INCOME', 'EXPENSE']),
    category: z.string().min(2, "Category must be at least 2 characters"),
    date: z.string().datetime({ message: "Invalid date format, must be ISO 8601 string" }),
    paymentMethod: z.enum(['CARD', 'CASH', 'TRANSFER', 'CRYPTO']).optional(),
    status: z.enum(['COMPLETED', 'PENDING', 'FAILED']).optional(),
    currency: z.string().length(3).optional(),
    userId: z.string().uuid().optional(),
    notes: z.string().optional(),
  }),
});

export const updateRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().min(2).optional(),
    date: z.string().datetime().optional(),
    paymentMethod: z.enum(['CARD', 'CASH', 'TRANSFER', 'CRYPTO']).optional(),
    status: z.enum(['COMPLETED', 'PENDING', 'FAILED']).optional(),
    currency: z.string().length(3).optional(),
    userId: z.string().uuid().optional(),
    notes: z.string().optional(),
  }),
});

export const queryRecordSchema = z.object({
  query: z.object({
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().optional(),
    paymentMethod: z.enum(['CARD', 'CASH', 'TRANSFER', 'CRYPTO']).optional(),
    status: z.enum(['COMPLETED', 'PENDING', 'FAILED']).optional(),
    currency: z.string().length(3).optional(),
    userId: z.string().uuid().optional(),
    startDate: z.string().optional().refine(
      (val) => !val || !isNaN(Date.parse(val)),
      { message: 'startDate must be a valid date string' }
    ),
    endDate: z.string().optional().refine(
      (val) => !val || !isNaN(Date.parse(val)),
      { message: 'endDate must be a valid date string' }
    ),
  }),
});
