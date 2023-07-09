import { getAccessToken } from 'components/login/AuthService';
import { io } from 'socket.io-client';
export const socket = io(process.env['NEXT_PUBLIC_MESSAGE_SERVICE'], {
  auth: (cb) => {
    cb({
      token: getAccessToken(),
    });
  },
});
