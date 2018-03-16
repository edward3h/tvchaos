const SERIES_PATTERN = /^(.+?) (?:- )?S([0-9]+)E([0-9]+):?[A-Za-z ]*?(?: \(([0-9]+(?:st|nd|rd|th)? [A-Za-z]+ [0-9]+)\))(.*?)$/;
const DATE_PATTERN = /^(.+?) \(([0-9]+ [A-Za-z]+ [0-9]+)\)(.*?)$/;
const OLD_DATE_PATTERN = /^(.+?) \(([0-9]+)\)(.*?)$/;

const MATCHERS = [
  {
    pattern: /^(.+?) (?:- )?S([0-9]+)E([0-9]+):?[A-Za-z ]*?(?: \(([0-9]+(?:st|nd|rd|th)? [A-Za-z]+ [0-9]+)\))(.*?)$/,
    fields: [
      {
        name: "title",
        transform: x => x.trim()
      }, {
        name: "series",
        transform: x => parseInt(x, 10)
      }, {
        name: "episode",
        transform: x => parseInt(x, 10)
      }, {
        name: "date",
        transform: x => x
      }, {
        name: "flags",
        transform: x => x.trim()
      }
    ]
  }, {
    pattern: /^(.+?) \(([0-9]+ [A-Za-z]+ [0-9]+)\)(.*?)$/,
    fields: [
      {
        name: "title",
        transform: x => x.trim()
      }, {
        name: "date",
        transform: x => x
      }, {
        name: "flags",
        transform: x => x.trim()
      }
    ]
  }, {
    pattern: /^(.+?) \(([0-9]+)\)(.*?)$/,
    fields: [
      {
        name: "title",
        transform: x => x.trim()
      }, {
        name: "date",
        transform: x => x
      }, {
        name: "flags",
        transform: x => x.trim()
      }
    ]
  }, {
		pattern: /^(.+?) S([0-9]+)E([0-9]+)(.*?)$/,
		fields: [
			{
				name: "title",
				transform: x => x.trim()
			}, {
        name: "series",
        transform: x => parseInt(x, 10)
      }, {
        name: "episode",
        transform: x => parseInt(x, 10)
      }, {
        name: "flags",
        transform: x => x.trim()
      }
		]
	}
];

export default function parseTitle(title) {
  for (let matcher of MATCHERS) {
    let matches = matcher.pattern.exec(title);
    if (matches && matches.length > 1) {
      let result = {};
      for (var i = 1; i < matches.length; i++) {
        if (matcher.fields.length >= i) {
          let field = matcher.fields[i - 1];
          result[field.name] = field.transform(matches[i]);
        }
      }
      return result;
    }
  }
  return false;
}
