import React, { Component } from 'react';
import XLSX from 'xlsx';
import { make_cols } from '../MakeColumns';
import Axios from 'axios';
import DataTable from 'react-data-table-component';
import '../css/Home.css';
import { Link } from 'react-router-dom';
import API_KEY from '../components/Api';

class ExcelReader extends Component {
	constructor(props) {
		super();
		this.state = {
			file: {},
			data: [],
			url: {},
			cols: [],
			gardu: [],
			bulan: [],
			getGardu: null,
			getBulan: null,
			searchData: [],
		};
		this.handleFile = this.handleFile.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	state = {
		data: [],
		searchData: [],
		selectedRows: null
	};

	async createItem(name, jdata) {
		console.log('ItemService.createItem():');
		let satad = JSON.stringify(jdata);
		let bodi = JSON.stringify({ jsondata: satad, nama: name });

		return fetch(`${API_KEY}save/`, {
			method: 'POST',
			//   mode: "no-cors",
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},

			body: bodi
		})
			.then((response) => {
				// console.log(response);
				if (response.status !== 200) {
					throw new Error('HTTP error, status = ' + response.status);
				}
				window.location.reload(false);
				return response.json();
			})
			.catch((error) => {
				console.log(error.message);
			});
	}

	async getItem() {
		console.log('ItemService.getItem():');
		return fetch(`${API_KEY}list/data/`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		})
			.then((response) => {
				console.log(response);
				if (response.status !== 'Success') {
					throw new Error('HTTP error, status = ' + response.status);
				}
				return response.json();
			})
			.catch((error) => {
				console.log(error.message);
			});
	}

	componentDidMount() {
		this.fetchData();
		this.getGardu();
		this.getBulan();
	}

	getGardu = () => {
		Axios.get(`${API_KEY}data/gardu/`)
			.then((response) => {
				if (response.status === 200) {
					// console.log(response.data);
					this.setState({
						gardu: response.data.data
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	getBulan = () => {
		Axios.get(`${API_KEY}data/bulan/`)
			.then((response) => {
				if (response.status === 200) {
					// console.log(response.data);
					this.setState({
						bulan: response.data.data
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	fetchData = () => {
		Axios.get(`${API_KEY}list/data/`)
			.then((response) => {
				if (response.status === 200) {
					this.setState({
						data: response.data.data
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	handleChange(e) {
		const files = e.target.files;
		if (files && files[0]) this.setState({ file: files[0] });
	}

	handleFile() {
		/* Boilerplate to set up FileReader */
		const reader = new FileReader();
		const rABS = !!reader.readAsBinaryString;

		reader.onload = (e) => {
			/* Parse data */
			const bstr = e.target.result;
			const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			/* Convert array of arrays */
			const data = XLSX.utils.sheet_to_json(ws);
			/* Update state */
			this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
				let final = [];

				for (let i = 0; i < this.state.data.length; i++) {
					final[i] = [
						this.state.data[i].Nama,
						this.state.data[i].Tanggal,
						parseFloat(this.state.data[i].Latitude),
						parseFloat(this.state.data[i].Longitude),
						parseFloat(this.state.data[i].Amp),
						this.state.data[i].amp,
						parseFloat(this.state.data[i].MW),
						this.state.data[i].Cuaca,
						this.state.data[i].Kecamatan
					];
				}

				this.createItem(this.state.file.name, final);
			});
		};

		if (rABS) {
			reader.readAsBinaryString(this.state.file);
		} else {
			reader.readAsArrayBuffer(this.state.file);
		}
	}

	columns = [
		{
			name: 'Nomor',
			selector: 'id',
			sortable: true
		},
		{
			name: 'Nama File',
			selector: 'nama',
			sortable: true
		},
		{
			name: 'Path File',
			selector: 'path',
			sortable: true
		}
	];

	handleAction = (state) => {
		console.log('Selected Rows: ', state.selectedRows);
	};

	async getHtml(url) {
		await Axios.get(`${url}`)
			.then((response) => {
				if (response.data.status === 'Success') {
					console.log(response.data.data);
					this.setState(
						{
							url: response.data.data
						},
						() => {
							window.location.href = `${API_KEY}${this.state.url}`;
							this.context.router.transitionTo();
						}
					);

					return response.data.data;
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	handleChanges = (state) => {
		let htmlLink = `${API_KEY}data/html/${state.id}`;

		this.getHtml(htmlLink);
		console.log(this.state.url);
	};

	getGarduHandler = (e) => {
		this.getGardu = e.target.value;
	};

	getBulanHandler = (e) => {
		this.getBulan = e.target.value;
	};

	getDataSearchingHandler = (url) => {
		Axios.get(`${url}`)
			.then((response) => {
				if (response.status === 200) {
					this.setState({
						searchData: response.data.data
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	handleDataSearch = () => {
		let url = `${API_KEY}data/?gardu=${this.getGardu}&bulan=${this.getBulan}`;
		this.getDataSearchingHandler(url);

	};

	render() {
		return (
			<div className="admin">
				<div className="admin__navbar">
					<div className="admin__navbarLeft">
						<h2>Visualisasi Data</h2>
					</div>
					<Link to="/login">
						<div className="admin__navbarRight">
							<button className="admin__navbarRightButton">Login</button>
						</div>
					</Link>
				</div>
				<div className="admin__inputData">
					<div>
						<h1 className="cari-data-label">
							<label>Cari data</label>
						</h1>
					</div>

					<div className="admin__chooseGardu">
						<label htmlFor="gardu">Pilih Gardu : </label>
						<select id="gardu" onChange={this.getGarduHandler}>
							{this.state.gardu.map((gardu) => {
								return (
									<option value={gardu.id} key={gardu.id}>
										{gardu.gardu}
									</option>
								);
							})}
						</select>
					</div>
					<br />
					<div className="admin__chooseBulan">
						<label htmlFor="gardu">Pilih Bulan : </label>
						<select id="bulan" onChange={this.getBulanHandler}>
							{this.state.bulan.map((bulan) => {
								return (
									<option value={bulan.id} key={bulan.id}>
										{bulan.bulan}
									</option>
								);
							})}
						</select>
					</div>
					<div className="cari-data-button">
						<button className="admin__inputButton" type="submit" onClick={this.handleDataSearch}>
							Cari Data
						</button>
					</div>
				</div>

				<div>
					<div className="admin__inputTitle">
						<div className="admin__datatable">
							<DataTable
								title="Data Beban Puncak berdasarkan pencarian"
								columns={this.columns}
								data={this.state.searchData}
								subHeader
								striped
								highlightOnHover
								pointerOnHover
								onRowClicked={this.handleChanges}
							/>
						</div>
					</div>
				</div>

				<div>
					<div className="admin__inputTitle">
						<div className="admin__datatable">
							<DataTable
								title="Data Beban Puncak"
								columns={this.columns}
								data={this.state.data}
								// Clicked
								subHeader
								// Button
								striped
								highlightOnHover
								pointerOnHover
								onRowClicked={this.handleChanges}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ExcelReader;
