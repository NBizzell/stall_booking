import React, { useEffect, useState } from "react";
import { BiSave } from "react-icons/bi";
import {
	FaCheckCircle,
	FaComments,
	FaHandshake,
	FaHeart,
	FaPhone,
	FaRegCalendarAlt,
	FaTimesCircle,
	FaUserAlt,
	FaSourcetree,
	FaHamburger,
	FaStore,
	FaRegFile,
	FaRegFileExcel,
} from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { ImBin } from "react-icons/im";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoMail } from "react-icons/io5";
import { MdConfirmationNumber } from "react-icons/md";
import toastr from "toastr";
import "./BookingCard.css";

toastr.options = {
	positionClass: "toast-bottom-right",
	closeButton: true,
};

const BookingCard = (props) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isEditable, setIsEditable] = useState(false);
	const [editableFields, setEditableFields] = useState({
		business: props.business,
		name: props.name,
		email: props.email,
		telephone: props.telephone,
		type: props.type,
		description: props.description,
		comments: props.comments,
	});

	const bookingTypes = {
		catering: {
			icon: <FaHamburger />,
			colour: "#cc55cc" /* pink */,
		},
		charity: {
			icon: <FaHeart />,
			colour: "#E05147" /* Red */,
		},
		commercial: {
			icon: <FaHandshake />,
			colour: "#1c65bb" /* Blue */,
		},
		greenfair: {
			icon: <FaSourcetree />,
			colour: "#1cbb55" /* Green */,
		},
	};

	const statusTypes = {
		paid: {
			icon: <FaCheckCircle />,
			colour: "#1cbb55" /* Green */,
		},
		unpaid: {
			icon: <FaTimesCircle />,
			colour: "#E05147" /* Red */,
		},
	};

	const capitaliseFirstLetter = (str) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	const formChangeHandler = (event) => {
		setEditableFields({
			...editableFields,
			[event.target.name]: event.target.value,
		});
	};

	const validateEditableFields = () => {
		if (
			!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(editableFields.email)
		) {
			toastr["error"]("Invalid Email", "Booking Edit Failed");
			return false;
		}
		return true;
	};

	const saveBookingChanges = async () => {
		if (!validateEditableFields()) {
			return;
		}
		setIsEditable((prev) => !prev);
		await props.client.updateBooking({
			_id: props._id,
			name: props.name,
			business: props.business,
			email: props.email,
			telephone: props.telephone,
			type: props.type,
			description: props.description,
			comments: props.comments,
			status: props.status,
			userId: props.userId,
			pitchNo: props.pitchNo,
			...editableFields,
		});
		props.updated((prev) => prev + 1);
	};

	const cycleType = () => {
		let typeList = Object.keys(bookingTypes);
		let currentIndex = typeList.indexOf(editableFields.type.toLowerCase()) + 1;
		if (currentIndex >= typeList.length) {
			currentIndex = 0;
		}
		setEditableFields({
			...editableFields,
			type: capitaliseFirstLetter(typeList[currentIndex]),
		});
	};

	const discardChanges = () => {
		setIsEditable(false); // Must be set strictly to false
		setEditableFields({
			name: props.name,
			business: props.business,
			email: props.email,
			type: props.type,
			telephone: props.telephone,
			description:props.description,
			comments: props.comments,
		});
	};

	/* When the user changes between filters, discard the changes. This will ensure that the 
		contents of the edit fields will always match up with the correct card. 
	*/
	useEffect(() => {
		discardChanges();
		/* eslint-disable */
	}, [props._id]);
	/* eslint-enable */

	return (
		<div
			className={`booking-card ${props.isSelected ? "selected" : ""}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="fb row" style={{ justifyContent: "space-between" }}>
				<div
					className={`card-type fb row stall-type ${
						isEditable ? "pointer" : ""
					}`}
					style={{
						backgroundColor:
							bookingTypes[editableFields.type.toLowerCase()].colour,
					}}
					onClick={isEditable ? () => cycleType() : null}
				>
					{bookingTypes[editableFields.type.toLowerCase()].icon}
					<p className="mg-0">{editableFields.type}</p>
				</div>
				<div
					className="fb row gap-1"
					style={
						isHovered && ["admin", "holder"].includes(props.view)
							? { display: "flex" }
							: { display: "none" }
					}
				>
					{isEditable ? (
						<>
							<div
								className="fb row mg-0 card-type blue icon pointer gap-0"
								onClick={() => {
									saveBookingChanges();
								}}
							>
								<p className="icon-label mg-0">Save</p>
								<BiSave style={{ height: "70%" }} />
							</div>
							<div
								className="fb row mg-0 card-type red icon pointer gap-0"
								onClick={() => discardChanges()}
							>
								<p className="icon-label mg-0">Discard</p>
								<IoMdArrowRoundBack style={{ height: "70%" }} />
							</div>
						</>
					) : (
						<>
							<div
								className="fb row mg-0 card-type orange icon pointer gap-0"
								onClick={() => setIsEditable((prev) => !prev)}
							>
								<p className="icon-label mg-0">Edit</p>
								<FiEdit style={{ height: "70%" }} />
							</div>
							<div
								className="fb row mg-0 card-type red icon pointer gap-0"
								onClick={() => props.deleteBooking(props._id)}
							>
								<p className="icon-label mg-0">Delete</p>
								<ImBin style={{ height: "70%" }} />
							</div>
						</>
					)}
				</div>
			</div>
			<div className="fb col" style={{ height: "90%" }}>
				{isEditable ? (
					<div className="fb col gap-1 mt-1">
						<input
							className="form-input auto-width"
							placeholder="Business Name"
							value={editableFields.business}
							name="business"
							onChange={(event) => formChangeHandler(event)}
						/>
						<div className="fb gap-1">
							<input
								className="form-input"
								placeholder="Name"
								value={editableFields.name}
								name="name"
								onChange={(event) => formChangeHandler(event)}
							/>
							<input
								className="form-input"
								placeholder="Phone Number"
								value={editableFields.telephone}
								name="telephone"
								onChange={(event) => formChangeHandler(event)}
							/>
						</div>
						<input
							className="form-input auto-width"
							placeholder="Email"
							value={editableFields.email}
							type="email"
							name="email"
							onChange={(event) => formChangeHandler(event)}
						/>
						<textarea
							placeholder="Stall description"
							className="form-input auto-width"
							value={editableFields.description}
							style={{
								minHeight: "3rem",
								maxHeight: "3rem",
							}}
							name="description"
							onChange={(event) => formChangeHandler(event)}
						/>
						<textarea
							placeholder="Additional Comments"
							className="form-input auto-width"
							value={editableFields.comments}
							style={{
								minHeight: "3rem",
								maxHeight: "3rem",
							}}
							name="comments"
							onChange={(event) => formChangeHandler(event)}
						/>
					</div>
				) : (
					<>
						<div className="fb centered">
							<p className="card-bold mg-0">{props.business}</p>
						</div>
						<div className="fb col">
							<div className="card-contact-info">
								<p className="contact-info-container">
									<FaUserAlt />
									&nbsp;
									{props.name}
								</p>
								<p className="contact-info-container">
									<IoMail />
									&nbsp;
									{props.email}
								</p>
								<p className="contact-info-container">
									<FaPhone />
									&nbsp;
									{props.telephone}
								</p>
								<p className="contact-info-container">
									<FaRegCalendarAlt />
									&nbsp;
									{String(new Date(props.date * 1000)).slice(0, -34)}
								</p>
								{props.pii === "" ? (
									<>
									<p className="contact-info-container"></p>
									<span className="warning">
									 <FaRegFileExcel /> 
									 No Insurance Document
									 </span>
									</>
									):(
									 <p className="contact-info-container">
									   <FaRegFile />
									   &nbsp;
										 {/* https://drive.google.com/file/d/18Uwscf9LPje9Mg3nUiBwwcmKDa5Xpi_t/view?usp=drive_link
										 https://drive.google.com/file/d/1iF85IJ9q7V1402JmKB3kF9pki6Y4pzZv/view?usp=sharing */}
									   <a 
									    href={`https://drive.google.com/file/d/${props.pii}/view?usp=drive_link`}
									    target="_blank"
									    rel="noreferrer"
									   >
										  Public Liability Insurance
									   </a> 
								  </p>
								)}

                {props.risk === "" ? (
									<>
									<p className="contact-info-container"></p>
									<span className="warning">
									 <FaRegFileExcel /> 
									 No Risk Assesment
									 </span>
									</>
									):(
									 <p className="contact-info-container">
									   <FaRegFile />
									   &nbsp;
									   <a 
									    href={`https://drive.google.com/file/d/${props.risk}/view?usp=drive_link`}
									    target="_blank"
									    rel="noreferrer"
									   >
										  Risk Assessment
									   </a> 
								  </p>
								)}

							</div>
							<p className="card-contact-info card-comments">
									<FaStore />
									&nbsp;
									{props.description}
								</p>


							{props.comments && props.comments.toLowerCase() !== "no" ? (
								<p className="card-contact-info card-comments">
									<FaComments />
									&nbsp;
									{props.comments}
								</p>
							) : (
								<></>
							)}
						</div>
					</>
				)}
				<div
					className={"fb col centered"}
					style={{ gap: "0.5rem", marginTop: "auto" }}
				>
					<div className="centered fb" style={{ gap: "0.5rem" }}>
						{!props.pitchNo || props.pitchNo === "-1" ? (
							""
						) : (
							<>
								<MdConfirmationNumber />
								{`Allocated Pitch Number: ${props.pitchNo}`}
							</>
						)}
					</div>

					<div
						onClick={
							props.view === "finance"
								? () =>
										props.changeStatus({
											_id: props._id,
											name: props.name,
											business: props.business,
											email: props.email,
											telephone: props.telephone,
											type: props.type,
											comments: props.comments,
											description: props.description,
											status: props.status,
											userId: props.userId,
											pitchNo: props.pitchNo,
										})
								: null
						}
						className={`card-type centered ${
							props.view === "finance" ? "pointer" : ""
						}`}
						style={{
							width: "100%",
							backgroundColor: statusTypes[props.status.toLowerCase()].colour,
						}}
					>
						{statusTypes[props.status.toLowerCase()].icon}
						<p className="mg-0">{capitaliseFirstLetter(props.status)}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookingCard;
