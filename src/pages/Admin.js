import React, { Component } from 'react';
import XLSX from 'xlsx';
import { make_cols } from '../MakeColumns';
import { SheetJSFT } from '../types';
import Axios from 'axios';
import DataTable from 'react-data-table-component';
import '../css/Admin.css';
import { Link } from 'react-router-dom';
import API_KEY from '../components/Api';
import WEB_ROUTE from '../components/WebRoute';
import InputModal from '../components/Modal';

class Admin extends Component {
	constructor(props) {
		super();
		this.state = {
			file: {},
			data: [],
			cols: [],
			rowId: {},
			url: {},
			gardu: [],
			bulan: [],
			getGardu: null,
			getBulan: null
		};
		this.handleFile = this.handleFile.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	state = {
		data: [],
		selectedRows: null
	};

	async createItem(name, jdata, gardu, bulan) {
		console.log('ItemService.createItem():');
		let satad = JSON.stringify(jdata);
		let bodi = JSON.stringify({ jsondata: satad, nama: name, gardu: gardu, bulan: bulan });

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

	// async getItem() {
	// 	console.log('ItemService.getItem():');
	// 	return fetch(`${API_KEY}list/data/`, {
	// 		method: 'GET',
	// 		headers: {
	// 			Accept: 'application/json',
	// 			'Content-Type': 'application/json'
	// 		}
	// 	})
	// 		.then((response) => {
	// 			if (response.status !== 'Success') {
	// 				throw new Error('HTTP error, status = ' + response.status);
	// 			}
	// 			return response.json();
	// 		})
	// 		.catch((error) => {
	// 			console.log(error.message);
	// 		});
	// }

	componentDidMount() {
		this.fetchData();
		this.getGardu();
		this.getBulan();
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

	getGardu = () => {
		Axios.get(`${API_KEY}data/gardu/`)
			.then((response) => {
				if (response.status === 200) {
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
					this.setState({
						bulan: response.data.data
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

				this.createItem(this.state.file.name, final, this.getGardu, this.getBulan);
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
		},
		{
			cell: (row) => <InputModal SetId={row.id} id={row.id} />,
			ignoreRowClick: true,
			allowOverflow: true,
			button: true
		},
		{
			cell: (row) => (
				<button className="button-style-view" onClick={this.handleOpenData} id={row.id}>
					Lihat Visual
				</button>
			),
			ignoreRowClick: false,
			allowOverflow: true,
			button: true
		},
		{
			cell: (row) => (
				<button className="button-style-delete" onClick={this.handleDeleteData} id={row.id}>
					Delete Data
				</button>
			),
			ignoreRowClick: true,
			allowOverflow: true,
			button: true
		}
	];

	async getHtml(url) {
		Axios.get(`${url}`)
			.then((response) => {
				if (response.data.status === 'Success') {
					console.log(response.data.data);
					this.setState(
						{
							url: response.data.data
						},
						() => {
							console.log(this.state.url);
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

	handleDeleteData = (state) => {
		let deleteDataUrl = state.target.id;

		return fetch(`${API_KEY}delete/data/${deleteDataUrl}`, {
			method: 'DELETE'
		})
			.then((response) => {
				console.log(response);
				if (response.status !== 200) {
					throw new Error('HTTP error, status = ' + response.status);
				}
				window.location.reload(false);
				return response.json();
			})
			.catch((error) => {
				console.log(error.message);
			});
	};

	handleOpenData = (state) => {
		let htmlLink = `${API_KEY}data/html/${state.target.id}`;
		this.getHtml(htmlLink);
	};

	handleAction = (state) => {
		console.log('Selected Rows: ', state.selectedRows);
	};

	handleChanges = (state) => {
		window.location.href = `${WEB_ROUTE}show/${state.id}`;
		this.context.router.transitionTo();
	};

	getGarduHandler = (e) => {
		this.getGardu = e.target.value;
	};

	getBulanHandler = (e) => {
		this.getBulan = e.target.value;
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
						<div className="upload-data-title">
							<h1>
								<label>Upload Data Visualisasi</label>
							</h1>
						</div>
						<div className="">
							<label htmlFor="file">Upload Data Excel : </label>
							<input
								type="file"
								className="form-control input-excel"
								id="file"
								accept={SheetJSFT}
								onChange={this.handleChange}
							/>
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

export default Admin;
