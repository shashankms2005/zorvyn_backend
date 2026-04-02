import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: string };
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Unauthorized: User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, error: 'Forbidden: Account is disabled' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
  }
};
