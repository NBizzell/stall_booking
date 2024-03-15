import axios from "axios";
// const url = "http://localhost:3001/";
const url = "https://stall-booking-api.azurewebsites.net/";
console.log("test");

export class ApiClient {
	constructor(tokenProvider, logoutHandler) {
		this.tokenProvider = tokenProvider;
		this.logoutHandler = logoutHandler;
	}

	apiCall(method, url, data) {
		return axios({
			method,
			url,
			headers: {
				token: this.tokenProvider(),
			},
			data,
		}).catch((error) => {
			throw error;
		});
	}

	getUserFromToken(token) {
		return this.apiCall("get", `${url}token/${token}`, token).catch((error) => {
			throw error;
		});
	}

	login(username, password) {
		return this.apiCall("post", `${url}auth`, {
			username,
			password,
		}).catch((error) => {
			throw error;
		});
	}

	getUsers() {
		return this.apiCall("get", `${url}users`);
	}

	usernameIsAvailable(username) {
		return this.apiCall("get", `${url}users/isavailable/${username}`);
	}

	verifyRegistration(details) {
		return this.apiCall("post", `${url}verify/registration`, details);
	}

	addUser(username, email, password, role) {
		return this.apiCall("post", `${url}users`, {
			username,
			email,
			password,
			role,
		});
	}

	removeUser(id) {
		return this.apiCall("delete", `${url}users/${id}`);
	}

	updateUser(id, username, email, password) {
		return this.apiCall("put", `${url}users/${id}`, {
			username,
			email,
			password,
		});
	}

	// Get Current User
	getCurrentUser(token) {
		return this.apiCall("get", `${url}token/${token}`);
	}

	getMyBookings(token) {
		let test = this.apiCall("get", `${url}bookings/${token}`);
		return test;
	}

	// Add booking
	addBooking(booking) {
		console.log(booking);
		return this.apiCall("post", `${url}bookings`, {
			...booking,
		}).catch((error) => {
			throw error;
		});
	}

	// Update Booking
	updateBooking(booking) {
		return this.apiCall("put", `${url}bookings/${booking._id}`, {
			...booking,
		}).catch((error) => {
			throw error;
		});
	}

	// Check pitchNo already allocated
	checkPitchNo(pitchNo) {
		return this.apiCall("get", `${url}pitchno/${pitchNo}`);
	}

	getPitchList() {
		return this.apiCall("get", `${url}bookings/list/pitchnumbers`);
	}

	getAllBookings() {
		return this.apiCall("get", `${url}bookings`);
	}

	getByStatus(status) {
		return this.apiCall("get", `${url}bookings/filter/${status}`);
	}

	getProportions() {
		return this.apiCall("get", `${url}proportions`);
	}

	getTotalAssigned() {
		return this.apiCall("get", `${url}assigned`);
	}

	deleteBooking(id) {
		return this.apiCall("delete", `${url}bookings/${id}`);
	}
}
