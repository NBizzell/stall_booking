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
								{/* <hr className="newhr" />
							<h2
								className="header-font mg-2"
								style={{ fontSize: "32px", marginBottom: 0 }}
							>
							 Get Involved!
							</h2>
							<div className="fb row showcase gap-4">
								<ShowcaseItem
									image={require("./images/classic-cars.jpg")}
									title="Classic Cars"
									body="We have a large selection of Classic Cars on display every year - if you own a classic car and would like to display it, Stannington Carnival would be happy to have you."
								/>
								<ShowcaseItem
									image={
										"https://scontent.flba3-2.fna.fbcdn.net/v/t39.30808-6/292131497_5308077275915342_8743583750948687089_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=730e14&_nc_ohc=N_MlZUOYvXoAX9PRXYE&_nc_oc=AQltU-AH7ftkwj1QnbeQ31OXS0qBvXnf3kV8GJ9MudswfQtI8mQp789_Fh8I-6G1JPc&_nc_ht=scontent.flba3-2.fna&oh=00_AfDQU4V5po1ZvNtTEJQZSZa3SGPXAWqHpmheySWCD2ZYMQ&oe=63966D13"
									}
									title="Volunteering"
									body="If you have been Celebrating Stannington with us, or if you simply think it’s time we had a carnival again, then we need you to come and help us make it happen!"
								/>
								<ShowcaseItem
									image={
										"https://scontent.flba3-2.fna.fbcdn.net/v/t1.6435-9/66700850_2375277319195367_9087280917134704640_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=730e14&_nc_ohc=NZbelZTHeAMAX81rB2v&_nc_ht=scontent.flba3-2.fna&oh=00_AfDa4KuYqEW0mSL-tKovEi2ijHAvA4di7Cn4zjeHT_aaZA&oe=63B969D9"
									}
									title="Stall Booking"
									body="Potential Stall holders wishing to exhibit at Stannington Carnival 2023 should do so through our new stall booking system."
									link="/bookings/new"
								/>
								<ShowcaseItem
									image={
										"https://scontent.flba3-2.fna.fbcdn.net/v/t39.30808-6/293149435_5308078539248549_5302982147772306707_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=730e14&_nc_ohc=Mx6-dQbhrMkAX8NLB_u&_nc_ht=scontent.flba3-2.fna&oh=00_AfDTCoIWD7Tn617YbC2uk548hMqK10aGkAS-CiYKAjpSNQ&oe=63978EBC"
									}
									title="Placeholder"
									body="We have a large selection of Classic Cars on display every year - if you own a classic car and would like to display it, Stannington Carnival would be happy to have you."
								/>
							</div> */}
							<hr className="newhr" />
							<h2 className="header-font mg-2" style={{ fontSize: "32px" }}>
								Where are we?
							</h2>
							<div className="centered" style={{ marginBottom: "3rem" }}>
								<iframe
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2379.2398549699756!2d-1.544726216862639!3d53.39264916316159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48797f4522bd298f%3A0xdf7abe3e4eccbb45!2sStannington%20Park!5e0!3m2!1sen!2suk!4v1670427738185!5m2!1sen!2suk"
									width="97%"
									height="550"
									style={{ border: 0, borderRadius: "12px" }}
									loading="lazy"
									title="location-map"
								></iframe>
							</div>
							<footer className="home-footer">
								<div className="fb row gap-4">
									<section>
										<h3>Find us on Social Media:</h3>
										<div className="fb row gap-1">
											<a href="https://en-gb.facebook.com/stanningtoncarnival/">
												<IoLogoFacebook className="footer-social no-td" />
											</a>
											<a href="https://www.instagram.com/stanningtoncarnival1/">
												<IoLogoInstagram className="footer-social" />
											</a>
											<a href="https://twitter.com/stanncarnival">
												<IoLogoTwitter className="footer-social" />
											</a>
										</div>
									</section>
									<section>
										<h3>Contact Information:</h3>
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
				<Route path="/register" element={<Register client={client} />} />
			</Routes>
		</>
	);
};

export default App;
