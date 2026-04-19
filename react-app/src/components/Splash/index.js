import { useState, useEffect, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";

import MyMap from "../Search/Map";
import Footer from "./Footer";

const Splash = () => {
	const history = useHistory();
	const defaultGtaArea =
		"/area/neLat=44.20&neLng=-78.90&swLat=43.30&swLng=-80.80&zoom=10";
	const gtaCenter = { lat: 43.6532, lng: -79.3832 };

	const [search, setSearch] = useState("");
	const [searchList, setSearchList] = useState([]);
	const [searchFiltered, setSearchFiltered] = useState([]);
	const [error, setError] = useState();
	const [placeholder, setPlaceholder] = useState(
		"Enter an address, city, or Postal Code"
	);
	const [newlyListed, setNewlyListed] = useState([]);
	const [mapCenter] = useState(gtaCenter);

	const searchDivRef = useRef();
	const searchDDRef = useRef();

	const directSearch = (term) => {
		setError("");
		const searchTerm = term.split(" ").join("-");
		history.push(`/search/${searchTerm}`);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (search.length > 0) {
			setError("");
			const searchTerm = search.split(" ").join("-");
			history.push(`/search/${searchTerm}`);
		} else {
			setError("");
			history.push(defaultGtaArea);
		}
	};

	useEffect(() => {
		fetch("/api/search/terms")
			.then((res) => res.json())
			.then((res) => setSearchList(res.terms))
			.catch((err) => console.log(err));
	}, []);

	useEffect(() => {
		fetch("/api/properties/feed")
			.then((res) => res.json())
			.then((res) => setNewlyListed(res.properties || []))
			.catch((err) => console.log(err));
	}, []);

	useEffect(() => {
		const filtered = searchList.filter((term) =>
			term.toLowerCase().includes(search.toLowerCase())
		);
		setSearchFiltered(filtered);
	}, [search, searchList]);

	const googleMapURL = useMemo(() => {
		const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
		return `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`;
	}, []);

	return (
		<>
			<main className="splash-ctrl">
				<form className="splash-search-wrap" onSubmit={handleSubmit}>
					<div className="splash-search-title">
						Find the right home faster and request a showing today.
					</div>
					<label className="search-label">
						<input
							type="text"
							className="search-input"
							placeholder={placeholder}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							onFocus={() =>
								setPlaceholder('Don\'t know where to start? Try "Toronto"')
							}
							onBlur={() =>
								setPlaceholder("Enter an address, city, or Postal Code")
							}
							ref={searchDivRef}
						/>

						<i
							className="fa-solid fa-magnifying-glass"
							onClick={handleSubmit}
						></i>
						{error && <div className="splash-error">{error}</div>}
						<div className="search-dd" ref={searchDDRef}>
							{searchFiltered.map((term) => (
								<div
									className="div"
									key={term}
									onMouseDown={(e) => {
										setSearch(term);
										directSearch(term);
									}}
								>
									<i className="fa-solid fa-magnifying-glass"></i>
									<div className="term">{term}</div>
								</div>
							))}
						</div>
					</label>
					<button
						type="button"
						className="splash-map-search-btn"
						onClick={() => history.push(defaultGtaArea)}
					>
						Search by Map
					</button>
				</form>
				<section className="splash-map-section">
					<div className="splash-map-shell">
						<MyMap
							isMarkerShown
							googleMapURL={googleMapURL}
							loadingElement={<div style={{ height: `100%` }} />}
							containerElement={<div className="map-ctnr splash-map-ctnr" />}
							mapElement={<div style={{ height: `100%` }} />}
							markers={newlyListed}
							center={mapCenter}
							zoom={10}
							over={{ id: 0 }}
							enableAreaSearch={false}
						/>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
};

export default Splash;
