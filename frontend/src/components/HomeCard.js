import React, { useState } from 'react';
import EditUserModal from './EditUserModal';

const HomeCard = ({ home }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleEditUserClick = () => {
		setIsModalOpen(true);
	};

	return (
		<div>
			<h3>{home.street_address}</h3>
			<h4>List price :{home.list_price}</h4>
			<h4>state :{home.state}</h4>
			<h4>Zip :{home.zip}</h4>
			<h4>sqft :{home.sqft}</h4>
			<h4>beds:{home.beds}</h4>
			<h4>baths:{home.baths}</h4>
			<button onClick={handleEditUserClick}>Edit Users</button>
			{isModalOpen && (
				<EditUserModal
					homeId={home.home_id}
					closeModal={() => setIsModalOpen(false)}
				/>
			)}
		</div>
	);
};

export default HomeCard;
