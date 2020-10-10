import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Kepler from './pages/Kepler';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Home from './pages/Home';
import MapView from './pages/MapView'

function App() {
	return (
		<div className="app">
			<Router>
				<Switch>
					<Route exact path="/">
						<MapView />
					</Route>
					<Route exact path="/home" >
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
					<Route path="/show/html/:id">
						
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
