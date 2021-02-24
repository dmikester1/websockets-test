import React from 'react';
import PropTypes from 'prop-types';

const ClientCount = (props) => {
	const { numberClients, numberIpads } = props;
	console.log({ props });

	return (
		<div className={'num-clients'}>
			{numberClients > 0 && (
				<>
					{numberClients +
						(numberClients === 1 ? ' client' : ' clients')}
					{numberIpads > 0 && (
						<>
							<br />
							{numberIpads + (numberIpads === 1 ? ' iPad' : ' iPads')}
						</>
					)}
				</>
			)}
		</div>
	);
};

ClientCount.propTypes = {
	numberClients: PropTypes.number.isRequired,
	numberIpads: PropTypes.number.isRequired
};

export default ClientCount;
