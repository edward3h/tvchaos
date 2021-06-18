/* eslint-disable no-console */
import React from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

const PAGE_SIZE = 20;
const TIMEOUT = 3000;
const SEARCH_TIMEOUT = 500;

function ListItem(props) {
  let button = null;
  let statusClass = '';
  if (props.status) {
    button = <span className="right">{props.status}</span>;
    statusClass = `status ${props.status}`;
  } else {
    button = (
      <span className="right">
        <button onClick={props.handleDownloadClick}>Download</button>
        <button onClick={props.handleHideClick}>Hide</button>
      </span>
    );
  }
  let itemClass = `item ${statusClass}`;
  return (
    <div className={itemClass}>
      <span className="title">{props.title}</span>
      <span className="description" dangerouslySetInnerHTML={{__html: props.description}}/>
      {button}
    </div>
  );
}


ListItem.propTypes = {
  status: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  handleDownloadClick: PropTypes.func,
  handleHideClick: PropTypes.func,
};

export default class TitleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      offset: 0,
      search: ''
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.doFeedFetch = this.doFeedFetch.bind(this);
  }

  componentDidMount() {
    this.doFeedFetch();
  }

  doFeedFetch(offset = this.state.offset) {
    clearTimeout(this.timer);
    const query = new URLSearchParams();
    if (offset > 0) {
      query.append('offset', offset);
    }
    if (this.state.search) {
      query.append('search', this.state.search);
    }
    const qs = query.toString();
    fetch(`${BASENAME}/api/rawfeed?${qs}`)
      .then(results => {
        return results.json();
      }).then(data => {
        this.setState({items: data, offset: offset});
        if (data.find(x => x.status)) {
          this.timer = setTimeout(this.doFeedFetch, TIMEOUT);
        }
      });
  }

  handleDownloadClick(id) {
    console.log('attempt to download ', id);
    fetch(`${BASENAME}/api/download/${id}`, {method: 'POST'})
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(`Response error ${response.status}`);
      }).then(data => {
        console.log(data);
        const {id: feed_id, status} = data;
        this.setState(prevState => {
          const index = prevState.items.findIndex(item => {
            return item.id === feed_id;
          });
          if (index > -1) {
            const newItems = update(prevState.items, {[index]: {status: {$set: status}}});
            return {items: newItems};
          }
          return {};
        });
      }).catch(error => console.error(error));
    this.timer = setTimeout(this.doFeedFetch, TIMEOUT);
  }

  handleHideClick(id) {
    console.log('attempt to hide', id);
    fetch(`${BASENAME}/api/rawfeed/hide/${id}`, {method: 'POST'})
      .then(() => {
        this.doFeedFetch();
      });
  }

  handleSearchChange(event) {
    event.preventDefault();
    this.setState({search: event.target.value, offset: 0});
    clearTimeout(this.timer);
    this.timer = setTimeout(this.doFeedFetch, SEARCH_TIMEOUT);
  }

  render() {
    let listitems = this.state.items.map((item) =>
      <ListItem key={item.id}
        handleDownloadClick={() => {
          this.handleDownloadClick(item.id);
        }}
        handleHideClick={() => {
          this.handleHideClick(item.id);
        }}
        {...item} />
    );
    if (this.state.items.length === 0) {
      listitems = <div>Please wait, loading <img width="20" height="20" src="spinner.gif"/></div>;
    }

    const paging = (
      <div className="pagination">
        {this.state.offset > 0 &&
        <button className="previous" onClick={() => this.doFeedFetch(this.state.offset - PAGE_SIZE)}>⬅️ Previous</button>
        }
        <div className="search"><span>Search</span>
          <input type="text" value={this.state.search} onChange={this.handleSearchChange}/>
        </div>
        {this.state.items.length === PAGE_SIZE &&
        <button className="next" onClick={() => this.doFeedFetch(this.state.offset + PAGE_SIZE)}>Next ➡️</button>
        }
      </div>
    );
    return (
      <div className="listouter">
        {listitems}
        {paging}
      </div>
    );
  }
}
