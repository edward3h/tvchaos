import React from 'react';
import ReactDOM from 'react-dom';
import TitleList from './titlelist';

class App extends React.Component {
	render() {
		return (
			<div>
			<TitleList/>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
