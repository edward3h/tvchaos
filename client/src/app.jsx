import React from 'react';
import ReactDOM from 'react-dom';
import TitleList from './titlelist';
import RulesList from './ruleslist';
import {BrowserRouter as Router, NavLink, Route} from 'react-router-dom';

const App = () => (
  <Router basename=BASENAME>
    <div>
      <div className="links"><NavLink to="/" activeClassName="active" exact>Raw Feed</NavLink> | <NavLink to="/rules" activeClassName="active">Rules</NavLink></div>
      <div className="body">
        <Route exact path="/" component={TitleList}/>
        <Route path="/rules" component={RulesList}/>
      </div>
    </div>
  </Router>
);

ReactDOM.render(<App/>, document.getElementById('root'));
