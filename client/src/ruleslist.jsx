import React from 'react';
import update from 'immutability-helper';

const PAGE_SIZE = 20;
const TIMEOUT = 3000;

function ListItem(props) {
	return (
		<tr className="item">
		<td>{props.name}</td>
		<td>{props.pattern}</td>
		<td>{props.action}</td>
		</tr>
	);
}

export default class RulesList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			offset: 0
		};
	}

	componentDidMount() {
		this.doRulesFetch();
	}

	doRulesFetch(offset = this.state.offset) {
		const qs = offset > 0 ? `?offset=${offset}` : "";
		fetch(`/api/rules${qs}`)
	        .then(results => {
	                return results.json();
	        }).then(data => {
	                this.setState({items: data, offset: offset});
	        });
	}

	render() {
		let listitems = this.state.items.map((item) =>
			<ListItem key={item.id}	{...item} />
		);
		if (this.state.items.length == 0) {
			listitems = <div>Please wait, loading <img width="20" height="20" src="spinner.gif"/></div>;
		}

		const paging = (
			<div className="pagination">
			{this.state.offset > 0 &&
				<button className="previous" onClick={() => this.doRulesFetch(this.state.offset - PAGE_SIZE)}>⬅️ Previous</button>
			}
			{this.state.items.length == PAGE_SIZE && 
				<button className="next" onClick={() => this.doRulesFetch(this.state.offset + PAGE_SIZE)}>Next ➡️</button>
			}
			</div>
		);
		return (
		<div className="listouter">
			<table>
			<thead>
			<tr><th>Name</th><th>Pattern</th><th>Action</th></tr>
			</thead>
			<tbody>
			{listitems}
			</tbody>
			</table>
			{paging}
		</div>
		);
	}
}
