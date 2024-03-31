import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";
import "../App.css";
import "./Login.css";

const Register = (props) => {
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
	const submitHandler = async (event) => {
		event.preventDefault();
		let requestOutput = (
			await props.client.verifyRegistration({
				username: userDetails.username,
				password: userDetails.password,
			})
		).data;
		if (!(await props.client.usernameIsAvailable(userDetails.username)).data) {
			toastr["error"](
				"An account with that username already exists",
				"Account creation failed"
			);
			return;
		}
		toastr[requestOutput.status](requestOutput.message, requestOutput.title);
		if (requestOutput.status !== "success") {
			console.log("Error verifying details");
			return;
		}
		console.log("Good Registration");

		try {
			await props.client.addUser(
				userDetails.username,
				userDetails.email,
				userDetails.password,
				"holder"
			);
			navigateTo("/");
		} catch (e) {
			toastr["error"](
				"An error occurred while creating your account. If the error continues please contact us directly.",
				"Error!"
			);
			throw e;
		}
	};

	const changeHandler = (event) => {
		// Updates states on input box change
		let fieldValue = event.target.value;
		let fieldName = event.target.name;
		const newState = { ...userDetails };
		newState[fieldName] = fieldValue;
		setUserDetails(newState);
	};

	return (
		<div className="fb" 
			style={{ width: "100vw", height: "100vh" }}
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
							<h2 style={{ marginTop: 0 }}>CELEBRATING STANNINGTON</h2>
						</span>
						<h2>Registration</h2>
						<div className="main">
							<div>
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
									<button className="btn btn-secondary" type="submit">
										Register
									</button>
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

export default Register;
