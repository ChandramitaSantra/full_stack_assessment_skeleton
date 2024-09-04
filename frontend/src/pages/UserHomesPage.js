import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, fetchHomesByUser } from '../store/store';
import HomeCard from '../components/HomeCard';

const UserHomesPage = () => {
	const dispatch = useDispatch();
	const users = useSelector((state) => state.users.all);
	const homes = useSelector((state) => state.homes);
	const [selectedUser, setSelectedUser] = useState('');

	useEffect(() => {
		dispatch(fetchUsers());
	}, [dispatch]);

	useEffect(() => {
		if (selectedUser) {
			dispatch(fetchHomesByUser(selectedUser));
		}
	}, [selectedUser, dispatch]);

	return (
		<div>
			<select onChange={(e) => setSelectedUser(e.target.value)}>
				<option value="">Select a User</option>
				{users.map((user) => {
					console.log(user);

					return (
						<option key={user.user_id} value={user.user_id}>
							{user.username}
						</option>
					);
				})}
			</select>

			<div className="homes-container">
				{homes.map((home) => (
					<HomeCard key={home.home_id} home={home} userId={selectedUser} />
				))}
			</div>
		</div>
	);
};

export default UserHomesPage;
