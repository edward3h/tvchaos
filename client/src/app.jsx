import React from 'react';
import ReactDOM from 'react-dom';
import TitleList from './titlelist';
import RulesList from './ruleslist';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const App = () => (
	<Router>
		<div>
			<div className="links"><Link to="/">Raw Feed</Link> | <Link to="/rules">Rules</Link></div>
			<div className="body">
				<Route exact path="/" component={TitleList} />
				<Route path="/rules" component={RulesList} />
			</div>
		</div>
	</Router>
);

ReactDOM.render(<App />, document.getElementById('root'));
