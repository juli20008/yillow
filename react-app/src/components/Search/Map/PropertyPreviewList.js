import { useState } from "react";
import { Heart } from "lucide-react";
import { resolveUrl, FALLBACK_IMAGE } from "../../../utils/imageResolver";

const PreviewItem = ({ property }) => {
	const rawSrc =
		resolveUrl(property.image_urls?.[0] || property.front_img) ||
		FALLBACK_IMAGE;
	const [imgSrc, setImgSrc] = useState(rawSrc);

	const price = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(property.price);

	const statusLabel = (s) => {
		if (!s) return "For Sale";
		if (s.toLowerCase() === "a") return "For Sale";
		if (s.toLowerCase() === "u") return "Sold";
		return s;
	};

	return (
		<div className="ppl-item">
			<div className="ppl-thumb-wrap">
				<img
					className="ppl-thumb"
					src={imgSrc}
					alt=""
					onError={() => setImgSrc(FALLBACK_IMAGE)}
				/>
				<span className="ppl-status-tag">{statusLabel(property.status)}</span>
			</div>
			<div className="ppl-details">
				<div className="ppl-price">{price}</div>
				<div className="ppl-address">
					{property.street}, {property.city}
				</div>
				<div className="ppl-stats">
					{property.bed} bd &middot; {property.bath} ba
					{property.sqft ? ` · ${property.sqft.toLocaleString()} sqft` : ""}
				</div>
			</div>
			<button className="ppl-heart" aria-label="Save property" type="button">
				<Heart size={15} strokeWidth={1.5} />
			</button>
		</div>
	);
};

const PropertyPreviewList = ({ properties }) => (
	<div className="ppl-wrap">
		<div className="ppl-header">
			{properties.length} Propert{properties.length === 1 ? "y" : "ies"} in this area
		</div>
		<div className="ppl-scroll">
			{properties.map((p) => (
				<PreviewItem key={p.id} property={p} />
			))}
		</div>
	</div>
);

export default PropertyPreviewList;
