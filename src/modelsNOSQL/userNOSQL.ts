import dynamodb from '../services/dynamoService';
import joi from 'joi';
import { PREFIX_TABLE } from '../config';

const UserModel = dynamodb.define('user',{
	hashKey:'awsCognitoId',
	timestamps:true,
	schema:{
		awsCognitoId: joi.string().required(),
		name: joi.string().required(),
		balance: joi.number().default(0),
		email: joi.string().required().email(),
	},
	tableName:`Clientes${PREFIX_TABLE}`,
	indexes: [
		{
			hashKey: 'email',
			name: 'EmailIndex',
			type: 'global',
		},
	],
});


// /dynamodb.createTables((err:any)=>{
// 	if(err)
// 		return console.log('Error al crear la tabla',err);
// 	console.log('Tabla creada exitosamente');
// })

export default UserModel;