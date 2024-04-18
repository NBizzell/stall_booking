import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";
import ScaleLoader from "react-spinners/ScaleLoader";
import "../App.css";
import "./Login.css";


// adapt this to get the email and send the forgot password request.
const ForgotPassword = (props) => {
	const [loading, setLoading] = useState(false);
	const [userDetails, setUserDetails] = useState({
		email: "",
	});

	toastr.options = {
		positionClass: "toast-bottom-right",
		closeButton: true,
	};
	const navigateTo = useNavigate();
	const submitHandler = async (event) => {
		event.preventDefault();
		setLoading(true)
		try{
			await props.client.forgotPassword({email: userDetails.email})
		
			toastr["success"](
				"If an account with that email exists a link has been sent to reset your password.",
				"Success!"
			);
			navigateTo("/login");
		} catch (e) {
			if (e.response.status === 404){
				toastr["error"](
					"There is no account registered with that email address, please check and try again",
					"Error!"
				);
			} else {

			toastr["error"](
				"An error occurred attempting to reset your password. If the error continues please contact us directly.",
				"Error!"
			)
		  }
		} finally {
			setLoading(false)
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
						<h2>Password Reset</h2>
						<div className="main">
							<div>
							<div className="login-form">
								<form 
								onSubmit={(event) => submitHandler(event)}
								>
									<div className="form-group">
										<input
											className="form-control"
											name="email"
											type="text"
											value={userDetails.password}
											placeholder="Enter your email address....."
											onChange={(event) => changeHandler(event)}
											required
										></input>
									</div>

									{loading ?
										<ScaleLoader
								 			color="#ffffff"
								 			height={35}
								 			width={10}
							  		/>
									:
										<button className="btn btn-secondary" type="submit">
											Request Password Reset
										</button>
									} 
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

export default ForgotPassword;
