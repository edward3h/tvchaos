
const SERIES_PATTERN = /^(.+?) (?:- )?S([0-9]+)E([0-9]+):?[A-Za-z ]*?(?: \(([0-9]+(?:st|nd|rd|th)? [A-Za-z]+ [0-9]+)\))(.*?)$/;
const DATE_PATTERN = /^(.+?) \(([0-9]+ [A-Za-z]+ [0-9]+)\)(.*?)$/;
const OLD_DATE_PATTERN = /^(.+?) \(([0-9]+)\)(.*?)$/;

export default function parseTitle(title) {
 	let matches = SERIES_PATTERN.exec(title);
	if(matches) {
		return {
			title: matches[1].trim(),
			series: parseInt(matches[2], 10),
			episode: parseInt(matches[3], 10),
			date: matches[4],
			flags: matches[5].trim()
		};
	} else {
		let matches = DATE_PATTERN.exec(title);
		if(matches) {
			return {
				title: matches[1].trim(),
				date: matches[2],
				flags: matches[3].trim()
			};
		} else {
			let matches = OLD_DATE_PATTERN.exec(title);
			if(matches) {
	                       return {
	                                title: matches[1].trim(),
	                                date: matches[2],
	                                flags: matches[3].trim()
	                        };
	                } else {
				return false;
			}
		}
	}
}
