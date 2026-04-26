const LogoBrand = () => (
	<div className="flex items-baseline gap-3 whitespace-nowrap">
		<span
			style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}
			className="text-[22px] leading-none tracking-tight text-[#0f172a]"
		>
			Showings Today
		</span>
		<span className="text-[#cbd5e1] font-light text-base select-none">|</span>
		<span
			style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
			className="text-[13px] leading-none tracking-wide text-[#475569]"
		>
			See it on the map. Book it in a snap.
		</span>
	</div>
);

export default LogoBrand;
