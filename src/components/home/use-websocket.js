import { useState, useEffect, useRef } from 'react';

export default function useWebsocket({ url, onConnected }) {
	const [data, setData] = useState({});
	const [reconnecting, setReconnecting] = useState(false);
	const socket = useRef(null);

	useEffect(() => {
		console.log('running socket hook');
		socket.current = new WebSocket(url);

		socket.current.onopen = () => {
			console.log('connected');
			onConnected(socket.current);
		};

		socket.current.onclose = () => {
			console.log('closed');
			if (socket.current) {
				if (reconnecting) return;
				setReconnecting(true);
				setTimeout(() => setReconnecting(false), 2000);
				socket.current.close();
				socket.current = undefined;
			}
		};

		socket.current.onmessage = (e) => {
			const wsData = JSON.parse(e.data);
			console.log('message received ', wsData);
			//setData((prev) => [...prev, wsData]);
			setData(wsData);
		};

		return () => {
			socket.current.close();
			socket.current = null;
		};
	}, [url]);

	const readyState = () => {
		if (socket.current) {
			switch (socket.current.readyState) {
				case 0:
					return 'CONNECTING';
				case 1:
					return 'OPEN';
				case 2:
					return 'CLOSING';
				case 3:
					return 'CLOSED';
				default:
					return;
			}
		} else {
			return null;
		}
	};

	if (data && data.length) {
		console.log('USE-WEBSOCKET');
		console.log({ data });
	}

	return {
		socket: socket.current,
		readyState: readyState(),
		reconnecting,
		data
	};
}
