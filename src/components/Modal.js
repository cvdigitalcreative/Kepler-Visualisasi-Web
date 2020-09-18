import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import '../css/Modal.css';
import API_KEY from '../components/Api';
import Axios from 'axios';

const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3)
	}
}));

export default function TransitionsModal(props) {
	const classes = useStyles();
	const [ open, setOpen ] = useState(false);
	let filee = null;

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const selectFile = (e) => {
		filee = e.target.files;
	};

	const upload = async () => {
		const formData = new FormData();
		formData.append('file', filee[0]);
		Axios.post(`${API_KEY}upload/html/${props.SetId}`, formData, {
		})
		.then(res => {
			console.log(res.statusText)
			window.location.reload(false);
		})
	};

	return (
		<div>
			<button type="button" className="button-style-input" onClick={handleOpen}>
				Input Data
			</button>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className={classes.modal}
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500
				}}
			>
				<Fade in={open}>
					<div className={classes.paper}>
						<div>
							<div className="admin__inputTitle">
								<h1>
									<label id="transition-modal-title" htmlFor="file">
										Upload File HTML Visualisasi
									</label>
								</h1>
							</div>
							<div className="admin__inputData" id="transition-modal-description">
								<input type="file" className="form-control" id="file" onChange={selectFile} />
								<br />
								<div>
									<button className="admin__inputButton" type="submit" onClick={upload}>
										Submit Data
									</button>
								</div>
							</div>
						</div>
					</div>
				</Fade>
			</Modal>
		</div>
	);
}
