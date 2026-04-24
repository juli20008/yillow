import apiFetch from "../../../utils/apiFetch";
import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import PropertyCard from "./PropertyCard";

import noproperty from "../../../assets/no-property-nobg.svg";

const List = ({
	min,
	setMin,
	max,
	setMax,
	type,
	setType,
	bed,
	setBed,
	bath,
	setBath,
	propArr,
	setOver,
	url,
	showMapAreaButton = true,
	compactMode = false,
	isMapSyncing = false,
}) => {
	const history = useHistory();
	const searchParam = useParams().searchParam;
	const areaParam = useParams().areaParam;

	const [search, setSearch] = useState("");
	const [searchList, setSearchList] = useState([]);
	const [searchFiltered, setSearchFiltered] = useState([]);
	const [error, setError] = useState("");
	const [pageSize, setPageSize] = useState(100);
	const [currentPage, setCurrentPage] = useState(1);
	const [showFilters, setShowFilters] = useState(false);

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
			setError("Please enter address, city, or postal code to search");
		}
	};

	const searchByArea = (e) => {
		e.preventDefault();

		history.push(url);
	};

	useEffect(() => {
		apiFetch("/api/search/terms")
			.then((res) => res.json())
			.then((res) => setSearchList(res.terms))
			.catch((err) => console.log(err));
		if (searchParam) {
			const param = searchParam.split("-").join(" ");
			setSearch(param);
		}
	}, [searchParam]);

	useEffect(() => {
		const filtered = searchList.filter((term) =>
			term.toLowerCase().includes(search.toLowerCase())
		);
		setSearchFiltered(filtered);
	}, [search, searchList]);

	useEffect(() => {
		setCurrentPage(1);
	}, [propArr, pageSize]);

	const totalResults = propArr.length;
	const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
	const safePage = Math.min(currentPage, totalPages);
	const startIndex = (safePage - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const pagedProperties = propArr.slice(startIndex, endIndex);

	return (
		<div className="search-wrap bg-[#f3f3f1] text-[#1f1f1f]">
			{!compactMode && (
				<div className="search-bar-wrap sticky top-0 z-20 border-b border-[#e5e5e0] bg-[#f3f3f1] px-4 py-3">
					<form className="search-bar flex items-center gap-2" onSubmit={handleSubmit}>
						<label className="search-label-sm relative min-w-[220px] flex-1">
							<input
								type="text"
								className="search-input w-full rounded-md border border-[#d6d6d0] bg-white px-11 py-2.5 text-sm text-[#303030] transition focus:border-[#2a6f97]"
								placeholder="City, Neighbourhood, ..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								ref={searchDivRef}
							/>
							<i
								className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[#8c8c85]"
								onClick={handleSubmit}
							></i>
							{error && <div className="search-error pt-2 text-xs text-rose-500">{error}</div>}
							<div
								className="search-dd search-dd-sm absolute mt-1 max-h-56 w-full overflow-auto rounded-md border border-[#dbdbd6] bg-white shadow-lg"
								ref={searchDDRef}
							>
								{searchFiltered.map((term) => (
									<div
										className="div flex cursor-pointer items-center gap-2 border-b border-[#f1f1ed] px-3 py-2 text-sm text-[#333] transition hover:bg-[#f7f7f3]"
										key={term}
										onMouseDown={(e) => {
											setSearch(term);
											directSearch(term);
										}}
									>
										<i className="fa-solid fa-magnifying-glass"></i>
										<div className="term truncate">{term}</div>
									</div>
								))}
							</div>
						</label>
						<button
							className="rounded-md border border-[#d6d6d0] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#2d2d2d] transition hover:bg-[#f7f7f3]"
							type="button"
							onClick={() => setShowFilters(true)}
						>
							<i className="fa-solid fa-sliders mr-2"></i>Filter
						</button>
						<button
							className="rounded-md border border-[#222] bg-[#222] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#111]"
							type="button"
						>
							Save Search
						</button>
						{!areaParam && showMapAreaButton && url && (
							<button
								className="btn rounded-md border border-[#d6d6d0] bg-white px-3 py-2 text-xs text-[#40403b] transition hover:bg-[#f7f7f3]"
								type="button"
								onClick={searchByArea}
							>
								Search by Map Area
							</button>
						)}
					</form>
					<div className="search-bar mt-3 flex items-center justify-between border-t border-[#e5e5e0] pt-3">
						<div className="results text-sm text-[#5c5c56]">
							{isMapSyncing ? "Updating..." : `${totalResults} Results`}
						</div>
						<div className="flex items-center gap-2">
							<button className="rounded-full border border-[#d9d9d3] bg-[#f6f6f3] px-3 py-1 text-xs text-[#555]">
								<i className="fa-regular fa-map mr-1"></i>Map
							</button>
							<button className="rounded-full border border-[#d9d9d3] bg-white px-3 py-1 text-xs text-[#555]">
								<i className="fa-solid fa-list mr-1"></i>List
							</button>
						</div>
					</div>
				</div>
			)}
			{propArr.length ? (
				<>
					<div className="search-list grid flex-1 grid-cols-1 gap-3 overflow-y-auto px-4 py-3 lg:grid-cols-2">
						{pagedProperties?.map((property, index) => (
							<PropertyCard
								key={`${property.id}-${index}`}
								property={property}
								setOver={setOver}
							/>
						))}
					</div>
					<div className="search-pagination border-t border-[#e5e5e0] bg-[#f8f8f5] px-4 py-3">
						<div className="search-pagination-info text-sm text-[#6d6d66]">
							Showing {startIndex + 1}-
							{Math.min(endIndex, totalResults)} of {totalResults}
						</div>
						<div className="search-pagination-controls mt-2 flex flex-wrap items-center gap-2">
							<label className="search-page-size flex items-center gap-2 text-xs text-[#6d6d66]">
								<span>Per page</span>
								<select
									className="rounded-md border border-[#d8d8d2] bg-white px-2 py-1 text-[#444]"
									value={pageSize}
									onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
								>
									<option value="20">20</option>
									<option value="50">50</option>
									<option value="100">100</option>
								</select>
							</label>
							<button
								className="search-page-btn rounded-md border border-[#d8d8d2] bg-white px-3 py-1 text-sm text-[#444] transition hover:bg-[#f1f1ec] disabled:cursor-not-allowed disabled:opacity-40"
								type="button"
								disabled={safePage === 1}
								onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
							>
								Prev
							</button>
							<div className="search-page-count text-sm font-medium text-[#56564f]">
								Page {safePage} of {totalPages}
							</div>
							<button
								className="search-page-btn rounded-md border border-[#d8d8d2] bg-white px-3 py-1 text-sm text-[#444] transition hover:bg-[#f1f1ec] disabled:cursor-not-allowed disabled:opacity-40"
								type="button"
								disabled={safePage === totalPages}
								onClick={() =>
									setCurrentPage((page) => Math.min(totalPages, page + 1))
								}
							>
								Next
							</button>
						</div>
					</div>
				</>
			) : (
				<div className="search-no-results flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
					<img className="img" src={noproperty} alt="No property" />
					<div className="title text-2xl font-semibold text-[#2d2d2b]">Sorry no results are found</div>
					<div className="desc text-sm text-[#6d6d66]">
						Please search different city or filter with different criteria
					</div>
				</div>
			)}
			{showFilters && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
					<div className="w-full max-w-3xl rounded-lg bg-white shadow-2xl">
						<div className="flex items-center justify-between border-b border-[#ecece8] px-6 py-4">
							<h3 className="text-2xl font-semibold text-[#2c2c2a]">Filters</h3>
							<button
								type="button"
								className="text-[#777] hover:text-[#222]"
								onClick={() => setShowFilters(false)}
							>
								<i className="fa-solid fa-xmark"></i>
							</button>
						</div>
						<div className="grid gap-5 px-6 py-5 md:grid-cols-2">
							<label className="text-sm text-[#52524d]">
								Price Min
								<select
									className="mt-1 w-full rounded-md border border-[#d9d9d2] bg-white px-3 py-2 text-[#333]"
									value={min}
									onChange={(e) => setMin(parseInt(e.target.value, 10))}
								>
									<option value="0">No Min</option>
									<option value="100000">$100,000+</option>
									<option value="200000">$200,000+</option>
									<option value="300000">$300,000+</option>
									<option value="500000">$500,000+</option>
									<option value="800000">$800,000+</option>
								</select>
							</label>
							<label className="text-sm text-[#52524d]">
								Price Max
								<select
									className="mt-1 w-full rounded-md border border-[#d9d9d2] bg-white px-3 py-2 text-[#333]"
									value={max}
									onChange={(e) => setMax(parseInt(e.target.value, 10))}
								>
									<option value="99999999999">No Max</option>
									<option value="500000">$500,000</option>
									<option value="700000">$700,000</option>
									<option value="1000000">$1,000,000</option>
									<option value="1500000">$1,500,000</option>
									<option value="2000000">$2,000,000</option>
								</select>
							</label>
							<label className="text-sm text-[#52524d]">
								Property Type
								<select
									className="mt-1 w-full rounded-md border border-[#d9d9d2] bg-white px-3 py-2 text-[#333]"
									value={type}
									onChange={(e) => setType(e.target.value)}
								>
									<option value="">All</option>
									<option value="Condominium">Condo</option>
									<option value="Single Family">House</option>
									<option value="Townhouse">Townhouse</option>
									<option value="Manufactured Home">Mobile</option>
									<option value="Cabin">Other</option>
								</select>
							</label>
							<label className="text-sm text-[#52524d]">
								Bedrooms
								<select
									className="mt-1 w-full rounded-md border border-[#d9d9d2] bg-white px-3 py-2 text-[#333]"
									value={bed}
									onChange={(e) => setBed(parseInt(e.target.value, 10))}
								>
									<option value="0">Any</option>
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4+</option>
								</select>
							</label>
							<label className="text-sm text-[#52524d] md:col-span-2">
								Bathrooms
								<select
									className="mt-1 w-full rounded-md border border-[#d9d9d2] bg-white px-3 py-2 text-[#333]"
									value={bath}
									onChange={(e) => setBath(parseInt(e.target.value, 10))}
								>
									<option value="0">Any</option>
									<option value="1">1+</option>
									<option value="2">2+</option>
									<option value="3">3+</option>
									<option value="4">4+</option>
								</select>
							</label>
						</div>
						<div className="flex items-center justify-between border-t border-[#ecece8] px-6 py-4">
							<button
								type="button"
								className="text-sm font-semibold uppercase tracking-wide text-[#666]"
								onClick={() => {
									setMin(0);
									setMax(99999999999);
									setType("");
									setBed(0);
									setBath(0);
								}}
							>
								Clear Filters
							</button>
							<button
								type="button"
								className="rounded-md bg-[#222] px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white hover:bg-black"
								onClick={() => setShowFilters(false)}
							>
								Done
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default List;
