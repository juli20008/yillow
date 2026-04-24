// Actions
const GET_PROPERTIES = "properties/SEARCH_PROPERTIES";
const GET_PROPERTY = "properties/GET_PROPERTY";

// Action Creators
export const getProperties = (properties) => ({
	type: GET_PROPERTIES,
	properties,
});

const getProperty = (property) => ({
	type: GET_PROPERTY,
	property,
});

// Thunks
export const searchProperties = (term) => async (dispatch) => {
	try {
		const response = await fetch(`/api/search/${term}`);
		if (response.ok) {
			const data = await response.json();
			const arr = Array.isArray(data.properties) ? data.properties : [];
			console.log("[searchProperties] received", arr.length, "listings");
			dispatch(getProperties(arr));
			return data;
		}
		const errData = await response.json().catch(() => ({}));
		return errData.errors ? errData : { errors: [`HTTP ${response.status}`] };
	} catch (err) {
		console.error("[searchProperties] fetch error:", err.message);
		return { errors: [err.message] };
	}
};

export const areaProperties = (payload) => async (dispatch) => {
	try {
		const response = await fetch("/api/search/areas", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		if (response.ok) {
			const data = await response.json();
			const arr = Array.isArray(data.properties) ? data.properties : [];
			console.log("[areaProperties] received", arr.length, "listings");
			dispatch(getProperties(arr));
			return data;
		}
		const errData = await response.json().catch(() => ({}));
		console.error("[areaProperties] HTTP", response.status, errData);
		return errData.errors ? errData : { errors: [`HTTP ${response.status}`] };
	} catch (err) {
		console.error("[areaProperties] fetch error:", err.message);
		return { errors: [err.message] };
	}
};

export const getThisProperty = (property_id) => async (dispatch) => {
	try {
		const response = await fetch(`/api/properties/${property_id}`);
		if (response.ok) {
			const data = await response.json();
			dispatch(getProperty(data.property));
			return data;
		}
		const errData = await response.json().catch(() => ({}));
		return errData.errors ? errData : { errors: [`HTTP ${response.status}`] };
	} catch (err) {
		return { errors: [err.message] };
	}
};

// Reducer
// State shape: flat object keyed by property id — { 'mls_123': {...}, 42: {...}, ... }
const initialState = {};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case GET_PROPERTIES: {
			const items = Array.isArray(action.properties) ? action.properties : [];
			console.log("[GET_PROPERTIES] reducer received", items.length, "items");
			const next = {};
			items.forEach((p) => { if (p?.id != null) next[p.id] = p; });
			return next;
		}
		case GET_PROPERTY: {
			if (!action.property?.id) return state;
			return { ...state, [action.property.id]: action.property };
		}
		default:
			return state;
	}
}
