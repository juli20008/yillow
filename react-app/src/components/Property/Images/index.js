import { useState, useEffect } from "react";
import { Modal } from "../../../context/Modal";
import LastImage from "./LastImg";
import {
	resolvePropertyImage,
	resolveUrl,
	FALLBACK_IMAGE,
} from "../../../utils/imageResolver";

const GalleryTile = ({ url }) => {
	const [src, setSrc] = useState(url);
	const [failed, setFailed] = useState(false);
	useEffect(() => { setSrc(url); setFailed(false); }, [url]);
	const [showModal, setShowModal] = useState(false);

	if (failed) return null;

	return (
		<>
			<img
				className="property-img"
				src={src}
				alt="Gallery"
				onClick={() => setShowModal(true)}
				onError={() => setFailed(true)}
			/>
			{showModal && (
				<Modal onClose={() => setShowModal(false)}>
					<img
						className="property-img-lg"
						src={src}
						alt="Gallery"
						onClick={() => setShowModal(false)}
						onError={() => setShowModal(false)}
					/>
				</Modal>
			)}
		</>
	);
};

const Images = ({ property, openTour }) => {
	const [heroSrc, setHeroSrc] = useState(() => resolvePropertyImage(property));
	useEffect(() => {
		setHeroSrc(resolvePropertyImage(property));
	}, [property]);

	const [showHeroModal, setShowHeroModal] = useState(false);

	// Build gallery directly from property.image_urls — no async Redux dependency.
	// Each relative path (e.g. "sample/IMG-xxx.jpg") is resolved to a CDN URL.
	const galleryUrls = (property?.image_urls || [])
		.map(resolveUrl)
		.filter(Boolean);

	const oddGallery = galleryUrls.length % 2 !== 0;

	return (
		<div className="property-imgs-ctrl">
			<img
				className="property-front"
				src={heroSrc}
				alt="Front"
				onClick={() => setShowHeroModal(true)}
				onError={() => setHeroSrc(FALLBACK_IMAGE)}
			/>
			{showHeroModal && (
				<Modal onClose={() => setShowHeroModal(false)}>
					<img
						className="property-img-lg"
						src={heroSrc}
						alt="Front"
						onClick={() => setShowHeroModal(false)}
						onError={() => setHeroSrc(FALLBACK_IMAGE)}
					/>
				</Modal>
			)}
			<div className="property-imgs-wrap">
				{galleryUrls.map((url, idx) => (
					<GalleryTile key={url + idx} url={url} />
				))}
				{oddGallery && <LastImage openTour={openTour} />}
			</div>
			{!oddGallery && <LastImage openTour={openTour} />}
		</div>
	);
};

export default Images;
