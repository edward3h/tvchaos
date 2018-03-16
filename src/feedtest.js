require('dotenv').config()

const FeedParser = require('feedparser');
const request = require('request');

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
      console.log(item.title, item.link);
  }
});
