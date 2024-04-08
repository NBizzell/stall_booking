import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import toastr from "toastr";
import "./Admin.css";
import Modal from "./Modal";
import UserList from "./UserList";
import ViewBookings from "./ViewBookings";

const Admin = (props) => {
	const [selectedUser, setSelectedUser] = useState(undefined);
	const [selectedStatus, setSelectedStatus] = useState(undefined);
	const [updated, setUpdated] = useState(0);
	const [deleted, setDeleted] = useState(false);
	const [isModalOpen, setModalIsOpen] = useState(false);
	const [userOrFilter, setUserOrFilter] = useState("");

	toastr.options = {
		positionClass: "toast-bottom-right",
		closeButton: true,
	};

	const deleteBooking = async (id) => {
		await props.client.deleteBooking(id);
		toastr["success"]("The selected booking was deleted.", "Success");
		refresh();
	};

	const refresh = () => {
		setUpdated((prev) => prev + 1);
	};

	useEffect(() => {
		if (selectedUser) {
			setUserOrFilter("user");
		}
	}, [selectedUser]);

	useEffect(() => {
		if (selectedStatus) {
			setUserOrFilter("status");
		}
	}, [selectedStatus]);

	return (
		<div className="fb flexcontainer">
			{isModalOpen && selectedUser && (
				<Modal
					// setUpdated={(prev) => setUpdated(prev)}
					refresh={() => refresh()}
					client={props.client}
					onRequestClose={() => setModalIsOpen(!isModalOpen)}
					selectedUser={selectedUser}
				/>
			)}
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
				<div className="fb row gap-2">
					<h2 className="header-font finance-header">
						Selected user's bookings:
					</h2>
					<div
						style={
							userOrFilter === "user"
								? { display: "flex" }
								: { display: "none" }
						}
						className="admin-button pointer"
						onClick={() => setModalIsOpen(!isModalOpen)}
					>
						<AiOutlinePlusCircle style={{ width: "30px", height: "30px" }} />
						<p>Create Booking</p>
					</div>
				</div>
				{selectedUser || selectedStatus ? (
					<ViewBookings
						client={props.client}
						token={props.token}
						user={selectedUser}
						status={selectedStatus}
						updated={updated} // User for updating
						deleted={deleted} // Used for keeping track when something's been deleted
						setDeleted={setDeleted} // Used to reset deleted state
						view="admin"
						deleteBooking={(id) => deleteBooking(id)}

						// saveEdits={saveEdits}
						// setSaveEdits={setSaveEdits}
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

export default Admin;
