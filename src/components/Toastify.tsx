import React from "react";
import { toast, ToastContainer } from "react-toastify";

export const Toast = (msg: string, theme: "light" | "dark" = "light") => {
	toast(msg, {
		position: "bottom-center",
		autoClose: 2000,
		hideProgressBar: true,
		closeOnClick: false,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: theme,
	});
};

function Toastify() {
	return (
		<ToastContainer
			position="bottom-center"
			autoClose={2000}
			hideProgressBar
			newestOnTop={false}
			closeOnClick={false}
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover
			theme="dark"
		/>
	);
}

export default Toastify;
