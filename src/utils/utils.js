export const detectBrowser = () => {
	let browser = null;
	// Opera 8.0+
	/*eslint-disable no-undef*/
	const isOpera =
		(!!window.opr && !!opr.addons) ||
		!!window.opera ||
		navigator.userAgent.indexOf(' OPR/') >= 0;

	// Firefox 1.0+
	const isFirefox = typeof InstallTrigger !== 'undefined';

	// Safari 3.0+ "[object HTMLElementConstructor]"
	const isSafari =
		/constructor/i.test(window.HTMLElement) ||
		(function(p) {
			return p.toString() === '[object SafariRemoteNotification]';
		})(
			!window['safari'] ||
				(typeof safari !== 'undefined' && safari.pushNotification)
		);
	/*eslint-enable no-undef*/
	// Internet Explorer 6-11
	const isIE = /*@cc_on!@*/ false || !!document.documentMode;

	// Edge 20+
	const isEdge = !isIE && !!window.StyleMedia;

	// Chrome 1 - 71
	const isChrome =
		!!window.chrome &&
		(!!window.chrome.webstore || !!window.chrome.runtime);

	// Blink engine detection
	const isBlink = (isChrome || isOpera) && !!window.CSS;

	if (isOpera) {
		browser = 'Opera';
	} else if (isFirefox) {
		browser = 'Firefox';
	} else if (isSafari) {
		browser = 'Safari';
	} else if (isIE) {
		browser = 'IE';
	} else if (isEdge) {
		browser = 'Edge';
	} else if (isChrome) {
		browser = 'Chrome';
	} else if (isBlink) {
		browser = 'Blink';
	} else {
		browser = 'Unknown';
	}
	return browser;
};

// truncate long string with an ellipsis with 2 variables, max
// length and a bool to keep whole words together
export const stringTrunc = (str, n, useWordBoundary) => {
	if (str.length <= n) {
		return str;
	}
	const subString = str.substr(0, n - 1);
	return (
		(useWordBoundary
			? subString.substr(0, subString.lastIndexOf(', '))
			: subString) + String.fromCharCode(8230)
	);
};

/*** date functions ***/

// return either st, nd, or rd depending on the number passed in
function nth(n) {
	return (
		['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th'
	);
}

// return a nice looking date separated by slashes instead of dashes
// e.g. 05/12/2020
export const prettyDateFormat = (d) => {
	// create nice looking date for applied filters string
	const dateParts = d.split('-');
	return `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
};

// format a date correctly to go into a html date input box
// e.g. 2020-05-03
export const dateFormatted = (d) => {
	let month = '' + (d.getMonth() + 1);
	let day = '' + d.getDate();
	const year = d.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return [year, month, day].join('-');
};

// format a date like mm/dd/yyyy
// e.g. 05/12/2020
export const getFormattedDate = (
	date,
	includeTime = false,
	addFive = true
) => {
	// 8-3-20 added this line to add 5 hours to the incoming date because of the time being off 5 hours because of timezone stuff
	if (addFive) {
		date.setHours(date.getHours() + 5);
	}
	const year = date.getFullYear();
	const month = (1 + date.getMonth()).toString().padStart(2, '0');
	const day = date
		.getDate()
		.toString()
		.padStart(2, '0');
	let returnStr = month + '/' + day + '/' + year;
	if (includeTime) {
		let hours = date.getUTCHours();
		const minutes = date
			.getUTCMinutes()
			.toString()
			.padStart(2, '0');
		const seconds = date
			.getUTCSeconds()
			.toString()
			.padStart(2, '0');
		let ampm = 'am';
		if (hours > 11) {
			hours = hours === 12 ? hours : hours - 12;
			ampm = 'pm';
		}
		hours = hours.toString().padStart(2, '0');
		const timeStr = `${hours}:${minutes}:${seconds} ${ampm}`;

		returnStr += ' ' + timeStr;
	}
	return returnStr;
};

const addMinutes = (date, minutes) => {
	return new Date(date.getTime() + minutes * 60000);
};

// format a date object like August 2nd, 2008 11:49AM or without the time
// e.g. August 2nd, 2008 11:49AM
export const prettyDateTime = (d, includeTime = true) => {
	if (!(d instanceof Date) || isNaN(d.getTime())) {
		d = new Date();
	}

	const updatedDate = addMinutes(d, d.getTimezoneOffset());

	// const month = d.toLocaleString('default', { month: 'short' });
	// const year = d.getFullYear();
	// const day = d.getDate() + nth(d.getDate());
	const month = updatedDate.toLocaleString('default', {
		month: 'short'
	});
	const year = updatedDate.getFullYear();
	const day = updatedDate.getDate() + nth(updatedDate.getDate());
	let returnStr = `${month} ${day}, ${year}`;
	if (includeTime) {
		const hours =
			updatedDate.getHours() < 13
				? updatedDate.getHours() === 0
					? 12
					: updatedDate.getHours()
				: updatedDate.getHours() - 12;

		const minutes = updatedDate
			.getMinutes()
			.toString()
			.padStart(2, '0');
		const ampm = updatedDate.getHours() > 11 ? 'PM' : 'AM';
		returnStr += ` ${hours}:${minutes}${ampm}`;
	}
	return returnStr;
};

// return julian date for given date
export const julianDate = (d, fractional = false) => {
	if (fractional) {
		return d / 86400000 - d.getTimezoneOffset() / 1440 + 2440587.5;
	}
	return Math.floor(
		d / 86400000 - d.getTimezoneOffset() / 1440 + 2440587.5
	);
};

// return number of day of the current year (1-366)
export const getDayNumberInYear = () => {
	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 0);
	const diff =
		now -
		start +
		(start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
	const oneDay = 1000 * 60 * 60 * 24;
	const day = Math.floor(diff / oneDay)
		.toString()
		.padStart(3, '0');
	return day;
};

// return two specific dates based on which button was clicked
export const getDates = (period) => {
	switch (period) {
		case 'Today':
			return [dateFormatted(new Date()), dateFormatted(new Date())];
		case 'ThisWeek': {
			const today = new Date(); // get current date
			const first = today.getDate() - today.getDay(); // First day is the day of the month - the day of the week
			const last = first + 6; // last day is the first day + 6
			const firstDay = new Date(new Date().setDate(first));
			const lastDay = new Date(new Date().setDate(last));
			if (lastDay.getDate() < today.getDate()) {
				lastDay.setMonth(lastDay.getMonth() + 1);
			}
			return [dateFormatted(firstDay), dateFormatted(lastDay)];
		}
		case 'ThisMonth': {
			const date = new Date();
			const firstDay = new Date(
				date.getFullYear(),
				date.getMonth(),
				1
			);
			const lastDay = new Date(
				date.getFullYear(),
				date.getMonth() + 1,
				0
			);
			return [dateFormatted(firstDay), dateFormatted(lastDay)];
		}
		case 'Tomorrow': {
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			return [dateFormatted(tomorrow), dateFormatted(tomorrow)];
		}
		case 'NextWeek': {
			const today = new Date();
			const nextWeek = new Date(
				today.getTime() + 7 * 24 * 60 * 60 * 1000
			);
			const first = nextWeek.getDate() - nextWeek.getDay(); // First day is the day of the month - the day of the week
			const last = first + 6; // last day is the first day + 6
			const firstDay = new Date(new Date().setDate(first));
			if (firstDay.getDate() < today.getDate()) {
				firstDay.setMonth(firstDay.getMonth() + 1);
			}
			const lastDay = new Date(new Date().setDate(last));
			if (lastDay.getDate() < today.getDate()) {
				lastDay.setMonth(lastDay.getMonth() + 1);
			}
			return [dateFormatted(firstDay), dateFormatted(lastDay)];
		}
		case 'NextMonth': {
			const today = new Date();
			let firstDay = new Date();
			let lastDay = new Date();
			if (today.getMonth() === 11) {
				firstDay = new Date(today.getFullYear() + 1, 0, 1);
				lastDay = new Date(today.getFullYear() + 1, 1, 0);
			} else {
				firstDay = new Date(
					today.getFullYear(),
					today.getMonth() + 1,
					1
				);
				lastDay = new Date(
					today.getFullYear(),
					today.getMonth() + 2,
					0
				);
			}
			return [dateFormatted(firstDay), dateFormatted(lastDay)];
		}
		case 'Yesterday': {
			const yesterday = new Date();
			yesterday.setDate(yesterday.getDate() - 1);
			return [dateFormatted(yesterday), dateFormatted(yesterday)];
		}
		case 'LastWeek': {
			const today = new Date();
			const lastWeek = new Date(
				today.getTime() - 7 * 24 * 60 * 60 * 1000
			);
			const first = lastWeek.getDate() - lastWeek.getDay(); // First day is the day of the month - the day of the week
			const firstDay = new Date(lastWeek);
			firstDay.setDate(first);
			const lastDay = new Date(
				new Date(firstDay).setDate(firstDay.getDate() + 6)
			);
			return [dateFormatted(firstDay), dateFormatted(lastDay)];
		}
		case 'LastMonth': {
			const today = new Date();
			let firstDay = new Date();
			let lastDay = new Date();
			if (today.getMonth() === 0) {
				firstDay = new Date(today.getFullYear() - 1, 11, 1);
				lastDay = new Date(today.getFullYear(), 1, 0);
			} else {
				firstDay = new Date(
					today.getFullYear(),
					today.getMonth() - 1,
					1
				);
				lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
			}
			return [dateFormatted(firstDay), dateFormatted(lastDay)];
		}
		default:
	}
};
