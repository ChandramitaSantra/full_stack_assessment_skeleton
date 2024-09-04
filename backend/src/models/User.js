const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
	name: 'User',
	tableName: 'user',
	columns: {
		user_id: {
			type: 'int',
			primary: true,
			generated: true
		},
		username: {
			type: 'varchar'
		},
		email: {
			type: 'varchar'
		}
	},
	relations: {
		homes: {
			target: 'Home',
			type: 'many-to-many',
			joinTable: {
				name: 'user_home_relations',
				joinColumn: {
					name: 'user_id',
					referencedColumnName: 'user_id'
				},
				inverseJoinColumn: {
					name: 'home_id',
					referencedColumnName: 'home_id'
				}
			},
			cascade: true
		}
	}
});
