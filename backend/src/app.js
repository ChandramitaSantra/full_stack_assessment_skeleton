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
	port: 3306,
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

				// Find the home with the given homeId
				const homeRepository = AppDataSource.getRepository('Home');
				const home = await homeRepository.findOne({
					where: { home_id: homeId },
					relations: ['users'] // Load the users related to the home
				});

				if (!home) {
					return res.status(404).json({ message: 'Home not found' });
				}

				// Return the users associated with the home
				res.json(home.users);
			} catch (error) {
				console.log(error);

				console.error('Error fetching users by home:', error);
				res.status(500).json({ message: 'Internal Server Error' });
			}
		});

		app.listen(5000, () => {
			console.log('Server running on http://localhost:5000');
		});
	})
	.catch((error) => console.log(error));
