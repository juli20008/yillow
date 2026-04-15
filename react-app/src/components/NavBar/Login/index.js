import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { login } from "../../../store/session";
import { useNotification } from "../../../context/Notification";

import LoginForm from "../../auth/LoginForm";
import SignUpForm from "../../auth/SignUpForm";

const Login = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { setToggleNotification, setNotificationMsg } = useNotification();
	const [loginForm, setLoginForm] = useState(true);

	const loginRef = useRef();
	const signupRef = useRef();

	const onDemoLogin = async (e) => {
		e.preventDefault();
		const email = "demo@aa.io";
		const password = "password";
		const data = await dispatch(login(email, password));
		if (!data) {
			history.push("/");
		} else {
			setToggleNotification("");
			setNotificationMsg(data[0] || "Demo login failed");
			setTimeout(() => {
				setToggleNotification("notification-move");
				setNotificationMsg("");
			}, 2000);
		}
	};

	const onAgentDemoLogin = async (e) => {
		e.preventDefault();
		const email = "agent1@user.com";
		const password = "password";
		const data = await dispatch(login(email, password));
		if (!data) {
			history.push("/appointments");
		} else {
			setToggleNotification("");
			setNotificationMsg(data[0] || "Agent demo login failed");
			setTimeout(() => {
				setToggleNotification("notification-move");
				setNotificationMsg("");
			}, 2000);
		}
	};

	useEffect(() => {
		if (loginForm) {
			loginRef.current.classList.add("ref-active");
			signupRef.current.classList.remove("ref-active");
		} else {
			loginRef.current.classList.remove("ref-active");
			signupRef.current.classList.add("ref-active");
		}
	}, [loginForm]);

	return (
		<div className="login-sign-modal">
			<div className="login-sign-title">Welcome to Zillow</div>
			<div className="login-sign-toggle-wrap">
				<div
					className="login-btn"
					ref={loginRef}
					onClick={() => setLoginForm(true)}
				>
					Sign in
				</div>
				<div
					className="login-btn"
					ref={signupRef}
					onClick={() => setLoginForm(false)}
				>
					New Account
				</div>
			</div>
			{loginForm ? <LoginForm /> : <SignUpForm />}
			<div className="login-sign-connect">Or connect with:</div>
			<button type="button" className="btn btn-bl" onClick={onDemoLogin}>
				Continue with User Demo Login
			</button>
			<button type="button" className="btn" onClick={onAgentDemoLogin}>
				Continue with Agent Demo Login
			</button>
		</div>
	);
};

export default Login;
