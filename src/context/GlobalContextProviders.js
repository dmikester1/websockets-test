import React from 'react';

import { ScheduleProvider } from './ScheduleContext';
import PropTypes from 'prop-types';

const Providers = (props) => {
	const { children } = props;
	return <ScheduleProvider>{children}</ScheduleProvider>;
};

Providers.propTypes = {
	children: PropTypes.node.isRequired
};

export default Providers;
