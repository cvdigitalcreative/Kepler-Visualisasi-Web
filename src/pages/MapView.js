import React from 'react';
import { Link } from 'react-router-dom';
import '../css/MapView.css';

function MapView() {
	let url =
		'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127504.4454422473!2d104.6929245596675!3d-2.9547949076897364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b75e8fc27a3e3%3A0x3039d80b220d0c0!2sPalembang%2C%20Palembang%20City%2C%20South%20Sumatra!5e0!3m2!1sen!2sid!4v1602315383162!5m2!1sen!2sid';
	return (
		<div className="mapview">
			<div className="search-card">
				<span className="search-title">Visualisasi Data</span>
				<Link to="/home">
					<button className="button-search">Cari Data</button>
				</Link>
			</div>
			<div>
				<iframe
					className="map-responsive"
					title="palembang city"
					src={url}
					// width="800"
					height="600"
					frameborder="0"
					allowfullscreen="true"
					aria-hidden="false"
					tabindex="0"
				/>
			</div>
		</div>
	);
}

export default MapView;
