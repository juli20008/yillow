import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import List from "./List";
import MyMap from "./Map";

import * as propertyActions from "../../store/property";

const Search = () => {
	const dispatch = useDispatch();
	const searchParam = useParams().searchParam;
	const properties = useSelector((state) => state.properties);

	const [min, setMin] = useState(0);
	const [max, setMax] = useState(99999999999);
	const [type, setType] = useState("");
	const [bed, setBed] = useState(0);
	const [bath, setBath] = useState(0);
	const [center, setCenter] = useState({ lat: 43.6629, lng: -79.3957 });
	const [propArr, setPropArr] = useState([]);
	const [over, setOver] = useState({ id: 0 });
	const [isMapSyncing, setIsMapSyncing] = useState(false);
	const mapSyncTimer = useRef(null);

	useEffect(() => {
		dispatch(propertyActions.searchProperties(searchParam));
	}, [dispatch, searchParam]);

	useEffect(() => {
		document.documentElement.classList.add("search-page-lock");
		document.body.classList.add("search-page-lock");

		return () => {
			document.documentElement.classList.remove("search-page-lock");
			document.body.classList.remove("search-page-lock");
		};
	}, []);

	useEffect(() => {
		let arr = Object.values(properties)
			.filter((prop) => prop?.price > min)
			.filter((prop) => prop?.price < max)
			.filter((prop) => prop?.type.includes(type))
			.filter((prop) => {
				if (bed === 0) {
					return prop;
				} else if (bed === 4) {
					return prop?.bed >= 4;
				} else {
					return prop?.bed === bed;
				}
			})
			.filter((prop) => {
				if (bath === 0) {
					return prop;
				} else if (bath === 4) {
					return prop?.bath >= 4;
				} else {
					return prop?.bath === bath || prop?.bath - 0.5 === bath;
				}
			});
		setPropArr(arr);
	}, [min, max, type, bed, bath, properties]);

	useEffect(() => {
		return () => {
			if (mapSyncTimer.current) {
				clearTimeout(mapSyncTimer.current);
			}
		};
	}, []);

	const handleMapBoundsChange = (bounds) => {
		if (!bounds) return;
		if (mapSyncTimer.current) {
			clearTimeout(mapSyncTimer.current);
		}

		setIsMapSyncing(true);
		mapSyncTimer.current = setTimeout(async () => {
			await dispatch(propertyActions.areaProperties(bounds));
			setIsMapSyncing(false);
		}, 220);
	};

	const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
	const googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`;

	return (
		<main className="search-pg-ctrl bg-[#f3f3f1]">
			<MyMap
				isMarkerShown
				googleMapURL={googleMapURL}
				loadingElement={<div style={{ height: `100%` }} />}
				containerElement={<div className="map-ctnr overflow-hidden border-r border-[#dcdcd7]" />}
				mapElement={<div style={{ height: `100%` }} />}
				markers={propArr}
				center={center}
				over={over}
				onBoundsChange={handleMapBoundsChange}
				enableAreaSearch={false}
				syncCenter={false}
			/>
			<List
				min={min}
				setMin={setMin}
				max={max}
				setMax={setMax}
				type={type}
				setType={setType}
				bed={bed}
				setBed={setBed}
				bath={bath}
				setBath={setBath}
				propArr={propArr}
				setOver={setOver}
				compactMode={false}
				showMapAreaButton={false}
				isMapSyncing={isMapSyncing}
			/>
		</main>
	);
};
export default Search;
