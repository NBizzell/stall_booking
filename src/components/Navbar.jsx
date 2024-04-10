import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import "../images/stannington-carnival-logo.jpg";
import "./Navbar.css";

const Navbar = (props) => {
	const [userRole, setUserRole] = useState(undefined);

	const logout = (changeToken) => {
		// removes token from local storage
		// removes the token from app.js
		window.localStorage.removeItem("token");
		changeToken(undefined);
	};

	function capitalizeFirstLetter(string) {
		if (string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
	}

	function responsiveMenu() {
		console.log("responsive")
		let x = document.getElementById("navbar");
		if (x.className === "navbar") {
			x.className = "navbar responsive";
		} else {
			x.className = "navbar";
		}
	}

	// Handles changing userRole state (when user token changes)
	useEffect(() => {
		const callApi = async () => {
			if (props.token) {
				setUserRole((await props.client.getCurrentUser(props.token)).data.role);
			} else {
				setUserRole(undefined);
			}
		};
		callApi();
	}, [props.client, props.token]);

	return (
		<div className="navbar" id="navbar">
			<Link to="/">
				<img
					className="stannington-carnival-logo"
					style={{ height: "60px" }}
					src={require("../images/stannington-carnival-logo.jpg")}
					alt={"event it logo"}
				/>
			</Link>
			<div className="nav-buttons">
				{/* <Link to="/">
					<button className="nav-btn">Home</button>
				</Link> */}

				{["admin", "finance", "committee", "allocator", "super"].includes(
					userRole
				) ? (
					<>
						<Link className="no-td" to={userRole === "super" ? "/staff" : `/staff/${userRole}` }>
							<button className="nav-btn">{`${capitalizeFirstLetter(
								userRole
							)} Page`}</button>
						</Link>
						<Link to="/staff/committee">
							<button className="nav-btn">View Statistics</button>
						</Link>
					</>
				) : (
					<></>
				)}

				<Link className="no-td" to={!props.token ? "/login" : "/bookings/view"}>
					<button
						className="nav-btn"
						style={props.token ? { display: "block" } : { display: "none" }}
					>
						Your Bookings
					</button>
				</Link>
				<Link to={!props.token ? "/login" : "/bookings/new"}>
					<button className="nav-btn">Book</button>
				</Link>
				<Link className="no-td">
					{/* no-td hides text decoration of the Link (it has onClick so it has underline ) */}
					<button
						className="nav-btn"
						onClick={() => logout(props.changeToken)}
						style={props.token ? { display: "block" } : { display: "none" }}
						// There is no ! in this ternary, so it acts the opposite to the other styles
					>
						Log out
					</button>
				</Link>
				<Link
					style={!props.token ? { display: "block" } : { display: "none" }}
					to="/register"
				>
					<button className="nav-btn">Register</button>
				</Link>
				<Link
					to="/login"
					style={!props.token ? { display: "block" } : { display: "none" }}
				>
					<button className="nav-btn">Login</button>
				</Link>
				
			</div>
			<button className="navicon" onClick={()=>responsiveMenu()}>
					<FaBars />
				</button>
		</div>
	);
};

export default Navbar;
