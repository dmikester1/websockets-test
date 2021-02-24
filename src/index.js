import React from 'react';
import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
// import { startWebsocketConnection } from './websocket/WebSocket';
import App from './App';

const title = process.env.REACT_APP_BASE_TITLE;

render(<App title={title} />, document.getElementById('root'));
// startWebsocketConnection();

// eslint-disable-next-line no-undef
if (module.hot) {
	module.hot.accept();
}
