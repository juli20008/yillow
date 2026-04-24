import { useState, useEffect } from "react";

const REPLIERS_CDN = "https://cdn.repliers.io";
const FALLBACK_IMAGE =
	"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=500&q=80";

const resolveImageUrl = (url) => {
	if (!url) return FALLBACK_IMAGE;
	if (url.includes("yillow.s3")) return FALLBACK_IMAGE;
	if (url.startsWith("http")) return url;
	return `${REPLIERS_CDN}/${url.replace(/^\/+/, "")}`;
};

const SelectDate = ({
	property,
	available,
	today,
	setToday,
	hour,
	setHour,
	setShowSelectDate,
	hourList,
	setHourList,
}) => {
	const [appointment, setAppointment] = useState(new Date());

	useEffect(() => {
		if (today && hour) {
			setAppointment(new Date(`${today} ${hour}`));
		}
	}, [today, hour]);

	return (
		<>
			<div className="tour-type">In-person</div>
			<div className="tour-prefered">Select a preferred time</div>
			<div className="tour-date-wrap">
				<select
					className="select-input"
					value={today}
					onChange={(e) => {
						setToday(e.target.value);
						setHourList(available[today]);
						setHour(available[today][0]);
					}}
				>
					{Object.keys(available).map((day) => (
						<option value={day} key={day}>
							{day}
						</option>
					))}
				</select>
			</div>
			<div>
				<select
					className="select-input"
					value={hour}
					onChange={(e) => {
						setHour(e.target.value);
					}}
				>
					{hourList.map((hour) => (
						<option value={hour} key={hour}>
							{hour}
						</option>
					))}
				</select>
			</div>

			<button className="btn btn-w" onClick={() => setShowSelectDate(false)}>
				<div className="btn-desc">
					{appointment.toDateString()} at {appointment.toLocaleTimeString()}
				</div>
				<div>Request this time</div>
			</button>
			<img
				className="tour-img"
				src={resolveImageUrl(property?.front_img)}
				alt="Property"
				onError={(e) => {
					if (e.currentTarget.src !== FALLBACK_IMAGE) {
						e.currentTarget.src = FALLBACK_IMAGE;
						return;
					}
					e.currentTarget.onerror = null;
				}}
			/>
		</>
	);
};

export default SelectDate;
