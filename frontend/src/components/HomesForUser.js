import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	fetchUsers,
	fetchHomesByUser,
	setSelectedUserId
} from '../store/userHomeSlice';
import HomeCard from './HomeCard';

const HomesForUser = () => {
	const dispatch = useDispatch();
	const { users, homesByUser, selectedUserId } = useSelector(
		(state) => state.userHome
	);

	useEffect(() => {
		dispatch(fetchUsers());
	}, [dispatch]);

	const handleUserChange = (e) => {
		const userId = e.target.value;
		dispatch(setSelectedUserId(userId));
		dispatch(fetchHomesByUser(userId));
	};

	return (
		<div>
			<select onChange={handleUserChange} value={selectedUserId || ''}>
				<option value="" disabled>
					Select User
				</option>
				{users.map((user) => (
					<option key={user.user_id} value={user.user_id}>
						{user.username}
					</option>
				))}
			</select>
			<div>
				{selectedUserId &&
					homesByUser[selectedUserId]?.map((home) => (
						<HomeCard key={home.home_id} home={home} />
					))}
			</div>
		</div>
	);
};

export default HomesForUser;
