import { configureStore } from '@reduxjs/toolkit';
import userHomeSlice from './userHomeSlice';

const store = configureStore({
	reducer: {
		userHome: userHomeSlice
	}
});

export default store;

export * from './userHomeSlice'; // Exporting the actions for use in components
