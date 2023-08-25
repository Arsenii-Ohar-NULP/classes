import { io } from 'socket.io-client';
import {getAccessToken} from "../account/TokenService";
export const socket = io(process.env['NEXT_PUBLIC_MESSAGE_SERVICE'], {
  auth: (cb) => {
    cb({
      token: getAccessToken(),
    });
  },
  autoConnect: false
});
