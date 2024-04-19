import React, { useEffect, useState } from "react";
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from "react-icons/io";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ApiClient } from "./apiClient";
import "./App.css";
import Admin from "./components/Admin";
import Allocation from "./components/Allocation";
import Committee from "./components/Committee";
import Finance from "./components/Finance.jsx";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import NewBooking from "./components/NewBooking";
import NewStaff from "./components/NewStaff";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./components/Register";
// import ShowcaseItem from "./components/ShowcaseItem";
import StaffPortal from "./components/StaffPortal";
import ViewBookings from "./components/ViewBookings";
import "./images/classic-cars.jpg";
import ResetPassword from "./components/ResetPassword.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
// import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
	const navTo = useNavigate(); // Used for redirecting user on logout
	const [token, changeToken] = useState(window.localStorage.getItem("token"));
	/* eslint-disable */
	const client = new ApiClient(
		() => token,
		() => logout()
	);
	/* eslint-enable */
	const [userRole, setUserRole] = useState(undefined); // userRole stored in a state for PrivateRoute

	// Handle token once generated
	const loggedIn = (token) => {
		window.localStorage.setItem("token", token);
		changeToken(token);
	};

	const logout = () => {
		window.localStorage.setItem("token", undefined);
		changeToken(undefined);
		navTo("/");
	};

	// Get user role and store in state
	useEffect(() => {
		const fetch = async () => {
			// When user logs themselves out, set userRole back to undefined
			if (!token) {
				setUserRole(undefined);
			} else {
				// Set corresponding userRole of the logged in account
				let role = (await client.getCurrentUser(token)).data.role;
				setUserRole(role);
			}
		};
		fetch();
	}, [client, token]);

	return (
		<>
			<Routes>
				{/* Landing page (Home) */}
				<Route
					path="/"
					element={
						<div>
							<Navbar token={token} changeToken={changeToken} client={client} />
							<div>
								<header className="centered col home-header">
									<span className="header-font" style={{ fontSize: "32px" }}>
										Welcome to Stannington Carnival!
									</span>
								</header>

								<div className="centered" style={{ marginTop: "1rem" }}>
									<article className="hero-banner">
										<div className="fb row gap-2">
											<div>
												<h1 className="mg-0" style={{ fontSize: "29px" }}>
													About the Carnival{" "}
												</h1>
												<p style={{ marginBottom: 0, fontSize: "18px" }}>
													Stannington Carnival is a great day out for all the
													family. Visitors can enjoy performances by dance acts
													and musical groups in the main arena, wander around
													the many stalls offering gifts and goodies, swoon at
													the dog show or have a go at archery or circus skills.
													We also have fairground rides, bouncy castles and a
													Helter-skelter to keep the kids entertained and a
													variety of food vendors offering tasty treats. <br />
													<br />
													Started in the mid 90's, Stannington Carnival has
													raised nearly £70,000 to support local community
													groups. The Carnival aims to help make Stannington a
													great place to live and work by helping our
													beneficiaries provide services in and around the
													village. We also want to create a fun day out to bring
													people together. <br /> <br /> Thousands of visitors
													come each year. So, why not join them and see it for
													yourself?
													<br /> <br />
													To book a stall register using the link above then use the booking system to book a stall.
												</p>
											</div>
										</div>
									</article>
								</div>
							</div>
			
							<footer className="home-footer">
								<div className="fb row gap-4">
						
									<section>
										<div className="fb col" style={{ gap: "0.1rem" }}>
											<p className="mg-0">
												<span style={{ fontWeight: "bold" }}>
													Booking Enquiries:
												</span>
												&nbsp;stanningtoncarnival@gmail.com
											</p>
										</div>
									</section>
								</div>
							</footer>
						</div>
					}
				/>
				<Route
					path="/login"
					element={
						<Login loggedIn={(token) => loggedIn(token)} client={client} />
					}
				/>
				<Route path="/bookings">
					<Route
						path="/bookings/new"
						element={
							<>
								<Navbar
									token={token}
									changeToken={changeToken}
									client={client}
								/>
								<NewBooking client={client} token={token} />
							</>
						}
					/>
					<Route
						path="/bookings/view"
						element={
							<>
								<Navbar
									token={token}
									changeToken={changeToken}
									client={client}
								/>

								<h1 className="header-font title centered">Your bookings:</h1>
								<ViewBookings view="holder" client={client} token={token} />
							</>
						}
					/>
				</Route>
				<Route
					element={<PrivateRoute userRole={userRole} allowed={["super"]} />}
				>
					<Route
						path="/new-staff"
						element={
							<>
								<Navbar
									token={token}
									changeToken={changeToken}
									client={client}
								/>
								<NewStaff client={client} />
							</>
						}
					/>
				</Route>
				<Route
					element={<PrivateRoute userRole={userRole} allowed={["super"]} />}
				>
					<Route
						path="/staff"
						element={
							<>
								<Navbar
									token={token}
									changeToken={changeToken}
									client={client}
								/>
								<StaffPortal />
							</>
						}
					/>
				</Route>
				<Route
					element={
						<PrivateRoute userRole={userRole} allowed={["finance", "super"]} />
					}
				>
					<Route
						path="/staff/finance"
						element={
							<>
								<Navbar
									token={token}
									changeToken={changeToken}
									client={client}
								/>
								<Finance client={client} token={token} />
							</>
						}
					/>
				</Route>

				<Route
					element={
						<PrivateRoute
							userRole={userRole}
							allowed={["allocator", "super"]}
						/>
					}
				>
					<Route
						path="/staff/allocator"
						element={
							<>
								<Navbar
									token={token}
									changeToken={changeToken}
									client={client}
								/>
								<Allocation client={client} token={token} />
							</>
						}
					/>
				</Route>
				<Route
					element={
						<PrivateRoute
							userRole={userRole}
							allowed={["allocator", "super", "finance,", "admin", "committee"]}
						/>
					}
				>
					<Route
						path="/staff/committee"
						element={
							<>
								<Navbar
									token={token}
									changeToken={changeToken}
									client={client}
								/>
								<Committee client={client} token={token} />
							</>
						}
					/>
				</Route>
				<Route
					element={
						<PrivateRoute userRole={userRole} allowed={["admin", "super"]} />
					}
				>
					<Route
						path="/staff/admin"
						element={
							<>
								<Navbar
									token={token}
									changeToken={changeToken}
									client={client}
								/>
								<Admin client={client} token={token} />
							</>
						}
					/>
				</Route>
				
				<Route 
					path="/reset/*" 
					element={<ResetPassword client={client}/>} 
				/>
			
				<Route 
					path="/forgot" 
					element={<ForgotPassword client={client}/>} 
				/>
				<Route path="/register" element={<Register loggedIn={(token) => loggedIn(token)} client={client} />} />
			</Routes>
		</>
	);
};

export default App;
