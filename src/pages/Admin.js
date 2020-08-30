import React, { Component } from 'react';
import XLSX from 'xlsx';
import { make_cols } from '../MakeColumns';
import { SheetJSFT } from '../types';
import Axios from 'axios';
import DataTable from 'react-data-table-component';
import '../css/Admin.css';
import { Link } from 'react-router-dom';
import API_KEY from '../components/Api'
import WEB_ROUTE from '../components/WebRoute'

class ExcelReader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			file: {},
			data: [],
			cols: []
		};
		this.handleFile = this.handleFile.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	state = {
		data: [],
		selectedRows: null
	};

	async createItem(name, jdata) {
		console.log('ItemService.createItem():');
		let satad = JSON.stringify(jdata);
		let bodi = JSON.stringify({ jsondata: satad, nama: name });

		return fetch(`${API_KEY}save/`, {
			method: 'POST',
			// mode: 'no-cors',
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
	}

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
						this.state.data[i].Cuaca
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
		// You can use setState or dispatch with something like Redux so we can use the retrieved data
		console.log('Selected Rows: ', state.selectedRows);
	};

	handleChanges = (state) => {
		// const id = `/show/${state.id}`;
		window.location.href = `${WEB_ROUTE}show/${state.id}`;
		this.context.router.transitionTo();
	};

	render() {
		return (
			<div className="admin">
				<div className="admin__navbar">
					<div className="admin__navbarLeft">
						<h2>Administrator</h2>
					</div>
					<Link to="/login">
						<div className="admin__navbarRight">
							<button className="admin__navbarRightButton">Logout</button>
						</div>
					</Link>
				</div>
				<div>
					<div className="admin__inputTitle">
						<div className="admin__inputTitle">
							<h1>
								<label htmlFor="file">Upload Data Visualisasi</label>
							</h1>
						</div>
						<div className="admin__inputData">
							<input
								type="file"
								className="form-control"
								id="file"
								accept={SheetJSFT}
								onChange={this.handleChange}
							/>
							<br />
							<div>
								<button className="admin__inputButton" type="submit" onClick={this.handleFile}>
									Submit Data
								</button>
							</div>
						</div>
						<div className="admin__datatable">
							<DataTable
								title="Data Beban Puncak"
								columns={this.columns}
								data={this.state.data}
								// selectableRows // add for checkbox selection
								Clicked
								subHeader
								Button
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
