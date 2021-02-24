import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({
	type = 'checkbox',
	name,
	id,
	checked = false,
	onChange
}) => (
	<input
		type={type}
		name={name}
		id={id}
		checked={checked}
		onChange={onChange}
	/>
);

Checkbox.propTypes = {
	type: PropTypes.string,
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	checked: PropTypes.bool,
	onChange: PropTypes.func.isRequired
};

export default Checkbox;
