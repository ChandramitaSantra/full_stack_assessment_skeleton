// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const userRoutes = require('./routes/userRoutes');
// const homeRoutes = require('./routes/homeRoutes');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// app.use('/api/user', userRoutes);
// app.use('/api/home', homeRoutes);

// app.listen(5000, () => {
// 	console.log('Server running on http://localhost:5000');
// });

require('reflect-metadata');
const express = require('express');
const { createConnection, DataSource } = require('typeorm');
const bodyParser = require('body-parser');
const cors = require('cors');

const User = require('./models/User');
const Home = require('./models/Home');

const AppDataSource = new DataSource({
	type: 'mysql',
	host: 'localhost',
	port: 5001,
	username: 'root',
	password: '6equj5_root',
	database: 'home_db',
	entities: [User, Home],
	synchronize: true,
	logging: false
});
AppDataSource.initialize()
	.then((connection) => {
		console.log('Database connection established:', connection.isConnected);

		const app = express();
		app.use(cors());
		app.use(bodyParser.json());

		// app.use('/api/user', userRoutes);
		// app.use('/api/home', homeRoutes);
		// app.use('/api/user/getAll', async (req, res) => {
		// 	const userRepository = AppDataSource.getRepository(User);
		// 	console.log('worked');

		// 	const users = await userRepository.find();
		// 	res.json(users);
		// });

		app.use('/api/home/find-by-user', async (req, res) => {
			try {
				const userId = req.query.user_id;
				const homeRepository = AppDataSource.getRepository(Home);
				const homes = await homeRepository
					.createQueryBuilder('home')
					.innerJoin('home.users', 'user')
					.where('user.user_id = :userId', { userId })
					.getMany();
				res.json(homes);
			} catch (err) {
				res.status(500).json({ message: err.message });
			}
		});
		app.use('/api/home/update-users', async (req, res) => {
			try {
				const { homeId, userIds } = req.body;
				const homeRepository = AppDataSource.getRepository(Home);
				const home = await homeRepository.findOne({
					where: { home_id: homeId },
					relations: ['users']
				});
				if (home) {
					const userRepository = AppDataSource.getRepository(User);
					const users = await userRepository.findByIds(userIds);
					home.users = users;
					await homeRepository.save(home);
					res.status(200).json({ message: 'Users updated successfully' });
				} else {
					res.status(404).json({ message: 'Home not found' });
				}
			} catch (err) {
				res.status(500).json({ message: err.message });
			}
		});

		app.use('/api/user/find-all', async (req, res) => {
			try {
				const userRepository = AppDataSource.getRepository(User);
				console.log('worked');

				const users = await userRepository.find();
				res.json(users);
			} catch (err) {
				console.log(err);

				res.status(500).json({ message: err.message });
			}
		});

		app.use('/api/user/find-by-home', async (req, res) => {
			try {
				const { homeId } = req.query;
				const relations = await AppDataSource.getRepository(
					UserHomeRelations
				).find({ where: { home_id: homeId } });
				const userIds = relations.map((rel) => rel.user_id);
				const users = await AppDataSource.getRepository(User).findByIds(
					userIds
				);
				res.json(users);
			} catch (error) {
				console.error('Error fetching users by home:', error);
				res.status(500).json({ message: 'Internal Server Error' });
			}
		});

		// const getAllUsers = async (req, res) => {
		//   try {
		//     const userRepository = getRepository(User);
		//     console.log('worked');

		//     const users = await userRepository.find();
		//     res.json(users);
		//   } catch (err) {
		//     console.log(err);

		//     res.status(500).json({ message: err.message });
		//   }
		// };
		// const getUsersByHome = async (req, res) => {
		//   try {
		//     const { homeId } = req.params;

		//     // Find the home by ID
		//     const home = await getRepository(Home).findOne(homeId);

		//     if (!home) {
		//       return res.status(404).json({ message: 'Home not found' });
		//     }

		//     // Get all UserHomeRelations for the given home
		//     const relations = await getRepository(UserHomeRelations).find({ where: { home_id: homeId } });

		//     // Extract the user IDs from the relations
		//     const userIds = relations.map(rel => rel.user_id);

		//     // Find all users by the extracted user IDs
		//     const users = await getRepository(User).findByIds(userIds);

		//     return res.json(users);
		//   } catch (error) {
		//     console.error('Error fetching users by home:', error);
		//     return res.status(500).json({ message: 'Internal Server Error' });
		//   }
		// };

		// async (req, res) => {
		//   try {
		//     const userId = req.query.user_id;
		//     const homeRepository = getRepository(Home);
		//     const homes = await homeRepository
		//       .createQueryBuilder('home')
		//       .innerJoin('home.users', 'user')
		//       .where('user.user_id = :userId', { userId })
		//       .getMany();
		//     res.json(homes);
		//   } catch (err) {
		//     res.status(500).json({ message: err.message });
		//   }
		// };

		// const updateHomeUsers = async (req, res) => {
		//   try {
		//     const { homeId, userIds } = req.body;
		//     const homeRepository = getRepository(Home);
		//     const home = await homeRepository.findOne({
		//       where: { home_id: homeId },
		//       relations: ['users']
		//     });
		//     if (home) {
		//       const userRepository = getRepository(User);
		//       const users = await userRepository.findByIds(userIds);
		//       home.users = users;
		//       await homeRepository.save(home);
		//       res.status(200).json({ message: 'Users updated successfully' });
		//     } else {
		//       res.status(404).json({ message: 'Home not found' });
		//     }
		//   } catch (err) {
		//     res.status(500).json({ message: err.message });
		//   }
		// };

		app.listen(5000, () => {
			console.log('Server running on http://localhost:5000');
		});
	})
	.catch((error) => console.log(error));

// createConnection({
// 	type: 'mysql',
// 	host: 'localhost',
// 	port: 5001,
// 	username: 'root',
// 	password: '6equj5_root',
// 	database: 'home_db',
// 	synchronize: true,
// 	entities: [User, Home]
// })
