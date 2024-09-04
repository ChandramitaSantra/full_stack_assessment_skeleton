import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	fetchUsers,
	fetchUsersByHome,
	updateUsersForHome
} from '../store/userHomeSlice';

const EditUserModal = ({ homeId, closeModal }) => {
	const dispatch = useDispatch();
	const { users, usersByHome } = useSelector((state) => state.userHome);
	const [selectedUsers, setSelectedUsers] = useState([]);

	useEffect(() => {
		dispatch(fetchUsers());
		dispatch(fetchUsersByHome(homeId));
	}, [dispatch, homeId]);

	useEffect(() => {
		if (usersByHome[homeId]) {
			console.log('usersByHome:', usersByHome[homeId]);

			setSelectedUsers(usersByHome[homeId].map((user) => user.user_id));
		}
	}, [usersByHome, homeId]);

	const handleCheckboxChange = (userId) => {
		setSelectedUsers((prevSelected) =>
			prevSelected.includes(userId)
				? prevSelected.filter((id) => id !== userId)
				: [...prevSelected, userId]
		);
	};

	const handleSave = () => {
		if (selectedUsers.length > 0) {
			dispatch(updateUsersForHome({ homeId, userIds: selectedUsers }));
			closeModal();
		} else {
			alert('At least one user must be selected.');
		}
	};

	return (
		<div>
			<h2>Edit Users for Home</h2>
			<div>
				{users.map((user) => (
					<div key={user.user_id}>
						<label>
							<input
								type="checkbox"
								checked={selectedUsers.includes(user.user_id)}
								onChange={() => handleCheckboxChange(user.user_id)}
							/>
							{user.username}
						</label>
					</div>
				))}
			</div>
			<button onClick={handleSave} disabled={selectedUsers.length === 0}>
				Save
			</button>
			<button onClick={closeModal}>Cancel</button>
		</div>
	);
};

export default EditUserModal;
