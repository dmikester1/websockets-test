// npm run server
import express from 'express';
import cors from 'cors';
import http from 'http';
import { setupWebSocket } from './ws/setupWebSocket.js';

const useWebSockets = true;

const app = express();

// first check the environment variable PORT otherwise set to 3001
const port = process.env.PORT || 3001;

app.use(express.json());

// add CORS headers to prevent CORS errors
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE'
	);
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	next();
});

app.use(cors());
app.options('*', cors());

// testing out websocket stuff
const server = http.createServer(app);
if (useWebSockets) {
	//setupWebSocket(server, csvWriter);
	setupWebSocket(server);
}
// end of websocket stuff

// check if node server is up
app.get('/status', (req, res) => res.sendStatus(200));

const serverType =
	process.env.NODE_ENV === 'production' ? 'Production' : 'Test';

let statusMsg = `${serverType} Node server for Websockets Test on ${port}`;
if (useWebSockets) {
	statusMsg = `${serverType} Node server and websocket server for Websockets Test on ${port}`;
}
app.get('/', (req, res) => res.status(200).send(statusMsg));

server.listen(port, () => {
	// eslint-disable-next-line no-console
	if (useWebSockets) {
		console.log(
			`${serverType} Node server and websocket server are both up on port: ${port}`
		);
	} else {
		console.log(`${serverType} Node server is up on port: ${port}`);
	}
});
