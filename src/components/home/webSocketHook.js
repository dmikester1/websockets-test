// import { useEffect, useState } from 'react';
//
// // define a custom hook
// // accept the url to connect to
// // number of times the hook should retry a connection
// // the interval between retries
// const useWebSocketLite = ({
// 	socketUrl,
// 	retry: defaultRetry = 3,
// 	retryInterval = 1500
// }) => {
// 	// message and timestamp
// 	const [data, setData] = useState();
// 	// send function
// 	const [send, setSend] = useState(() => () => undefined);
// 	// state of our connection
// 	const [retry, setRetry] = useState(defaultRetry);
// 	// retry counter
// 	const [readyState, setReadyState] = useState(false);
//
// 	useEffect(() => {
// 		// console.log('socketUrl: ' + socketUrl);
// 		const ws = new WebSocket(socketUrl);
// 		ws.onopen = () => {
// 			// console.log('Connected to socket');
// 			setReadyState(true);
//
// 			// function to send messages
// 			setSend(() => {
// 				return (data) => {
// 					try {
// 						const d = JSON.stringify(data);
// 						ws.send(d);
// 						return true;
// 					} catch (err) {
// 						return false;
// 					}
// 				};
// 			});
//
// 			// receive messages
// 			ws.onmessage = (event) => {
// 				//const msg = formatMessage(event.data);
// 				// setData({ message: msg, timestamp: getTimestamp() });
// 				setData({ message: event.data });
// 				// console.log(event.data);
// 			};
// 		};
//
// 		// on close we should update connection state
// 		// and retry connection
// 		ws.onclose = () => {
// 			setReadyState(false);
// 			// retry logic
// 			if (retry > 0) {
// 				setTimeout(() => {
// 					setRetry((retry) => retry - 1);
// 				}, retryInterval);
// 			}
// 		};
//
// 		// terminate connection on unmount
// 		return () => {
// 			ws.close();
// 		};
// 		// retry dependency here triggers the connection attempt
// 	}, [retry, retryInterval, socketUrl]);
//
// 	return { send, data, readyState };
// };
//
// export default useWebSocketLite;
