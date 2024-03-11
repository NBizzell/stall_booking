import React, { useState } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import "./NewBooking.css";

const NewBooking = (props) => {
	const [bookingDetails, setBookingDetails] = useState({
		name: "",
		business: "",
		email: "",
		telephone: "",
		type: "",
		comments: "",
		status: "unpaid",
		pitchNo: -1,
	});

	toastr.options = {
		positionClass: "toast-bottom-right",
		closeButton: true,
	};

	const changeHandler = (event) => {
		// Updates states on input box change
		let fieldValue = event.target.value;
		let fieldName = event.target.name;
		const newState = { ...bookingDetails };
		newState[fieldName] = fieldValue;
		setBookingDetails(newState);
	};

	const submitHandler = async (event) => {
		event.preventDefault();
		let userId = !props.selectedUser
			? (await props.client.getUserFromToken(props.token)).data._id
			: (await props.client.getUserFromToken(props.selectedUser)).data._id;
		try {
			await props.client.addBooking({
				name: bookingDetails.name,
				business: bookingDetails.business,
				email: bookingDetails.email,
				telephone: bookingDetails.telephone,
				type: bookingDetails.type,
				comments: bookingDetails.comments,
				status: bookingDetails.status,
				pitchNo: bookingDetails.pitchNo,
				date: Math.floor(Date.now() / 1000), //epoch timestamp
				userId: userId,
			});
			props.refresh !== undefined && props.refresh();
			toastr["success"](
				"Your booking has been submitted. We'll be in contact with you soon.",
				"Success!"
			);
		} catch (error) {
			toastr["error"](
				"Something has gone wrong while submitting your booking, please contact us directly.",
				"Error!"
			);
			throw error;
		}
	};

	return (
		<div className="centered" style={{ paddingTop: "2rem" }}>
			<div>
				<div className="title header-font centered">
					<h1>Booking Registration</h1>
				</div>
				<div>
					<h2>Before you book</h2>
					<p>please be aware of the following information:
					<ul>
						<li>The event is outside on a field </li> 
						<li>We are expecting 500 - 1000 attendees </li>
						<li>Your pitch size is 3mx3m with a parking space behind the stall </li>
						<li>You will be allocated an arrival window between 09:30-10:30am to ensure safe and controlled vehicle movement </li>
						<li>If you require the use of power you must supply your own generator. We will be limiting the amount of generators on site.</li> 
						<li>You will need to provide your own equipment such as tables, chairs and a marquee, we can't provide shelter in the event of wet weather</li>
						<li>Marquess need to be secured with guy ropes </li>
						<li>Pitch fees are £40, we are also asking you to donate a prize to the raffle</li>
						<li>We have a limited amount of stalls available for non profits organisations at a reduced rate </li>
						</ul>
	         Sound good? Great, make your booking using the form below
					 </p>
				</div>
				<form onSubmit={(event) => submitHandler(event)}>
					<div className="fb col booking-form">
						<label>
							<h2 className="header-font">Select type of stall:</h2>
						</label>
						<label>
							<input
								type="radio"
								name="type"
								value="Craft"
								onChange={(event) => changeHandler(event)}
							/>
							Craft
						</label>
						<label>
							<input
								type="radio"
								name="type"
								value="Commercial"
								onChange={(event) => changeHandler(event)}
							/>
							Commercial
						</label>
						<label>
							<input
								type="radio"
								name="type"
								value="Charity"
								onChange={(event) => changeHandler(event)}
								required
							/>
							Charity
						</label>

						<h2 className="header-font">Business/Charity name</h2>
						<input
							className="form-input"
							name="business"
							type="text"
							placeholder="Business/charity name"
							value={bookingDetails.business}
							onChange={(event) => changeHandler(event)}
							required
						/>

						<h2 className="header-font">Full name</h2>
						<input
							className="form-input"
							name="name"
							type="text"
							placeholder="Full name"
							value={bookingDetails.name}
							onChange={(event) => changeHandler(event)}
							required
						/>

						<h2 className="header-font">Email</h2>
						<input
							className="form-input"
							name="email"
							type="email"
							value={bookingDetails.email}
							placeholder="Email"
							onChange={(event) => changeHandler(event)}
							required
						/>
						<h2 className="header-font">Phone number</h2>
						<input
							className="form-input"
							name="telephone"
							type="text"
							value={bookingDetails.telephone}
							onChange={(event) => changeHandler(event)}
							placeholder="Phone number"
							required
						/>
						<h2 className="header-font">
							Any additional information that you want to share before booking?
						</h2>
						<textarea
							className="form-input"
							name="comments"
							type="text"
							value={bookingDetails.comments}
							onChange={(event) => changeHandler(event)}
							placeholder="Enter your comment here..."
						/>
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

export default NewBooking;
