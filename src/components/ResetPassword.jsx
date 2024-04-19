import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";
import ScaleLoader from "react-spinners/ScaleLoader";
import { FaRegEyeSlash, FaRegEye  } from "react-icons/fa";
import "../App.css";
import "./Login.css";

const ResetPassword = (props) => {
	const [loading, setLoading] = useState(false);
	const [userDetails, setUserDetails] = useState({
		username: "",
		password: "",
		confirm: ""
	});

	toastr.options = {
		positionClass: "toast-bottom-right",
		closeButton: true,
	};
	const navigateTo = useNavigate();

	const submitHandler = async (event) => {
		event.preventDefault();
		setLoading(true)
		const token = window.location.href.split("/").pop();
		
		try{
      // check password and confirm match
      if (userDetails.password != userDetails.confirm){
				toastr["error"]("Entered passwords must match", "Password Error")
				setUserDetails({
					password: "",
					confirm: ""
			  })
				return
			}
			// reset password using request in api client
		  const requestOutput =  await props.client.resetPassword(token, {password: userDetails.password});
			toastr[requestOutput.data.status](requestOutput.data.message, requestOutput.data.title);
			if (requestOutput.data.status === "success") {
				navigateTo("/login");
			}
		} catch (e) {
			toastr["error"](
				e.message,
				"Error!"
			)
		  
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
											  autoFocus
												className="form-control"
												name="password"
												type="password"
												value={userDetails.password}
												placeholder="New password..."
												onChange={(event) => changeHandler(event)}
											/>
										</div>

										<div className="form-group">
											<input
												className="form-control"
												name="confirm"
												type="password"
												value={userDetails.confirm}
												placeholder="Confirm password..."
												onChange={(event) => changeHandler(event)}
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
											Reset password
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

export default ResetPassword;
