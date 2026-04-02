import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { requireAuth } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateRoleSchema, updateStatusSchema } from '../schemas/user.schema';

const router = Router();

// All user routes require authentication and ADMIN role
router.use(requireAuth);
router.use(requireRole(['ADMIN']));

// List all users
router.get('/', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true }
  });
  res.json({ success: true, data: users });
});

// Update user role
router.patch('/:id/role', validate(updateRoleSchema), async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { role } = req.body;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true, isActive: true }
  });

  res.json({ success: true, data: updatedUser });
});

// Update user status (activate/deactivate)
router.patch('/:id/status', validate(updateStatusSchema), async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { isActive } = req.body;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { isActive },
    select: { id: true, name: true, email: true, role: true, isActive: true }
  });

  res.json({ success: true, data: updatedUser });
});

export default router;
