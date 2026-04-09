import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || '';

type AdminTokenPayload = {
  role: 'admin';
  username: string;
  scope: 'all' | 'dubey';
};

const openAdminPaths = new Set(['/auth/login']);

export const signAdminToken = (username: string, scope: 'all' | 'dubey') => {
  if (!ADMIN_JWT_SECRET) {
    throw new Error('ADMIN_JWT_SECRET is not configured');
  }

  return jwt.sign({ role: 'admin', username, scope }, ADMIN_JWT_SECRET, { expiresIn: '8h' });
};

export const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (openAdminPaths.has(req.path)) {
    return next();
  }

  if (!ADMIN_JWT_SECRET) {
    return res.status(503).json({ error: 'Admin auth is not configured on server.' });
  }

  const authHeader = String(req.headers.authorization || '');
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!token) {
    return res.status(401).json({ error: 'Missing admin token.' });
  }

  try {
    const payload = jwt.verify(token, ADMIN_JWT_SECRET) as AdminTokenPayload;
    if (payload?.role !== 'admin') {
      return res.status(401).json({ error: 'Invalid admin token.' });
    }
    (req as any).adminAuth = {
      username: payload.username,
      scope: payload.scope === 'dubey' ? 'dubey' : 'all'
    };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired admin token.' });
  }
};
