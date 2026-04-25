import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";

import Images from "./Images";
import Detail from "./Detail";
import Tour from "./Tour";
import { Modal } from "../../context/Modal";

import * as propertyImgActions from "../../store/property_img";
import * as agentActions from "../../store/agent";
import available from "../Tools/Available";

/* ── Inline booking sidebar ─────────────────────────────────────────── */
const BookingSidebar = ({ property, openTour }) => {
	const user = useSelector((s) => s.session.user);
	const schedule = available(property);
	const days = Object.keys(schedule);

	const [today, setToday] = useState(days[0] || "");
	const [hour, setHour] = useState(schedule[days[0]]?.[0] || "");

	const handleDayChange = (day) => {
		setToday(day);
		setHour(schedule[day]?.[0] || "");
	};

	const fmtDay = (d) => {
		if (!d) return "";
		const date = new Date(d + "T12:00:00");
		return date.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div className="rounded-2xl border border-stroke shadow-softMd p-6 bg-white">
			<h3 className="text-base font-bold text-ink mb-1">Book a Showing</h3>
			<p className="text-xs text-inkMuted mb-4">In-person · Free with a buyer's agent</p>

			{/* Date select */}
			<label className="block mb-3">
				<span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
					Date
				</span>
				<select
					className="mt-1 w-full rounded-lg border border-stroke bg-surface px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-[#2a6f97] transition-colors"
					value={today}
					onChange={(e) => handleDayChange(e.target.value)}
				>
					{days.map((d) => (
						<option key={d} value={d}>
							{fmtDay(d)}
						</option>
					))}
				</select>
			</label>

			{/* Time select */}
			<label className="block mb-5">
				<span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
					Time
				</span>
				<select
					className="mt-1 w-full rounded-lg border border-stroke bg-surface px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-[#2a6f97] transition-colors"
					value={hour}
					onChange={(e) => setHour(e.target.value)}
				>
					{(schedule[today] || []).map((h) => (
						<option key={h} value={h}>
							{h}
						</option>
					))}
				</select>
			</label>

			{/* CTA */}
			{user && !user.agent ? (
				<button
					type="button"
					className="w-full rounded-lg bg-[#0f172a] text-white text-sm font-semibold py-3 hover:bg-[#1e293b] transition-colors"
					onClick={openTour}
				>
					Request a Showing
				</button>
			) : !user ? (
				<button
					type="button"
					className="w-full rounded-lg bg-[#0f172a] text-white text-sm font-semibold py-3 hover:bg-[#1e293b] transition-colors"
					onClick={openTour}
				>
					Sign in to Request a Tour
				</button>
			) : null}

			<p className="mt-3 text-center text-[10px] text-gray-400">
				You won't be charged — tours are free
			</p>
		</div>
	);
};

/* ── Main Property modal ────────────────────────────────────────────── */
const Property = ({ property, onClose }) => {
	const dispatch = useDispatch();
	const [showTour, setShowTour] = useState(false);

	useEffect(() => {
		dispatch(propertyImgActions.getAllImages(property.id));
		if (property.listing_agent_id != null) {
			dispatch(agentActions.getThisAgent(property.listing_agent_id));
		}
	}, [property, dispatch]);

	return (
		<div className="relative bg-white w-[92vw] max-w-[1200px] max-h-[92vh] overflow-y-auto rounded-2xl">

			{/* Close button */}
			<button
				type="button"
				className="absolute top-3 right-3 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 shadow text-gray-500 hover:text-gray-900 transition-colors"
				onClick={onClose}
			>
				<X size={16} strokeWidth={2} />
			</button>

			{/* ── Gallery (full width top) ── */}
			<Images property={property} />

			{/* ── Body: left content + right sticky sidebar ── */}
			<div className="flex gap-8 px-8 py-7 items-start">

				{/* Left — scrolls with the page */}
				<div className="flex-1 min-w-0">
					<Detail property={property} openTour={() => setShowTour(true)} />
				</div>

				{/* Right — sticky sidebar */}
				<div className="w-[280px] flex-shrink-0 sticky top-6">
					<BookingSidebar
						property={property}
						openTour={() => setShowTour(true)}
					/>
				</div>
			</div>

			{showTour && (
				<Modal onClose={() => setShowTour(false)}>
					<Tour property={property} setShowTour={setShowTour} />
				</Modal>
			)}
		</div>
	);
};

export default Property;
