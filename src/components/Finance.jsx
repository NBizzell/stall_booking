import React, { useState } from "react";
import "./Finance.css";
import UserList from "./UserList";
import ViewBookings from "./ViewBookings";

const Finance = (props) => {
	const [selectedUser, setSelectedUser] = useState(undefined);
	const [selectedStatus, setSelectedStatus] = useState(undefined);
	const [updated, setUpdated] = useState(0);

	const changeStatus = async (booking) => {
		let changeTo = booking.status.toLowerCase() === "paid" ? "unpaid" : "paid";
		let updatedBooking = { ...booking, status: changeTo };
		await props.client.updateBooking(updatedBooking);
		setUpdated(updated + 1);
	};

	return (
		<div className="fb flexcontainer">
			<div
				className="fb col flex-item-left"
				style={{
					borderRight: "1px solid #aaa",
				}}
			>
				<UserList
					client={props.client}
					token={props.token}
					setSelectedUser={setSelectedUser}
					setSelectedStatus={setSelectedStatus}
				/>
			</div>
			<div className="fb col flex-item-right">
				<h2 className="header-font finance-header">
					Selected user's bookings:
				</h2>
				{selectedUser || selectedStatus ? (
					<ViewBookings
						client={props.client}
						token={props.token}
						status={selectedStatus}
						user={selectedUser}
						updated={updated}
						view="finance"
						changeStatus={(booking) => changeStatus(booking)}
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

export default Finance;
