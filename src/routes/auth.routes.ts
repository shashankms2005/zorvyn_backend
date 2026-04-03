import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/register', validate(registerSchema), async (req, res) => {
  const { name, email, password } = req.body;
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ success: false, error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'VIEWER'
    }
  });

  res.status(201).json({ success: true, data: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !user.isActive) {
      console.log('User not found or inactive');
      return res.status(401).json({ success: false, error: 'Invalid credentials or account is disabled' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '1d' }
    );

    console.log('Login successful');
    res.json({ success: true, token, data: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('CRITICAL LOGIN ERROR:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error', details: (error as Error).message });
  }
});

export default router;
