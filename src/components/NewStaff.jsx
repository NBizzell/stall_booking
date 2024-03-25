import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";

const NewStaff = (props) => {
	const [userDetails, setUserDetails] = useState({
		username: "",
		password: "",
		role: "finance", // Must default to the starting value
	});

	toastr.options = {
		positionClass: "toast-bottom-right",
		closeButton: true,
	};

	const navigateTo = useNavigate();

	const submitHandler = async (event) => {
		event.preventDefault();
		console.log(userDetails);
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
				"", // email (removed)
				userDetails.password,
				userDetails.role
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

	useEffect(() => {
		console.table(userDetails);
	}, [userDetails]);

	return (
		<div className="centered" style={{ paddingTop: "2rem" }}>
			<div>
				<div className="title header-font centered">
					<h1>Create a new staff account</h1>
				</div>
				<form onSubmit={(event) => submitHandler(event)}>
					<div className="fb col booking-form">
						<h2 className="header-font">Username</h2>
						<input
							className="form-input"
							name="username"
							type="text"
							placeholder="Username"
							value={userDetails.username}
							onChange={(event) => changeHandler(event)}
							required
						/>

						<h2 className="header-font">Password</h2>
						<input
							className="form-input"
							name="password"
							type="password"
							placeholder="Password"
							value={userDetails.password}
							onChange={(event) => changeHandler(event)}
							required
						/>
						<h2 className="header-font">Role</h2>
						<select
							className="form-input"
							style={{ width: "106%" }}
							name="role"
							value={userDetails.role}
							onChange={(event) => changeHandler(event)}
						>
							<option value="finance">Finance Officer</option>
							<option value="admin">Admin Officer</option>
							<option value="allocator">Stall Allocator</option>
							<option value="super">Super Administrator</option>
						</select>
						<div className="centered">
							<button
								className="btn"
								type="submit"
								style={{ marginTop: "2rem" }}
							>
								Submit
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default NewStaff;
