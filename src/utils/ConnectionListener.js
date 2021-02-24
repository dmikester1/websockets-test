import React, { useState, useEffect } from 'react';

const ConnectionListener = () => {
	const [isDisconnected, setIsDisconnected] = useState(false);

	useEffect(() => {
		const handleConnectionChange = () => {
			const condition = navigator.onLine ? 'online' : 'offline';
			if (condition === 'online') {
				const webPing = setInterval(() => {
					fetch('//google.com', {
						mode: 'no-cors'
					})
						.then(() => {
							setIsDisconnected(false);
							clearInterval(webPing);
						})
						.catch(() => setIsDisconnected(true));
				}, 2000);
				return;
			}
			return setIsDisconnected(true);
		};

		handleConnectionChange();
		window.addEventListener('online', handleConnectionChange);
		window.addEventListener('offline', handleConnectionChange);

		return () => {
			window.removeEventListener('online', handleConnectionChange);
			window.removeEventListener('offline', handleConnectionChange);
		};
	}, []);

	return (
		<div>
			{isDisconnected && (
				<div className={'internet-error'}>
					<p>Internet connection lost</p>
				</div>
			)}
			<ComposedComponent {...this.props} />
		</div>
	);
};

export default ConnectionListener;
