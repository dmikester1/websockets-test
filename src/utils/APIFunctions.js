import axios from 'axios';

const serverURL =
	process.env.NODE_ENV === 'development'
		? 'http://localhost'
		: 'http://local.server';

const port = process.env.REACT_APP_PORT || 3001;

const veryShortTimeout = 2000;
const shortTimeout = 20000;
const longTimeout = 60000;

// function to check if node server is running
export const checkNodeStatus = () => {
	const statusURL = serverURL + `:${port}/status`;
	try {
		return axios({
			method: 'get',
			url: statusURL,
			timeout: veryShortTimeout
		}).catch(() => {
			return Promise.reject('Node server appears to be down.');
		});
	} catch (e) {
		console.log({ e });
	}
};

export const getTotalOrderCount = async () => {
	// const orders = await fetchOrders('all');
	return 56;
};