import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import OrderCounter from '../homewidgets/OrderCounter';
import ClientCountContainer from '../homewidgets/ClientCountContainer';
import useWebsocket from './use-websocket';
import { useScheduleContext } from '../../context/ScheduleContext';

const useWebSockets = true;

const pageTitle = '';

// websocket URL
const wsURL =
	process.env.NODE_ENV === 'development'
		? 'ws://localhost'
		: 'ws://prodorchtest.ecgrow.local';

const Schedule = () => {
	const { totalOrderCount } = useScheduleContext();

	const onConnected = (socket) => {
		const existingTokens = localStorage.getItem('tokens');
		if (existingTokens) {
			const pw = existingTokens.split('-')[0];
			socket.send(
				JSON.stringify({
					eventType: 'connect',
					user: pw
				})
			);
		} else {
			socket.send(
				JSON.stringify({
					eventType: 'connect'
				})
			);
		}
	};

	const { socket, readyState, reconnecting, data } = useWebsocket({
		url: wsURL + ':' + process.env.REACT_APP_WS_PORT,
		onConnected
	});

	const [title, setTitle] = useState(pageTitle);
	const [fullScreenCounts, setFullScreenCounts] = useState(false);
	const [fullScreenOrders, setFullScreenOrders] = useState(false);

	return (
		<BrowserRouter>
			<>
				<div className={'full-width-container'}>
					{!fullScreenCounts && (
						<div
							className={`header${fullScreenOrders ? ' d-none' : ''}`}
						>
							<div className={'main-title'}>
								<div className={'titleList'}>
									<div className={'webs'}>Websockets</div>
									<div className={'test'}>Test</div>
								</div>
							</div>
							<h1 className={'text-center sub-title'}>{title}</h1>
						</div>
					)}
					<Switch>
						<Route exact path={'/'}>
							<ClientCountContainer />
							{totalOrderCount > 0 && (
								<OrderCounter orderCount={totalOrderCount} />
							)}
						</Route>
					</Switch>
				</div>
			</>
		</BrowserRouter>
	);
};

Schedule.propTypes = {
	orders: PropTypes.array
};

export default Schedule;
