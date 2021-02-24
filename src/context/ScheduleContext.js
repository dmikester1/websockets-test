import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useMemo
} from 'react';
import {
	checkNodeStatus,
	getTotalOrderCount
} from '../utils/APIFunctions';
import * as PropTypes from 'prop-types';

const initialValues = {
	activeOrder: {},
	BOMs: [],
	chemicals: [],
	columns: [],
	filteredOrders: [],
	lineType: '',
	orders: [],
	pendingOrderIDs: [],
	showDetails: false
};

const ActiveOrderContext = createContext({});
const ScheduleContext = createContext(initialValues);
const ScheduleActionsContext = createContext({});

export const useActiveOrderContext = () =>
	useContext(ActiveOrderContext);

export const useScheduleContext = () => useContext(ScheduleContext);

export const useScheduleActionsContext = () =>
	useContext(ScheduleActionsContext);

export const ScheduleProvider = (props) => {
	const [totalOrderCount, setTotalOrderCount] = useState(0);

	useEffect(() => {
		// function to check status of Node server
		const checkStatus = async () => {
			try {
				const nodeStatus = await checkNodeStatus();
				if (nodeStatus.status === 200) {
					setTotalOrderCount(await getTotalOrderCount());
				}
			} catch (e) {
				// setGlobalSpinner(false);
				// setGlobalError(e.toString());
			}
		};

		checkStatus().catch((e) => {
			console.log(e);
			// setGlobalSpinner(false);
			// setGlobalError(e.toString());
		});
	}, []);

	// useMemo optimizes performance for functions, this should only be run when the app is first loaded
	// all the functions will go in this context
	const values = useMemo(() => {
		return {
			...initialValues,
			totalOrderCount
		};
	}, [totalOrderCount]);

	const actionsValues = useMemo(() => {
		return {
			setTotalOrderCount
		};
	}, []);

	return (
		<ScheduleContext.Provider value={values}>
			<ScheduleActionsContext.Provider value={actionsValues}>
				{props.children}
			</ScheduleActionsContext.Provider>
		</ScheduleContext.Provider>
	);
};

ScheduleProvider.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]).isRequired
};
