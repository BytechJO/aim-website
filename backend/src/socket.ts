import { Server } from 'socket.io';
import http from 'http';
import { verifyToken } from './helpers/jwt';

let _io: Server | null = null;

export function initSocket(server: http.Server): Server {
  _io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  _io.use((socket, next) => {
    const token = (socket.handshake.auth as any)?.token ||
                  (socket.handshake.query?.token as string);
    if (!token) { next(new Error('No token')); return; }
    try {
      const payload = verifyToken(token);
      if (payload.approval_status !== 'approved') { next(new Error('Unauthorized')); return; }
      (socket as any).user = payload;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  _io.on('connection', (socket) => {
    const user = (socket as any).user;
    console.log(`Dashboard socket connected: ${user?.email ?? socket.id}`);
    socket.on('disconnect', () => {
      console.log(`Dashboard socket disconnected: ${user?.email ?? socket.id}`);
    });
  });

  return _io;
}

export function emit(event: string, data: unknown): void {
  _io?.emit(event, data);
}
