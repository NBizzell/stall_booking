import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";
import ScaleLoader from "react-spinners/ScaleLoader";
import "../App.css";
import "./Login.css";

const Login = (props) => {
	const [loading, setLoading] = useState(false);
	const [userDetails, setUserDetails] = useState({
		username: "",
		email: "",
		password: "",
	});

	toastr.options = {
		positionClass: "toast-bottom-right",
		closeButton: true,
	};

	const navigateTo = useNavigate();

	const changeHandler = (event) => {
		// Updates states on input box change
		let fieldValue = event.target.value;
		let fieldName = event.target.name;
		const newState = { ...userDetails };
		newState[fieldName] = fieldValue;
		setUserDetails(newState);
	};

	const submitHandler = async (event) => {
		// Choose what to do on submit
		event.preventDefault(); // Prevent page refreshing
		setLoading(true)
		try {
			const res = await props.client.login(
				userDetails.username,
				userDetails.password
			);
			props.loggedIn(res.data.token);
			toastr.options.closeButton = true;
			toastr["success"]("Logged in successfully.", "Success!");
			navigateTo("/bookings/view");
		} catch (error) {
			toastr.options.closeButton = true;
			toastr["error"]("Those details did not match any account.", "Error!");
			throw error;
		} finally {
			setLoading(false)
		}
	};

	return (
		<div
			className="fb"
			style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
		>
			<div className="sidenav centered" style={{ position: "absolute" }}>
				<div>
					<img
						className="stannington-carnival-sidebar"
						style={{ width: "50%" }}
						src={require("../images/stannington.jpg")}
						alt={"Stannington Carnival logo"}
					/>
					<div className="login-main-text mg-0">
						<span>
							<h2 style={{ marginTop: "0" }}>CELEBRATING STANNINGTON</h2>
						</span>
						<p>Login or <a className="reglink" href="#/register" stlye={{color:"white"}}>register</a> from here to access bookings.</p>
						<div className="main">
							<div >
								<div className="login-form">
									<form 
										onSubmit={(event) => submitHandler(event)}
									>
										<div className="form-group">
											<input
												className="form-control"
												name="username"
												type="text"
												value={userDetails.username}
												placeholder="Username..."
												onChange={(event) => changeHandler(event)}
											></input>
										</div>

										<div className="form-group">
											<input
												className="form-control"
												name="password"
												type="password"
												value={userDetails.password}
												placeholder="Password..."
												onChange={(event) => changeHandler(event)}
											></input>
										</div>

										<p><a className="reglink" href="#/forgot" stlye={{color:"white"}}>Forgotten your password?</a></p>
										<div className="btn-container">
											{loading ?
												<ScaleLoader
								 					color="#ffffff"
								 					height={35}
								 					width={10}
							  				/>
											:
												<button type="submit" className="btn">
													Login
												</button>
											}				
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<img
				style={{ hegith: "100vh", marginLeft: "auto" }}
				src="https://images.unsplash.com/photo-1557674835-b5fe95cdc92e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
				alt="carnival"
			/>
		</div>
	);
};

export default Login;
