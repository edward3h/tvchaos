/* eslint-disable no-console */
import db from './db';

let rules = [];

db.query('select name, pattern, action from rules where pattern_type = \'regexp\'', (err, results) => {
  if(err) {
    console.error('Error:', err);
  } else {
    rules = results;
  }
});

export default function matches(title, action = null) {
  return rules.flatMap(rule => {
    if(new RegExp(rule.pattern, 'i').test(title) && (!action || action === rule.action)) {
      return [{rule: rule.name, action: rule.action}];
    }
    return [];
  });
}
