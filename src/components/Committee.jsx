import React, { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";


const Committee = (props) => {
	const [proportions, setProportions] = useState({});
	const [totalAssigned, setTotalAssigned] = useState(0);
	const [totalBookingsCount, setTotalBookingsCount] = useState(0);
	const [paid, setPaid] = useState(0);


	let colours = { GreenFair: "#5c5", Catering: "#c5c", Commercial: "#55f", Charity: "#f55" };

	useEffect(() => {
		const callApi = async () => {
			setProportions((await props.client.getProportions()).data);
			setTotalAssigned(
				(await props.client.getTotalAssigned()).data["allocated stalls"]
			);
			setTotalBookingsCount((await props.client.getAllBookings()).data.length);
			setPaid((await props.client.getByStatus("paid")).data.length);
			
		};
		callApi();
		console.log(paid)
		/*eslint-disable*/
	}, [props.client, props.token]);
	/*eslint-enable*/

	return (
		<div className="centered row">
			<div className="fb col centered" style={{height: "500px"}}>
				<p className="header-font" style={{ fontSize: "25px" }}>
					Stall Type Breakdown:
				</p>
				<PieChart
					radius={50}
					label={({ dataEntry }) => `
                ${dataEntry.title}: ${dataEntry.value} (${Math.round(
						dataEntry.percentage
					)}%)`}
					labelPosition={60}
					lineWidth={75}
					labelStyle={{
						fill: "#fff",
						fontSize: "3px",
						pointerEvents: "none",
					}}
					data={Object.entries(proportions).map((item, i) => {
						const [key, value] = item;
						return {
							title: key,
							label: key,
							value: value,
							color: `${colours[key]}`,
							// color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
						};
					})}
				/>
				<div
					className="header-font"
					style={{ fontSize: "25px", textAlign: "center" }}
				>
					<p>
						Total Bookings:
						{` ${totalBookingsCount}`}
					</p>
					<p>
						Bookings paid:
						{` ${paid}`}
					</p>
					<p>
						Bookings assigned Pitch Numbers:
						{` ${totalAssigned}`}
					</p>
				</div>
			</div>
		</div>
	);
};

export default Committee;
