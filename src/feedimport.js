require('dotenv').config()

const FeedParser = require('feedparser');
const request = require('request');
const db = require('./db');

const req = request(process.env.FEED_URL);
const feedparser = new FeedParser();

req.on('error', err => {
	console.log("error", err);
});

req.on('response', function(res) {
  var stream = this; // `this` is `req`, which is a stream

  if (res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'));
  }
  else {
      stream.pipe(feedparser);
  }
});

feedparser.on('error', err => {
	console.log("fperror", err);
});

feedparser.on('readable', function () {
  // This is where the action is!
  var stream = this; // `this` is `feedparser`, which is a stream
  var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
  var item;

  while (item = stream.read()) {
	  //      console.log(item.title, item.link);
	  _doInsert(item.link, item.title, item.description);
  }
});

let inserts = 0;
let feeddone = false;
feedparser.on('end', () => feeddone = true);

function _doInsert(linkurl, title, description) {
	inserts += 1;
	db.query("insert into rawfeed(linkurl, title, description) values (?, ?, ?)",
		[linkurl, _fixTitle(title), description],
		(err, result, fields) => {
			inserts -= 1;
			if(err && err.code == 'ER_DUP_ENTRY') {
				// ignore
			} else if(err) {
				console.log(err);
			} else {
				console.log(`Inserted ${title}`);
			}
			if(inserts < 1 && feeddone) {
				db.end();
			}
		});
}

function _fixTitle(original) {
	return original.replace(/\\\'/g, "'");
}
