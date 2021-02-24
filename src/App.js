import React from 'react';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import Schedule from './components/home/SchedulePage';
import Providers from './context/GlobalContextProviders';

import './scss/App.scss';

const App = () => {
	return (
		<Providers>
			<div className={'App'}>
				<ReactNotification />
				<Schedule />
			</div>
		</Providers>
	);
};

export default App;
