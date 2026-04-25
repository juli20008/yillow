import { useState, useEffect } from "react";
import { Modal } from "../../../context/Modal";
import {
	resolvePropertyImage,
	resolveUrl,
	FALLBACK_IMAGE,
} from "../../../utils/imageResolver";

const Lightbox = ({ src, onClose }) => (
	<Modal onClose={onClose}>
		<img
			className="property-img-lg"
			src={src}
			alt="Gallery"
			onClick={onClose}
			onError={(e) => { e.currentTarget.onerror = null; }}
		/>
	</Modal>
);

const Images = ({ property }) => {
	const heroResolved = resolvePropertyImage(property);
	const [heroSrc, setHeroSrc] = useState(heroResolved);
	useEffect(() => { setHeroSrc(heroResolved); }, [heroResolved]);

	const [lightbox, setLightbox] = useState(null);

	const thumbUrls = (property?.image_urls || [])
		.map(resolveUrl)
		.filter(Boolean);

	return (
		<div className="w-full">
			{/* Hero — full width, fixed height */}
			<div className="relative w-full h-[460px] overflow-hidden bg-[#dadad5] cursor-pointer"
				onClick={() => setLightbox(heroSrc)}>
				<img
					className="w-full h-full object-cover"
					src={heroSrc}
					alt="Property"
					onError={() => setHeroSrc(FALLBACK_IMAGE)}
				/>
				{thumbUrls.length > 0 && (
					<span className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
						1 / {thumbUrls.length + 1} photos
					</span>
				)}
			</div>

			{/* Thumbnail strip */}
			{thumbUrls.length > 0 && (
				<div className="flex gap-2 px-1 pt-2 overflow-x-auto scrollbar-hide">
					{thumbUrls.slice(0, 10).map((url, idx) => (
						<ThumbTile
							key={url + idx}
							url={url}
							onClick={() => setLightbox(url)}
						/>
					))}
				</div>
			)}

			{lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
		</div>
	);
};

const ThumbTile = ({ url, onClick }) => {
	const [src, setSrc] = useState(url);
	const [failed, setFailed] = useState(false);
	useEffect(() => { setSrc(url); setFailed(false); }, [url]);
	if (failed) return null;
	return (
		<img
			className="flex-shrink-0 w-24 h-16 object-cover rounded cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
			src={src}
			alt=""
			onClick={onClick}
			onError={() => setFailed(true)}
		/>
	);
};

export default Images;
