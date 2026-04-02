import { Router } from 'express';
import { prisma } from '../utils/prisma';
import { requireAuth } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.use(requireAuth);

// GET /api/dashboard/summary - Available to all authenticated roles
router.get('/summary', requireRole(['ADMIN', 'ANALYST', 'VIEWER']), async (req, res) => {
  // In a real large-scale app, we should use aggregation methods (Prisma's aggregate/groupBy)
  // But for simple assessment backend, we'll calculate it from JS or use aggregations if possible.
  // Using pure JS here because data is small, but let's practice Prisma aggregations.
  
  const incomeAgg = await prisma.record.aggregate({
    _sum: { amount: true },
    where: { type: 'INCOME' }
  });

  const expenseAgg = await prisma.record.aggregate({
    _sum: { amount: true },
    where: { type: 'EXPENSE' }
  });

  const totalIncome = incomeAgg._sum.amount || 0;
  const totalExpense = expenseAgg._sum.amount || 0;
  const netBalance = totalIncome - totalExpense;

  const categoryAgg = await prisma.record.groupBy({
    by: ['category'],
    _sum: { amount: true },
  });

  const categoryTotals = categoryAgg.reduce((acc, curr) => {
    acc[curr.category] = curr._sum.amount ?? 0;
    return acc;
  }, {} as Record<string, number>);

  const recentActivity = await prisma.record.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  res.json({
    success: true,
    data: {
      totalIncome,
      totalExpense,
      netBalance,
      categoryTotals,
      recentActivity
    }
  });
});

export default router;
