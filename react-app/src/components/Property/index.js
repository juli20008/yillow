import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { X } from "lucide-react";

import Images from "./Images";
import Detail from "./Detail";
import Tour from "./Tour";

import * as propertyImgActions from "../../store/property_img";
import * as agentActions from "../../store/agent";

const Property = ({ property, onClose }) => {
	const dispatch = useDispatch();

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
					<Detail property={property} />
				</div>

				{/* Right — sticky Tour form */}
				<div className="w-[300px] flex-shrink-0 sticky top-6">
					<Tour property={property} setShowTour={onClose} inline />
				</div>
			</div>
		</div>
	);
};

export default Property;
