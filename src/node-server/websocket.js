import express from 'express';
import http from 'http';
import { setupWebSocket } from './ws/setupWebSocket.js';

const app = express();

const PORT = 3003;

// app.use(express.json());
//app.use(express.static('public'));
const server = http.createServer(app);

setupWebSocket(server);

server.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log('WebSocket server is up on port: ' + PORT);
});
