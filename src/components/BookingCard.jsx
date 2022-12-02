import React, { useEffect, useState } from "react";
import { BiSave } from "react-icons/bi";
import {
	FaCheckCircle,
	FaComments,
	FaHandshake,
	FaHeart,
	FaPhone,
	FaTimesCircle,
	FaUserAlt,
} from "react-icons/fa";

import { FiEdit } from "react-icons/fi";
import { GiSewingNeedle } from "react-icons/gi";
import { ImBin } from "react-icons/im";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoMail } from "react-icons/io5";
import { MdConfirmationNumber } from "react-icons/md";
import "./BookingCard.css";

const BookingCard = (props) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isEditable, setIsEditable] = useState(false);
	const [editableFields, setEditableFields] = useState({
		business: props.business,
		name: props.name,
		email: props.email,
		telephone: props.telephone,
		type: props.type,
		comments: props.comments,
	});

	const bookingTypes = {
		craft: {
			icon: <GiSewingNeedle />,
			colour: "#1cbb55" /* Green */,
		},
		charity: {
			icon: <FaHeart />,
			colour: "#E05147" /* Red */,
		},
		commercial: {
			icon: <FaHandshake />,
			colour: "#1c65bb" /* Blue */,
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

	const saveBookingChanges = async () => {
		await props.client.updateBooking({
			_id: props._id,
			name: props.name,
			business: props.business,
			email: props.email,
			telephone: props.telephone,
			type: props.type,
			comments: props.comments,
			status: props.status,
			userId: props.userId,
			pitchNo: props.pitchNo,
			...editableFields,
		});
		props.updated((prev) => prev + 1);
	};

	// TODO: Thisss is too buggy to use right now
	const cycleStatus = () => {
		let typeList = Object.keys(bookingTypes);
		let currentIndex = typeList.indexOf(editableFields.type);
		if (currentIndex >= typeList.length - 1) {
			currentIndex = 0;
		} else {
			currentIndex++;
		}
		setEditableFields({
			...editableFields,
			type: typeList[currentIndex],
		});
	};

	const discardChanges = () => {
		setIsEditable(false); // Must be set strictly to false
		setEditableFields({
			name: props.name,
			business: props.business,
			email: props.email,
			telephone: props.telephone,
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
					className="card-type fb row stall-type"
					style={{
						backgroundColor: bookingTypes[props.type.toLowerCase()].colour,
					}}
					onClick={isEditable ? () => cycleStatus() : null}
				>
					{bookingTypes[props.type.toLowerCase()].icon}
					<p className="mg-0">{props.type}</p>
				</div>
				<div
					className="fb row gap-1"
					style={
						isHovered && props.view === "admin"
							? { display: "flex" }
							: { display: "none" }
					}
				>
					{isEditable ? (
						<>
							<div
								className="fb row mg-0 card-type blue icon pointer gap-0"
								onClick={() => {
									setIsEditable((prev) => !prev);
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
					// TODO: Can we add icons to these input forms?
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
						<div className="fb row centered">
							<p className="card-bold mg-0">{props.business}</p>
						</div>
						<div className="fb col">
							<div
								className="fb row card-contact-header"
								style={{ margin: "0.5rem 0" }}
							>
								<FaPhone />
								Contact Information
							</div>
							<div className="card-contact-info">
								<p>
									<span className="bold">Name:&nbsp;</span>
									<span>{props.name}</span>
								</p>
								<p>
									<span className="bold">Email: </span>
									<span>{props.email}</span>
								</p>
								<p>
									<span className="bold">Telephone: </span>
									<span>{props.telephone}</span>
								</p>
							</div>
							{props.comments && props.comments.toLowerCase() !== "no" ? (
								<p
									className="mg-0"
									style={{ overflowY: "auto", height: "4.5rem" }}
								>
									<span className="bold">Additional Comments: </span>
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
