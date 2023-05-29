import {Router} from 'express';

//Middlewares
import AuthMiddleware from '../middlewares/authorization';
import PermissionMiddleware from '../middlewares/permission';
import ValidationErrorMiddleware from '../middlewares/validationError';

//Servicios
import CognitoService from '../services/cognitoService';

export default abstract class AbstractController{
    private _router:Router = Router();
    private _prefix:string;

    protected handleErrors = ValidationErrorMiddleware.handleErrors;
    protected authMiddleware = AuthMiddleware.getInstance();
    protected permissionMiddleware = PermissionMiddleware.getInstance();
    protected cognitoService = CognitoService.getInstance();

    public get prefix():string{
        return this._prefix;
    }

    public get router():Router{
        return this._router
    }

    protected constructor(prefix:string){
        this._prefix=prefix;
        this.initRoutes();

    }

    //Inicializar rutas
    protected abstract initRoutes():void;
    //Validar el body de la petición
    protected abstract validateBody(type:any):any;

}