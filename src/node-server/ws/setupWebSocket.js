// setupWebSocket.js
import WebSocket from 'ws';
// import fs from 'fs';
// import { individualPipeline } from './pipeline.js';
import { broadcastPipeline } from './pipeline.js';
// import { send } from '../../websocket/WebSocket';
import DeviceDetector from 'device-detector-js';
import { v4 as uuidv4 } from 'uuid';

let activeLogins = [];
const clients = [];
export const setupWebSocket = (server) => {
	// ws instance
	const wss = new WebSocket.Server({ noServer: true });

	// hookup broadcast pipeline
	broadcastPipeline(wss.clients);

	// broadcast function to send message to all clients
	wss.broadcast = function broadcast(msg) {
		console.log(msg);
		wss.clients.forEach(function each(client) {
			client.send(msg);
		});
	};

	//handle upgrade of the request
	server.on('upgrade', function upgrade(request, socket, head) {
		try {
			// authentication and some other steps will come here
			// we can choose whether to upgrade or not

			wss.handleUpgrade(request, socket, head, function done(ws) {
				wss.emit('connection', ws, request);
			});
		} catch (err) {
			console.log('upgrade exception', err);
			socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
			socket.destroy();
		}
	});

	const deviceDetector = new DeviceDetector();

	// what to do after a connection is established
	wss.on('connection', (ctx, req) => {
		//const ip = req.socket.remoteAddress;
		const userAgent = req.headers['user-agent'];
		const device = deviceDetector.parse(userAgent);

		// print number of active connections
		console.log('Client connected!');
		console.log('connected ', wss.clients.size);
		// if it is an ipad, save that info with the client
		if (device.device.brand === 'Apple' && device.os.name === 'Mac') {
			ctx.deviceType = 'ipad';
		} else if (device.os.name === 'Windows') {
			ctx.deviceType = 'pc';
		} else {
			ctx.deviceType = 'other';
		}

		const clientsArr = Array.from(wss.clients);
		console.log('Client Count: ', clients.size);
		const numberIpads = clientsArr.filter(
			(c) => c.deviceType === 'ipad'
		).length;
		console.log('numberIpads: ', numberIpads);

		// wss.clients.forEach(function each(client) {
		// 	client.send(
		// 		JSON.stringify({
		// 			eventType: 'clientConn',
		// 			numberClients: wss.clients.size,
		// 			device,
		// 			numberIpads
		// 		})
		// 	);
		// });

		// handle message events
		// receive a message and echo it back
		ctx.on('message', (message) => {
			console.log('raw message: |' + message + '|');
			try {
				const jsonMessage = JSON.parse(message.trim());
				console.log(`Received message => ${jsonMessage}`);
				console.log('Received JSON: ', jsonMessage);
				//ctx.send(`you said ${message}`);

				if (jsonMessage.eventType === 'connect') {
					const clientID = uuidv4();
					ctx.user = clientID;
					console.log(ctx.user);
					clients.push({
						socket: ctx,
						user: clientID,
						data: {
							eventType: 'clientConn',
							numberClients: clients.length + 1,
							device,
							numberIpads
						}
					});
					console.log({ clients });
					clients.forEach(function each(client) {
						client.socket.send(
							JSON.stringify({
								eventType: 'clientConn',
								numberClients: clients.length,
								device,
								numberIpads
							})
						);
					});
				} else if (jsonMessage.eventType === 'clientCount') {
					console.log('recieved clientCount message!');
					clients.forEach(function each(client) {
						//console.log({ client });
						client.socket.send(
							JSON.stringify({
								eventType: 'clientCount',
								numberClients: clients.length,
								device,
								numberIpads,
								source: 'From Node'
							})
						);
					});
				} else if (jsonMessage.eventType === 'movedOrder') {
					const movedOrder = jsonMessage.movedOrder;
					console.log('movedOrder: ', movedOrder);
					clients.forEach(function each(client) {
						let fromMe = false;
						if (client === ctx) {
							fromMe = true;
						}
						const sendToAllMsg =
							'Order ' +
							movedOrder.orderNumber +
							' was moved to line ' +
							movedOrder.lineNumTo +
							' pos ' +
							movedOrder.linePosTo +
							'!!';
						const nowDate = new Date();
						let dateString = nowDate.toDateString() + ' ';
						let hours = nowDate.getHours();
						const ampm = hours >= 12 ? 'pm' : 'am';
						hours = hours % 12;
						hours = hours ? hours : 12;
						dateString += `${hours}:${nowDate.getMinutes()}:${nowDate.getSeconds()} ${ampm}`;

						// csvWriter.writeRecords([
						// 	{
						// 		user: ctx.login.first + ' ' + ctx.login.last,
						// 		action: sendToAllMsg,
						// 		timestamp: dateString
						// 	}
						// ]);
						// for now we are sending this message to all other
						// clients besides the originator because it is causing
						// a refresh when sending to the originating client
						// if (!fromMe) {
						client.send(
							JSON.stringify({
								eventType: 'movedOrder',
								movedOrder: {
									orderID: movedOrder.orderNumber,
									lineNumTo: movedOrder.lineNumTo,
									linePosTo: movedOrder.linePosTo,
									lineNumFrom: movedOrder.lineNumFrom,
									linePosFrom: movedOrder.linePosFrom
								},
								msg: sendToAllMsg,
								fromMe
							})
						);
						// } else {
						// 	client.send('moved order!');
						// }
					});
				} else if (jsonMessage.eventType === 'clientLoggedIn') {
					const pw = jsonMessage.pw;
					const login = loginAccounts.find((la) => la.pw === pw);
					if (login) {
						if (!activeLogins.includes(ctx.login.pw)) {
							// save that login with the client
							ctx.login = login;
							console.log('ctx login: ', ctx.login);
							activeLogins.push(login.pw);
						}
						if (
							activeLogins.length > 0 &&
							activeLogins.some((l) => l !== login.pw)
						) {
							// another user is logged in, send warning message
							const numLogins = activeLogins.filter(
								(l) => l !== login.pw
							).length;
							let msg = 'There is already 1 user';
							if (numLogins > 1) {
								msg = `There are already ${numLogins} users`;
							}
							msg += ' (';

							activeLogins
								.filter((l) => l !== login.pw)
								.forEach((l) => {
									const theLogin = customWS.loginAccounts.find(
										(la) => la.pw === l
									);
									msg += theLogin.first + ' ' + theLogin.last[0];
								});
							msg +=
								') logged in to the Scheduling.  Be careful about moving orders around.';
							console.log('sending msg to the client: ' + msg);
							ctx.send(
								JSON.stringify({
									eventType: 'multipleLogins',
									msg
								})
							);
						}
					} else {
					}
				}
			} catch (e) {
				console.log(e);
			}
		});

		// handle close event
		ctx.on('close', () => {
			if (ctx.login) {
				activeLogins = activeLogins.filter(function(e) {
					return e !== ctx.login.pw;
				});
			}
			console.log('removed - activeLogins: ', activeLogins);
			console.log('CLOSED');
			if (clients && clients.length > 0) {
				console.log('user: ', clients[0].user);
			}
			console.dir(ctx);
			// const client = clients.find((c) => c.user === socket.user);
			// if (!client) return;
			// console.log('Closing ' + client.user);
			// clients.splice(clients.indexOf(client), 1);

			// const clientsArr = Array.from(wss.clients);
			// const numberIpads = clientsArr.filter(
			// 	(c) => c.deviceType === 'ipad'
			// ).length;
			//
			// wss.clients.forEach(function each(client) {
			// 	client.send(
			// 		JSON.stringify({
			// 			eventType: 'clientConn',
			// 			numberClients: wss.clients.size,
			// 			device,
			// 			numberIpads
			// 		})
			// 	);
			// });
			//clearInterval(interval);
		});

		//sent a message that we're good to proceed
		//ctx.send('connection established.');
	});
};
