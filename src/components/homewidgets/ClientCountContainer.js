import React, { useEffect, useState } from 'react';
// import { useGlobalWebSocketContext } from '../../context/GlobalWebSocketContext';
// import {
// 	useGlobalWSDataActionsContext,
// 	useGlobalWSDataContext
// } from '../../context/GlobalWSDataContext';
import ClientCount from './ClientCount';
import useWebsocket from '../home/use-websocket';

// const writeToCSV = false;

// websocket URL
const wsURL =
	process.env.NODE_ENV === 'development'
		? 'ws://localhost'
		: 'ws://prodorchtest.ecgrow.local';

const ClientCountContainer = () => {
	const [numberClients, setNumberClients] = useState(null);
	const [numberIpads, setNumberIpads] = useState(null);

	const onConnected = (socket) => {
		socket.send(
			JSON.stringify({
				eventType: 'clientCount'
			})
		);
	};

	const { socket, readyState, reconnecting, data } = useWebsocket({
		url: wsURL + ':' + process.env.REACT_APP_WS_PORT,
		onConnected
	});

	// const ws = useGlobalWebSocketContext();
	// const wsData = useGlobalWSDataContext();
	// const setWSData = useGlobalWSDataActionsContext();
	//
	// const numberClients = wsData.numberClients;
	// const numberIpads = wsData.numberIpads;

	useEffect(() => {
		console.log('data changed!!!!');
		console.log({ data });
		console.log({ socket });
		console.log({ readyState });
		if (data) {
			setNumberClients(data.numberClients);
			setNumberIpads(data.numberIpads);
		}
	}, [data, readyState, reconnecting]);

	// useEffect(() => {
	// 	console.log({ readyState });
	// }, [readyState]);

	// useEffect(() => {
	// 	if (ws.data) {
	// 		console.log('ws.data: ', ws.data);
	// 		const message = JSON.parse(ws.data.message);
	// 		if (message.eventType === 'clientConn') {
	// 			const clientCount = message.numberClients;
	// 			const ipadCount = message.numberIpads;
	// 			console.log('clientCount: ' + clientCount);
	// 			setWSData((prevState) => {
	// 				return {
	// 					...prevState,
	// 					numberClients: parseInt(clientCount),
	// 					numberIpads: parseInt(ipadCount)
	// 				};
	// 			});
	// 		} else if (message.eventType === 'movedOrder') {
	// 			console.log('movedOrder msg: ' + message.msg);
	// 			// show notification and update orders on all client
	// 			// except the one who initiated the move
	// 			if (!message.fromMe) {
	// 				const movedOrder = message.movedOrder2;
	// 				console.log('movedOrder: ', movedOrder);
	// 				// update that order with new line num and line position
	// 				// const updatedOrders = orders.map((order) =>
	// 				// 	order.orderNumber === theOrder.orderID
	// 				// 		? {
	// 				// 				...order,
	// 				// 				lineNum: theOrder.lineNumTo,
	// 				// 				linePosition: theOrder.linePosTo
	// 				// 		  }
	// 				// 		: order
	// 				// );
	// 				// console.log('updatedOrders: ', updatedOrders);
	// 				// setOrders(updatedOrders);
	//
	// 				// uncomment these 2 lines to show the banner at the
	// 				// bottom every time an order is moved
	// 				// setMessageBannerText(message.msg);
	// 				// showBanner();
	// 			}
	// 		} else if (message.eventType === 'multipleLogins') {
	// 			console.log('WARNING: ' + message.msg);
	// 		} else {
	// 			console.log('generic event: ', message);
	// 		}
	// 	}
	// }, [ws.data, setWSData]);

	// useEffect(() => {
	// 	if (writeToCSV && wsData?.movedOrderDetails?.orderNumber) {
	// 		ws.send(
	// 			JSON.stringify({
	// 				eventType: 'movedOrder',
	// 				movedOrder: {
	// 					orderNumber: wsData.movedOrderDetails.orderNumber,
	// 					lineNumTo: wsData.movedOrderDetails.lineNumTo,
	// 					linePosTo: wsData.movedOrderDetails.linePosTo
	// 				}
	// 			})
	// 		);
	// 		setWSData((prevState) => {
	// 			return {
	// 				...prevState,
	// 				movedOrderDetails: {}
	// 			};
	// 		});
	// 	}
	// }, [wsData.movedOrderDetails]);

	return (
		<ClientCount
			numberClients={numberClients}
			numberIpads={numberIpads}
		/>
	);
};

ClientCountContainer.propTypes = {};

export default ClientCountContainer;
