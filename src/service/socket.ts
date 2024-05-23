import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:8080'); // Adjust the URL to your server's URL

export default socket;
