/* eslint-disable no-console */
const db = require('./db');

db.query('insert into test1(value) values(?);', ['Edward\'s js test'], (err) => {
  if(err) {
    console.log(err);
  }
  console.log('done');
  db.end();
});

