import { useState, useEffect } from "react";
import { resolvePropertyImage, FALLBACK_IMAGE } from "../../../../utils/imageResolver";

const PropertyTop = ({ property }) => {
	const resolved = resolvePropertyImage(property);

	// Keep src in state so onError fallback survives React re-renders
	// (parent hover interactions would otherwise reset src back to the CDN URL)
	const [src, setSrc] = useState(resolved);
	useEffect(() => { setSrc(resolved); }, [resolved]);

	console.log(`[ImageResolver] ID: ${property?.id} | Final URL: ${src}`);

	return (
		<div className="card-top relative h-44 overflow-hidden bg-[#dadad5]">
			<img
				src={src}
				alt=""
				className="absolute inset-0 h-full w-full object-cover"
				onError={() => setSrc(FALLBACK_IMAGE)}
			/>
			<div className="card-events relative m-3 inline-flex w-fit rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2d2d2d]">
				Listed on {property?.listing_date}
			</div>
		</div>
	);
};

export default PropertyTop;
