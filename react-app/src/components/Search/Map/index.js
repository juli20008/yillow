import React from "react";
import { useRef, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Marker,
	InfoWindow,
} from "react-google-maps";

import { Modal } from "../../../context/Modal";
import Property from "../../Property";

const MyMap = withScriptjs(
	withGoogleMap((props) => {
		const history = useHistory();
		const { areaParam } = useParams();
		const mapRef = useRef(null);
		const [isOpen, setIsOpen] = useState({
			openInfoWindowMarkerId: 0,
		});
		const [isOver, setIsOver] = useState({
			id: 0,
		});
		const [showModal, setShowModal] = useState(false);

		const iconPin = {
			path: "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z",
			fillColor: "#0f172a",
			strokeColor: "#ffffff",
			strokeWeight: 2.5,
			fillOpacity: 0.98,
			scale: 0.032,
		};

		const iconOver = {
			path: "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z",
			fillColor: "#1e293b",
			strokeColor: "#ffffff",
			strokeWeight: 2.5,
			fillOpacity: 1,
			scale: 0.036,
		};

		const handleToggleOpen = (markerId) => {
			setIsOpen({
				openInfoWindowMarkerId: markerId,
			});
		};

		const handleShowModal = (markerId) => {
			setShowModal({ show: markerId });
		};

		const onClose = () => {
			setShowModal({ show: 0 });
		};

		const priceLabel = (price) => {
			let newPrice;
			if (price > 1000000) {
				newPrice = (price / 1000000).toFixed(2);
				return `${newPrice}M`;
			} else {
				newPrice = (price / 1000).toFixed(0);
				return `${newPrice}K`;
			}
		};

		const getBoundsPayload = () => {
			if (!mapRef.current || !mapRef.current.getBounds()) {
				return null;
			}
			const ne = mapRef.current.getBounds().getNorthEast();
			const sw = mapRef.current.getBounds().getSouthWest();
			const zoom = mapRef.current.getZoom();
			return {
				neLat: ne.lat(),
				neLng: ne.lng(),
				swLat: sw.lat(),
				swLng: sw.lng(),
				zoom,
			};
		};

		const setArea = () => {
			const bounds = getBoundsPayload();
			if (!bounds) return;
			const url = `/area/neLat=${bounds.neLat}&neLng=${bounds.neLng}&swLat=${bounds.swLat}&swLng=${bounds.swLng}&zoom=${bounds.zoom}`;

			if (!areaParam && props.setUrl) {
				props.setUrl(url);
			}
		};

		const searchArea = () => {
			const bounds = getBoundsPayload();
			if (!bounds) return;
			const url = `/area/neLat=${bounds.neLat}&neLng=${bounds.neLng}&swLat=${bounds.swLat}&swLng=${bounds.swLng}&zoom=${bounds.zoom}`;

			if (areaParam) {
				history.push(url);
			}
		};

		// Fit bounds function
		const areaFitBounds = (neLat, neLng, swLat, swLng) => {
			const bounds = new window.google.maps.LatLngBounds();

			bounds.extend(new window.google.maps.LatLng(neLat, neLng));
			bounds.extend(new window.google.maps.LatLng(swLat, swLng));

			mapRef.current.fitBounds(bounds);
		};

		// Fit bounds function
		const fitBounds = () => {
			const bounds = new window.google.maps.LatLngBounds();
			props.markers.map((marker) => {
				bounds.extend(new window.google.maps.LatLng(marker.lat, marker.lng));
				return marker.id;
			});
			mapRef.current.fitBounds(bounds);
		};

		// Fit bounds on mount, and when the markers change
		useEffect(() => {
			if (!areaParam && props.markers && props.fitBounds !== false) {
				fitBounds();
			}
		}, [props.markers, areaParam, props.fitBounds]);

		// Fit bounds on mount, and when the markers change
		useEffect(() => {
			if (areaParam) {
				const [neLat, neLng, swLat, swLng] = areaParam
					.split("&")
					.map((each) => each.split("=")[1]);
				areaFitBounds(neLat, neLng, swLat, swLng);
			}
		}, []);

		useEffect(() => {
			setIsOver({ id: props.over.id });
		}, [props.over]);

		useEffect(() => {
			if (mapRef.current && props.center && props.syncCenter !== false) {
				mapRef.current.panTo(props.center);
			}
		}, [props.center, props.syncCenter]);

		const enableAreaSearch = props.enableAreaSearch !== false;

		return (
			<>
				<GoogleMap
					ref={mapRef}
					defaultZoom={props.zoom || 4}
					defaultCenter={{
						lat: props.center.lat,
						lng: props.center.lng,
					}}
					defaultOptions={{
						fullscreenControl: false,
						streetViewControl: false,
					}}
					onIdle={() => {
						if (enableAreaSearch) {
							setArea();
						}
						if (props.onBoundsChange) {
							const bounds = getBoundsPayload();
							props.onBoundsChange(bounds);
						}
					}}
					onDragEnd={() => {
						if (enableAreaSearch) {
							searchArea();
						}
					}}
					options={{
						disableDefaultUI: true,
						zoomControl: true,
						fullscreenControl: false,
						streetViewControl: false,
						mapTypeControl: false,
						gestureHandling: "greedy",
						styles: [
							{ elementType: "geometry", stylers: [{ color: "#efefeb" }] },
							{ elementType: "labels.text.fill", stylers: [{ color: "#61615b" }] },
							{ elementType: "labels.text.stroke", stylers: [{ color: "#efefeb" }] },
							{
								featureType: "poi",
								elementType: "labels",
								stylers: [{ visibility: "off" }],
							},
							{
								featureType: "transit",
								elementType: "labels",
								stylers: [{ visibility: "off" }],
							},
							{
								featureType: "road",
								elementType: "geometry",
								stylers: [{ color: "#ffffff" }],
							},
							{
								featureType: "road.highway",
								elementType: "geometry",
								stylers: [{ color: "#efefef" }],
							},
							{
								featureType: "water",
								elementType: "geometry",
								stylers: [{ color: "#b7d4e6" }],
							},
						],
					}}
				>
					<div></div>
					{props.markers.map((marker) => {
						const label = priceLabel(marker?.price);
						let icon;
						if (props.over.id === marker.id) {
							icon = iconOver;
						} else {
							icon = iconPin;
						}
						return (
							<Marker
								position={{ lat: marker?.lat, lng: marker?.lng }}
								key={marker?.id}
								icon={icon}
								onClick={() => handleShowModal(marker?.id)}
								onMouseOver={() => handleToggleOpen(marker?.id)}
								onMouseOut={() => handleToggleOpen(0)}
								zIndex={props.over.id === marker.id ? 9999 : 0}
							>
								{isOpen.openInfoWindowMarkerId === marker.id && (
									<InfoWindow>
										<div className="gm-div">
											<img
												className="gm-img"
												src={marker.image_urls?.[0] || marker.front_img}
												alt="House"
											/>
											<div className="gm-desc">
												<div className="price">${label}</div>
												<div>
													{marker.bed} bd, {marker.bath} ba
												</div>
												<div>{marker.sqft} sqft</div>
											</div>
										</div>
									</InfoWindow>
								)}
								{isOver.id === marker.id && (
									<InfoWindow>
										<div className="gm-div">
											<img
												className="gm-img"
												src={marker.image_urls?.[0] || marker.front_img}
												alt="House"
											/>
											<div className="gm-desc">
												<div className="price">${label}</div>
												<div>
													{marker.bed} bd, {marker.bath} ba
												</div>
												<div>{marker.sqft} sqft</div>
											</div>
										</div>
									</InfoWindow>
								)}
								{showModal.show === marker.id && (
									<Modal onClose={onClose}>
										<Property property={marker} onClose={onClose} />
									</Modal>
								)}
							</Marker>
						);
					})}
				</GoogleMap>
			</>
		);
	})
);
export default MyMap;
