import React from "react";

function RandomizeButton({ OnClick = () => {} }: { OnClick?: () => void }) {
	return (
		<div className="fixed z-50 bottom-4 right-4 flex justify-end">
			<button
				onClick={OnClick}
				className="bg-gray-800 cursor-pointer text-white px-6 py-3 rounded hover:bg-gray-700"
				id="Randomize">
				🎲 Randomize
			</button>
		</div>
	);
}

export default RandomizeButton;
