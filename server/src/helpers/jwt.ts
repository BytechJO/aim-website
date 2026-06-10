import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'change_me_in_production';

export type Role = 'admin' | 'super_admin';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface JwtPayload {
  id: number;
  email: string;
  role: Role;
  approval_status: ApprovalStatus;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}
