import React, { useState, useEffect } from "react";
import toastr from "toastr";
import Tac from "../components/StanningtonCarnivalTAC.pdf"
import "toastr/build/toastr.min.css";
import "./NewBooking.css";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ScaleLoader from "react-spinners/ScaleLoader";

const NewBooking = (props) => {
	const [catering, setCatering] = useState(false);
	const [loading, setLoading] = useState(false);
  const [file, setFile] = useState ("");
	const [riskAssessment, setRA] = useState ("");
	const [startDate, setStartDate] = useState();
	const [bookingDetails, setBookingDetails] = useState({
		name: "",
		business: "",
		email: "",
		telephone: "",
		type: "Commercial",
		description: "",
		comments: "",
		status: "unpaid",
		pitchNo: -1,
	  authority: "",
		pii: "",
		risk:"",
	});

	const navigate = useNavigate()

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

	const typeHandler = (event)=>{
		if (event.target.value !== 'Catering'){
			setCatering(false)
		} else {
			setCatering(true)
		}
		// changeHandler(event)
		let fieldValue = event.target.value;
		let fieldName = event.target.name;
		const newState = { ...bookingDetails };
		newState["type"] = fieldValue;
		setBookingDetails(newState);
	};

	const handleFileChange = (event)=>{
	   const fileTemp = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0],
    };
		if (event.target.name === "PII"){
			setFile(fileTemp);
		} else {
			setRA(fileTemp)
		}
	};

	const submitHandler = async (event) => {
		event.preventDefault();
    setLoading(true)
		const dtstamp = Math.floor(Date.now() / 1000); //epoch timestamp
		let pliResponse = "";
		let riskResponse = "";
		const nameDate = bookingDetails.business + "_" + dtstamp; 
		//upload PLI to google drive
		if (file.data) {
		 const namePLI = "PLI_" + nameDate
		 let formData = new FormData();
		 formData.append("file", file.data, namePLI);
		 const pliUploadResponse = await props.client.fileUpload(formData);
		 pliResponse = pliUploadResponse.data.id;
		}
		//upload RA to google drive
		if (riskAssessment.data) {
			const nameRA = "RA_" + nameDate
			let riskFormData = new FormData();
			riskFormData.append("file", riskAssessment.data, nameRA);
			const riskUploadResponse = await props.client.fileUpload(riskFormData);
			riskResponse = riskUploadResponse.data.id
		}
		//submit data to DB
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
				description: bookingDetails.description,
				comments: bookingDetails.comments,
				status: bookingDetails.status,
				pitchNo: bookingDetails.pitchNo,
				authority: bookingDetails.authority,
				pii: pliResponse,
				risk: riskResponse,
				pliDate: startDate,
				date: dtstamp,
				userId: userId,
			});  
			// props.refresh !== undefined && props.refresh();
			toastr["success"](
				"Your booking has been submitted. We'll be in contact with you soon.",
				"Success!"
			);
			setLoading(false)
			navigate('/bookings/view')
		} catch (error) {
			toastr["error"](
				"Something has gone wrong while submitting your booking, please contact us directly.",
				"Error!"
			);
			setLoading(false)
			throw error;
		}
	};

	useEffect(() => {
	},[catering])

	return (
		<div className="centered" style={{ paddingTop: "2rem" }}>
			<div>
				<div className="title header-font centered">
					<h1>Booking Registration</h1>
				</div>
				<form onSubmit={(event) => submitHandler(event)}>
					<div className="fb col booking-form">
						<label>
							<h2 className="header-font">Select type of stall:</h2>
						</label>
						<select 
						  className="form-input"
							name = 'stallType'
							onChange = {(event) => typeHandler(event)}
							defaultValue ='Commercial'
						>
						 <option value= 'Commercial'> Standard Stall </option>
						 <option value= 'Catering'> Catering </option>
						 <option value= 'Charity'> Charity / Non Profit </option>
						 <option value= 'GreenFair'> Green Fair </option>
            </select>
						

						<h2 className="header-font">Business/Charity name</h2>
						<input
							className="form-input"
							name="business"
							type="text"
							placeholder="Stall, Business or Charity Name"
							value={bookingDetails.business}
							onChange={(event) => changeHandler(event)}
							required
						/>

						<h2 className="header-font">Full name</h2>
						<input
							className="form-input"
							name="name"
							type="text"
							placeholder="Full name of the contact for this booking"
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
							placeholder="Email address for the stall contact above"
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
							placeholder="Phone number for the stall contact above"
							required
						/>
						<h2 className="header-font">
							Brief stall description
						</h2>
						
						<textarea
							className="form-input"
							name="description"
							type="text"
							value={bookingDetails.description}
							onChange={(event) => changeHandler(event)}
							placeholder="Tell us about what you will be selling / doing on your stall. The information you give will help us to ensure that stalls are located appropriately"
						/>

						{catering ? 
  						<>
								<h2 className="header-font">Local Authority registered with for food hygiene </h2>
								We are required to check the hygiene rating of all food and drink vendors
								<input
									className="form-input"
									name="authority"
									type="text"
									value={bookingDetails.authority}
									onChange={(event) => changeHandler(event)}
									placeholder="Please supply details of the local authority with which your business is registered"
									required
								/>
  						</>
								: ''
						}
					
						<h2 className="header-font">
							Please select the date of expiry for your Public Liability Insurance
						</h2>
					 	<DatePicker 
							className="form-input"
					  	selected={startDate} 
							dateFormat="dd/MM/yyyy" 
							onChange={(date) => setStartDate(date)} 
						/>

					  <h2 className="header-font">
							Please upload proof of your Public Liability Insurance
						</h2>
            <input 
							className="form-input"
							name="PII"
							type="file" 
							onChange={handleFileChange}>
						</input>

					  <h2 className="header-font">
							Please upload your Risk Assesment for the stall
						</h2>
            <input 
							className="form-input"
							name="risk"
							type="file" 
							onChange={handleFileChange}>
						</input>

						<h2 className="header-font">
							Any additional information that you want to share before booking?
						</h2>
						<textarea
							className="form-input"
							name="comments"
							type="text"
							value={bookingDetails.comments}
							onChange={(event) => changeHandler(event)}
							placeholder="Please let us know anything else you think will be useful....."
						/>
						<h2 className="header-font">Important information before you book</h2>
						<ul>
							<li>The event is outside on a field </li> 
							<li>We are expecting 500 - 1000 attendees </li>
							<li>Your pitch size is 3mx3m with a parking space behind the stall </li>
							<li>You will be allocated an arrival window between 09:30-10:30am to ensure safe and controlled vehicle movement </li>
							<li>If you require the use of power you must supply your own generator. We will be limiting the amount of generators on site.</li> 
							<li>You will need to provide your own equipment such as tables, chairs and a marquee, we can't provide shelter in the event of wet weather</li>
							<li>Marquess need to be secured with guy ropes </li>
							<li>Pitch fees are £40, we are also asking you to donate a prize to the raffle</li>
							<li>We have a limited amount of stalls available for non profit organisations at a reduced rate </li>
							<li>You must read and agree to our <a href = {Tac} target = "_blank" rel="noreferrer">terms and conditions </a> to make a booking </li>
						</ul>
						<label>
						<input
							//className="form-input"
							name="terms"
							type="checkbox"
							value={bookingDetails.tac}
							onChange={(event) => changeHandler(event)}
							required
						/>
						I agree to the terms and conditions
						</label>
						<div className="centered">
							
              {loading ? 
                <ScaleLoader
								 color="#0a3153"
								 height={45}
								 width={10}
							  />
							:
								<button
									className="btn"
									type="submit"
									style={{ marginTop: "2rem" }}
								>
									Submit
								</button>
							}
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default NewBooking;
