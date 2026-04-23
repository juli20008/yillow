const PropertyTop = ({ property }) => {
	const image = property?.image_urls?.[0] || property?.front_img;

	if (property && image) {
		return (
			<div
				className="card-top relative h-44 bg-cover bg-center"
				style={{ backgroundImage: `url("${image}")` }}
			>
				<div className="card-events relative m-3 inline-flex w-fit rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2d2d2d]">
					Listed on {property?.listing_date}
				</div>
				{/* <div className="card-top-heart">Heart</div> */}
			</div>
		);
	} else
		return (
			<div className="card-top relative h-44 bg-[#dadad5]">
				<div className="card-events relative m-3 inline-flex w-fit rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2d2d2d]">
					Listed on {property?.listing_date}
				</div>
				{/* <div className="card-top-heart">Heart</div> */}
			</div>
		);
};

export default PropertyTop;
