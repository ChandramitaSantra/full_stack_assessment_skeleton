const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
	name: 'Home',
	tableName: 'home',
	columns: {
		home_id: {
			type: 'int',
			primary: true,
			generated: true
		},
		street_address: {
			type: 'varchar'
		},
		state: {
			type: 'varchar'
		},
		zip: {
			type: 'varchar'
		},
		list_price: {
			type: 'float'
		},
		beds: {
			type: 'int'
		},
		baths: {
			type: 'int'
		},
		sqft: {
			type: 'float'
		}
	},
	relations: {
		users: {
			target: 'User',
			type: 'many-to-many',
			joinTable: {
				name: 'user_home_relations',
				joinColumn: {
					name: 'home_id',
					referencedColumnName: 'home_id'
				},
				inverseJoinColumn: {
					name: 'user_id',
					referencedColumnName: 'user_id'
				}
			},
			cascade: true
		}
	}
});
