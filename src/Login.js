import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import './Login.css';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(22),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(2)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}));

export default function SignIn() {
	const [ inputEmail, setEmail ] = useState('');
	const [ inputPassword, setPassword ] = useState('');
	const classes = useStyles();
	const history = useHistory();

	function loginHandle() {
		loginFun(inputEmail, inputPassword);
	}

	function loginFun(email, password) {
		console.log('ItemService.login():');
		let bodi = JSON.stringify({ email: email, password: password });

		return fetch('https://api.classico.id/rahmad/admin/login/', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},

			body: bodi
		})
			.then((response) => {
				console.log(response);
				if (response.status !== 200) {
					alert('Gagal Login Atau Email Password Salah');
					throw new Error('HTTP error, status = ' + response.status);
				} else {
					history.push('/admin');
					return response.json();
				}
			})
			.catch((error) => {
				console.log(error.message);
			});
	}

	return (
		<div className="login">
			<Container component="main" maxWidth="xs" className="login__page">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Masuk Admin
					</Typography>
					<div className="login__loginForm">
						<div className="login__inputEmail">
							<input
								className="login__loginFormEmail"
								variant="outlined"
								margin="normal"
								required
								autoComplete="email"
								placeholder="Email"
								autoFocus
								value={inputEmail}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="login__inputPassword">
							<input
								className="login__loginFormPassword"
								variant="outlined"
								margin="normal"
								required
								type="password"
								placeholder="Password"
								autoComplete="current-password"
								value={inputPassword}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>
					<div>
						<button
							type="submit"
							variant="contained"
							color="primary"
							className="login__loginButton"
							onClick={loginHandle}
						>
							Masuk
						</button>
					</div>
				</div>
			</Container>
		</div>
	);
}
