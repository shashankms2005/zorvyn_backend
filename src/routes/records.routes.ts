import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { requireAuth } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createRecordSchema, updateRecordSchema, queryRecordSchema } from '../schemas/record.schema';

const router = Router();

router.use(requireAuth);

// GET /api/records - Available for ADMIN and ANALYST
router.get('/', requireRole(['ADMIN', 'ANALYST']), validate(queryRecordSchema), async (req: Request, res: Response) => {
  const { type, category, startDate, endDate, paymentMethod, status, currency, userId } = req.query;

  const where: any = {};
  if (type) where.type = type;
  if (category) where.category = { equals: category, mode: 'insensitive' };
  if (paymentMethod) where.paymentMethod = paymentMethod;
  if (status) where.status = status;
  if (currency) where.currency = currency;
  if (userId) where.userId = userId;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate as string);
    if (endDate) where.date.lte = new Date(endDate as string);
  }

  const records = await prisma.record.findMany({
    where,
    orderBy: { date: 'desc' }
  });

  res.json({ success: true, data: records });
});

// GET /api/records/:id - Available for ADMIN and ANALYST
router.get('/:id', requireRole(['ADMIN', 'ANALYST']), async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const record = await prisma.record.findUnique({ where: { id } });

  if (!record) {
    return res.status(404).json({ success: false, error: 'Record not found' });
  }

  res.json({ success: true, data: record });
});

// POST /api/records - Available for ADMIN only
router.post('/', requireRole(['ADMIN']), validate(createRecordSchema), async (req: Request, res: Response) => {
  const recordData = req.body;
  const newRecord = await prisma.record.create({
    data: {
      ...recordData,
      date: new Date(recordData.date)
    }
  });

  res.status(201).json({ success: true, data: newRecord });
});

// PUT /api/records/:id - Available for ADMIN only
router.put('/:id', requireRole(['ADMIN']), validate(updateRecordSchema), async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const recordData = req.body;

  const record = await prisma.record.findUnique({ where: { id } });
  if (!record) {
    return res.status(404).json({ success: false, error: 'Record not found' });
  }

  const dataToUpdate = { ...recordData };
  if (dataToUpdate.date) {
    dataToUpdate.date = new Date(dataToUpdate.date);
  }

  const updatedRecord = await prisma.record.update({
    where: { id },
    data: dataToUpdate
  });

  res.json({ success: true, data: updatedRecord });
});

// DELETE /api/records/:id - Available for ADMIN only
router.delete('/:id', requireRole(['ADMIN']), async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const record = await prisma.record.findUnique({ where: { id } });
  if (!record) {
    return res.status(404).json({ success: false, error: 'Record not found' });
  }

  await prisma.record.delete({ where: { id } });

  res.json({ success: true, message: 'Record deleted successfully' });
});

export default router;
