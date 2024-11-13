import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Toasty() {
	return (
		<>
			<ToastContainer
				position="bottom-right"
				autoClose={3000}
				hideProgressBar={true}
			/>
		</>
	);
}

export default Toasty;
