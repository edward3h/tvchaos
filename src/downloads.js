/* eslint-disable no-console */
require('dotenv').config();
import Transmission from 'transmission';

const transmission = new Transmission({
  port: process.env.TRANSMISSION_PORT || 9091,
  host: process.env.TRANSMISSION_HOST
});

function add(url, callback) {
  transmission.addUrl(url, function(err, result) {
    if(err) {
      console.log('add torrent error', err);
      callback(-1);
    } else {
      callback(result.id);
    }
  });
}

function status(ids, callback) {
  transmission.get(ids, function(err, result) {
    if(err) {
      console.log('get torrents error', err);
      callback({});
    } else {
      const mapping = {};
      result.torrents.forEach(t => {
        mapping[t.id] = transmission.statusArray[t.status];
      });
      callback(mapping);
    }
  });
}

export default {
  add: add,
  status: status
};
