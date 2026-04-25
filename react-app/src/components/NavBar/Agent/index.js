import React from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "../../auth/LogoutButton";

const AgentBar = () => {
	return (
		<nav className="nav nav-agent">
			<div className="nav-lf">
				<NavLink to="/agents">Agent Finder</NavLink>
				<NavLink to="/reviews" exact={true}>
					My Reviews
				</NavLink>
			</div>
			<NavLink to="/" exact={true} className="flex flex-col items-center gap-0.5">
				<img src="/Yollow.svg" alt="Yollow" />
				<span className="text-[8px] font-light tracking-widest uppercase text-[#64748b] whitespace-nowrap">
					Map. Click. Tour.
				</span>
			</NavLink>
			<div className="nav-rt">
				<NavLink to="/chats" exact={true}>
					<i className="fa-regular fa-comment"></i> Chats
				</NavLink>
				<NavLink to="/appointments" exact={true}>
					Appointments
				</NavLink>
				<NavLink to="/profile" exact={true}>
					My Profile
				</NavLink>
				<LogoutButton />
			</div>
		</nav>
	);
};

export default AgentBar;
