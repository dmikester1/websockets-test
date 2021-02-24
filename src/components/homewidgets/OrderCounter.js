import React from 'react';
import PropTypes from 'prop-types';

const OrderCounter = (props) => {
	const orderCount = props.orderCount;
	return (
		<div className={'order-counter'}>
			<div>{orderCount}</div>
			<span>orders</span>
		</div>
	);
};

OrderCounter.propTypes = {
	orderCount: PropTypes.number.isRequired
};

export default OrderCounter;
