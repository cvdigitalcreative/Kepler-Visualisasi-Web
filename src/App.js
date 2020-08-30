import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Kepler from './pages/Kepler';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
	return (
		<div className="app">
			<Router>
				<Switch>
					<Route exact path="/">
						<Home />
					</Route>
					<Route exact path="/login">
						<Login />
					</Route>
					<Route path="/admin">
						<Admin />
					</Route>
					<Route path="/show/:id">
						<Kepler />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
