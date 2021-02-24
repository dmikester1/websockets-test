// client specific messages
// each client gets an individual instance
export const individualPipeline = (ctx) => {
	let idx = 0;
	const interval = setInterval(() => {
		ctx.send(`ping pong ${idx}`);
		idx++;
	}, 5000);
	return interval;
};

// broadcast messages
// one instance for all clients
export const broadcastPipeline = (clients) => {
	//let idx = 0;
	// const interval = setInterval(() => {
	// 	for (const c of clients.values()) {
	// 		c.send(`broadcast message ${idx}`);
	// 		c.send(`num clients: ${clients.size}`);
	// 	}
	// 	idx++;
	// }, 3000);
	const broadcast = () => {
		for (const c of clients.values()) {
			//c.send(`broadcast message ${idx}`);
			c.send(`num clients3: ${clients.size}`);
		}
		//idx++;
	};
	// return interval;
	return broadcast;
};
