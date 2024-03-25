import React, { useEffect, useState } from "react";
import Select from "react-select";
import toastr from "toastr";
import "./Allocation.css";
import UserList from "./UserList";
import ViewBookings from "./ViewBookings";

const Allocation = (props) => {
	const [selectedUser, setSelectedUser] = useState(undefined);
	const [selectedStatus, setSelectedStatus] = useState(undefined);
	const [selectedBooking, setSelectedBooking] = useState(undefined);
	const [updated, setUpdated] = useState(0);
	const [dropdownContents, setDropdownContents] = useState([]);
	const [dropdownSelection, setDropdownSelection] = useState(undefined);

	toastr.options = {
		positionClass: "toast-bottom-right",
		closeButton: true,
	};

	const changePitchNo = async (event) => {
		event.preventDefault();
		if (!(dropdownSelection > 0)) {
			toastr["error"]("Pitch number must be a positive number!", "Error!");
			return;
		}
		if (!(await props.client.checkPitchNo(dropdownSelection)).data) {
			let updatedBooking = { ...selectedBooking, pitchNo: dropdownSelection };
			await props.client.updateBooking(updatedBooking);
			setSelectedBooking(updatedBooking);
			setUpdated(updated + 1);
			toastr["success"]("Pitch number assigned!", "Success!");
		} else {
			toastr["error"](
				"A booking with that pitch number already exists!",
				"Error!"
			);
		}
	};

	useEffect(() => {
		const generateDropdownContents = async () => {
			let totalStalls = 300;
			let availablePitches = []; // This will store the output array
			let unavailablePitches = (await props.client.getPitchList()).data;
			for (let i = 1; i <= totalStalls; i++) {
				availablePitches.push({
					value: i,
					label: i,
					isDisabled: unavailablePitches.includes(String(i)),
					// Very slow solution, but easiest to read
				});
			}
			setDropdownContents(availablePitches);
		};
		generateDropdownContents();
	}, [props.client, updated]);

	return (
		<div className="fb row">
			<div
				className="fb col"
				style={{
					borderRight: "1px solid #aaa",
					minWidth: "415px",
				}}
			>
				<UserList
					client={props.client}
					token={props.token}
					setSelectedUser={setSelectedUser}
					setSelectedStatus={setSelectedStatus}
				/>
			</div>
			<div className="fb col" style={{ minHeight: "90vh", minWidth: "75%" }}>
				<div className="fb row centered gap-2 fixed-element">
					<div style={{ width: "300px" }}>
						<Select
							style={{ width: "10rem" }}
							placeholder="Choose a stall number..."
							options={dropdownContents}
							onChange={(event) => setDropdownSelection(event.label)}
							width={100}
						/>
					</div>
					<button className="btn" onClick={(event) => changePitchNo(event)}>
						Submit
					</button>
				</div>
				<h2 className="header-font finance-header">
					Selected user's bookings:
				</h2>
				{selectedUser || selectedStatus ? (
					<ViewBookings
						client={props.client}
						token={props.token}
						user={selectedUser}
						status={selectedStatus}
						setSelectedBooking={setSelectedBooking}
						updated={updated}
					/>
				) : (
					<div
						className="header-font finance-header centered"
						style={{ width: "100%", height: "100%" }}
					>
						User has never logged in.
					</div>
				)}
			</div>
		</div>
	);
};

export default Allocation;
