import dynamodb from 'dynamodb';
import joi from 'joi';
import { PREFIX_TABLE} from '../config';

const GrupoModel = dynamodb.define('grupo',{
    hashKey:'GrupoId',
    timestamps:false,
    schema:{
        GrupoId:dynamodb.types.uuid(),
        poblacion:joi.number(),
        materia:joi.string()
    },
    tableName:`Grupo${PREFIX_TABLE}`
});