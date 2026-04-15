const PropertyTop = ({ property }) => {
	const image = property?.image_urls?.[0] || property?.front_img;

	if (property && image) {
		return (
			<div
				className="card-top"
				style={{ backgroundImage: `url("${image}")` }}
			>
				<div className="card-events">Listed on {property?.listing_date}</div>
				{/* <div className="card-top-heart">Heart</div> */}
			</div>
		);
	} else
		return (
			<div className="card-top">
				<div className="card-events">Listed on {property?.listing_date}</div>
				{/* <div className="card-top-heart">Heart</div> */}
			</div>
		);
};

export default PropertyTop;
