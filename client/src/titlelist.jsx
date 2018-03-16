import React from 'react';
import update from 'immutability-helper';

const PAGE_SIZE = 20;
const TIMEOUT = 3000;

function ListItem(props) {
	let button = null;
	let statusClass = "";
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
		<span className="description" dangerouslySetInnerHTML={{__html: props.description}} />
		{button}
		</div>
	);
}

export default class TitleList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			offset: 0
		};
	}

	componentDidMount() {
		this.doFeedFetch();
	}

	doFeedFetch(offset = this.state.offset) {
		clearTimeout(this.timer);
		const qs = offset > 0 ? `?offset=${offset}` : "";
		fetch(`/api/rawfeed${qs}`)
	        .then(results => {
	                return results.json();
	        }).then(data => {
	                this.setState({items: data, offset: offset});
									if (data.find(x => x.status)) {
										this.timer = setTimeout(doFeedFetch, TIMEOUT);
									}
	        });
	}

	handleDownloadClick(id) {
		console.log("attempt to download ", id);
		fetch(`/api/download/${id}`, {method: 'POST'})
		.then(response => {
			if (response.ok) {
				return response.json();
			}
			throw new Error(`Response error ${response.status}`);
		}).then(data => {
			console.log(data);
			const {id:feed_id, status} = data;
			this.setState(prevState => {
				const index = prevState.items.findIndex(item => {
					return item.id == feed_id;
				});
				if(index > -1) {
					const newItems = update(prevState.items, {[index]: {status: {$set: status}}});
					return {items:newItems};
				}
				return {};
			});
		}).catch(error => console.error(error));
		this.timer = setTimeout(doFeedFetch, TIMEOUT);
	}

	handleHideClick(id) {
		console.log("attempt to hide", id);
		fetch(`/api/rawfeed/hide/${id}`, {method: 'POST'})
		.then(response => {
			this.doFeedFetch();
		});
	}

	render() {
		let listitems = this.state.items.map((item) =>
			<ListItem key={item.id} 
				handleDownloadClick={() => {this.handleDownloadClick(item.id);}} 
				handleHideClick={() => {this.handleHideClick(item.id);}}
				{...item} />
		);
		if (this.state.items.length == 0) {
			listitems = <div>Please wait, loading <img width="20" height="20" src="spinner.gif"/></div>;
		}

		const paging = (
			<div className="pagination">
			{this.state.offset > 0 &&
				<button className="previous" onClick={() => this.doFeedFetch(this.state.offset - PAGE_SIZE)}>⬅️ Previous</button>
			}
			{this.state.items.length == PAGE_SIZE && 
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
