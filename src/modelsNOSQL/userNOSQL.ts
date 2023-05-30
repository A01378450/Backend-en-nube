import dynamodb from '../services/dynamoService';
import joi from 'joi';
import { PREFIX_TABLE } from '../config';
//Verificar tabla
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

UserModel.get('awsCognitoId', function(err, user) {
    if (err) {
        console.log('Error retrieving user: ', err);
    } else {
        console.log('User data: ', user);
    }
});
/*
dynamodb.createTables((err:any)=>{
 	if(err)
 		return console.log('Error al crear la tabla',err);
 	console.log('Tabla creada exitosamente');
 })

*/
export default UserModel;