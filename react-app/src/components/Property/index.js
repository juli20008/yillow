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

				{/* Right — sticky Tour form (DB-backed properties only) */}
				<div className="w-[300px] flex-shrink-0 sticky top-6">
					{String(property.id).startsWith("mls_") ? (
						<div className="rounded-2xl border border-stroke shadow-softMd p-6 bg-white text-center">
							<div className="text-2xl mb-3">🏡</div>
							<p className="text-sm font-semibold text-ink mb-1">
								Interested in this home?
							</p>
							<p className="text-xs text-inkMuted leading-relaxed">
								This is an MLS listing. Contact your agent or use the search
								to find a listed property and book a showing directly.
							</p>
						</div>
					) : (
						<Tour property={property} setShowTour={onClose} inline />
					)}
				</div>
			</div>
		</div>
	);
};

export default Property;
