import { useState } from "react";
import { Heart } from "lucide-react";
import { resolveUrl, FALLBACK_IMAGE } from "../../../utils/imageResolver";

const statusLabel = (s) => {
	if (!s) return "Active";
	const l = s.toLowerCase();
	if (l === "a") return "Active";
	if (l === "u") return "Sold";
	return s;
};

const PreviewItem = ({ property, onSelect }) => {
	const rawSrc =
		resolveUrl(property.image_urls?.[0] || property.front_img) ||
		FALLBACK_IMAGE;
	const [imgSrc, setImgSrc] = useState(rawSrc);

	const price = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(property.price);

	return (
		<div
			className="flex flex-col cursor-pointer transition-colors duration-150 hover:bg-surface border-b border-stroke last:border-0"
			onClick={() => onSelect && onSelect(property)}
		>
			{/* Image — full width, 16:9-ish aspect ratio */}
			<div className="relative w-full h-[160px] overflow-hidden">
				<img
					className="w-full h-full object-cover"
					src={imgSrc}
					alt=""
					onError={() => setImgSrc(FALLBACK_IMAGE)}
				/>
				<span className="absolute bottom-2 left-2 bg-black/55 text-white text-[9px] font-semibold uppercase tracking-wide px-2 py-[3px] rounded-full leading-tight">
					{statusLabel(property.status)}
				</span>
				<button
					className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 text-gray-400 hover:text-rose-400 transition-colors"
					type="button"
					aria-label="Save property"
					onClick={(e) => e.stopPropagation()}
				>
					<Heart size={13} strokeWidth={1.5} />
				</button>
			</div>

			{/* Text block */}
			<div className="px-3 py-2.5 flex flex-col gap-[3px]">
				<div className="text-[15px] font-bold text-ink leading-tight">
					{price}
				</div>
				<div className="text-[11px] text-inkMuted truncate">
					{property.street}, {property.city}
				</div>
				<div className="text-[11px] text-gray-400">
					{property.bed}&nbsp;bd&nbsp;&middot;&nbsp;{property.bath}&nbsp;ba
					{property.sqft ? ` · ${property.sqft.toLocaleString()} sqft` : ""}
				</div>
			</div>
		</div>
	);
};

const PropertyPreviewList = ({ properties, onSelect }) => (
	<div className="w-[260px] font-sans overflow-hidden">
		<div className="max-h-[480px] overflow-y-auto">
			{properties.map((p) => (
				<PreviewItem key={p.id} property={p} onSelect={onSelect} />
			))}
		</div>
	</div>
);

export default PropertyPreviewList;
