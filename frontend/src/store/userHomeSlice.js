import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchUsers = createAsyncThunk('userHome/fetchUsers', async () => {
	const response = await axios.get('http://localhost:5000/api/user/find-all');
	return response.data;
});

export const fetchHomesByUser = createAsyncThunk(
	'userHome/fetchHomesByUser',
	async (userId) => {
		const response = await axios.get(
			`http://localhost:5000/api/home/find-by-user?user_id=${userId}`
		);
		return { userId, homes: response.data };
	}
);

export const fetchUsersByHome = createAsyncThunk(
	'userHome/fetchUsersByHome',
	async (homeId) => {
		const response = await axios.get(
			`http://localhost:5000/api/user/find-by-home?homeId=${homeId}`
		);
		return { homeId, users: response.data };
	}
);

export const updateUsersForHome = createAsyncThunk(
	'userHome/updateUsersForHome',
	async ({ homeId, userIds }, { dispatch, getState }) => {
		await axios.post('http://localhost:5000/api/home/update-users', {
			homeId,
			userIds
		});
		const { selectedUserId } = getState().userHome;
		dispatch(fetchHomesByUser(selectedUserId));
	}
);

// Initial state
const initialState = {
	users: [],
	homesByUser: {},
	usersByHome: {},
	selectedUserId: null,
	loading: false,
	error: null
};

// Slice
const userHomeSlice = createSlice({
	name: 'userHome',
	initialState,
	reducers: {
		setSelectedUserId(state, action) {
			state.selectedUserId = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUsers.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.loading = false;
				state.users = action.payload;
			})
			.addCase(fetchHomesByUser.fulfilled, (state, action) => {
				state.homesByUser[action.payload.userId] = action.payload.homes;
			})
			.addCase(fetchUsersByHome.fulfilled, (state, action) => {
				state.usersByHome[action.payload.homeId] = action.payload.users;
			})
			.addCase(updateUsersForHome.fulfilled, (state) => {
				// No need to modify state here since fetchHomesByUser is re-dispatched after update
			})
			.addMatcher(
				(action) => action.type.endsWith('/rejected'),
				(state, action) => {
					state.loading = false;
					state.error = action.error.message;
				}
			);
	}
});

export const { setSelectedUserId } = userHomeSlice.actions;

export default userHomeSlice.reducer;
