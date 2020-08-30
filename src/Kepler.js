import React from 'react';
import keplerGlReducer from 'kepler.gl/reducers';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { taskMiddleware } from 'react-palm/tasks';
import { Provider, useDispatch } from 'react-redux';
import { addDataToMap } from 'kepler.gl/actions';
import useSwr from 'swr';
import KeplerGl from 'kepler.gl';
import { useParams } from 'react-router-dom';
import Axios from 'axios';

const mapbox_API = 'pk.eyJ1IjoibWRlZGVhbGYiLCJhIjoiY2tkdTN5dDY1MTRnbjJ0bnlwMXo0bnQ5MyJ9.aAMQ4VB9Ty6tPbrVZwkWvg';

const reducers = combineReducers({
	keplerGl: keplerGlReducer
});

const store = createStore(reducers, {}, applyMiddleware(taskMiddleware));

export default function App() {
	return (
		<Provider store={store}>
			<Map />
		</Provider>
	);
}

class Fun {
	state = {
		data: {}
	};
	constructor() {
		// this.componentDidMount()
		let { id } = useParams();
		let data = this.fetchData(id);
		console.log(data);
		console.log(this.state);
	}

	fetchData = (id) => {
		Axios.get(`https://api.classico.id/rahmad/data/${id}`)
			.then((response) => {
				if (response.data.status === 'Success') {
					this.state.data = response.data.data;
					console.log(response.data);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};
}

function Map() {
	let { id } = useParams();

	let state = { data: null };

	function fetchData(id) {
		Axios.get(`https://api.classico.id/rahmad/data/${id}`)
			.then((response) => {
				if (response.data.status === 'Success') {
					console.log(response.data.data.path);
					state.data = response.data.data.path;
					return response.data.data;
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	const dispatch = useDispatch();
	const { data } = useSwr('Nama', async () => {
		const response = await fetch(`https://api.classico.id/rahmad/data/${id}`);
		const data = await response.json();
		return data;
	});
	const sampleConfig = {
		visState: {
			filters: [
				{
					id: 'pln',
					dataId: 'test_time_amp',
					name: 'Tanggal',
					type: 'timeRange',
					enlarged: true
				}
			],
			layers: [
				{
					id: 'hty62yd',
					type: 'point',
					config: {
						dataId: 'test_time_amp',
						label: 'Point',
						color: [ 36, 115, 189 ],
						columns: {
							lat: 'Latitude',
							lng: 'Longitude',
							altitude: null
						},
						isVisible: true,
						visConfig: {
							radius: 35,
							fixedRadius: false,
							opacity: 0.39,
							outline: false,
							thickness: 2,
							colorRange: {
								name: 'ColorBrewer PRGn-6',
								type: 'diverging',
								category: 'ColorBrewer',
								colors: [ '#762a83', '#af8dc3', '#e7d4e8', '#d9f0d3', '#7fbf7b', '#1b7837' ],
								reversed: false
							},
							radiusRange: [ 4.2, 96.2 ],
							'hi-precision': false
						}
					}
				}
			]
		}
	};
	React.useEffect(
		() => {
			if (data) {
				dispatch(
					addDataToMap({
						datasets: {
							info: {
								label: 'Data PLN',
								id: 'test_time_amp'
							},
							data
						},
						option: {
							centerMap: true,
							readOnly: false
						},
						config: sampleConfig
					})
				);
			}
		},
		[ dispatch, data ]
	);

	return (
		<KeplerGl
			id="test_time_amp"
			mapboxApiAccessToken={mapbox_API}
			width={window.innerWidth}
			height={window.innerHeight}
			theme="light"
		/>
	);
}
