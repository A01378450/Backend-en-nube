import { Request, Response } from "express";
import AbstractController from "./AbstractController";

class UserController extends AbstractController{
    protected validateBody(type: any) {
        throw new Error("Method not implemented.");
    }
    //Singleton
    //Atributo de clase
    private static instance:UserController;
    //Método de clase
    public static getInstance():AbstractController{
        if(this.instance){
            return this.instance;
        }
        this.instance = new UserController('user');
        return this.instance;
    }
    protected initRoutes(): void {
        this.router.get('/readUsers',this.getReadUsers.bind(this));
        this.router.post('/createUser',this.postCreateUser.bind(this));
        //Todas las rutas que necesite su controlador
    }
    private getReadUsers(req:Request,res:Response){
        res.status(200).send("servicio de lectura de usuarios");
    }
    private postCreateUser(req:Request,res:Response){
        res.status(200).send("Alta usuario");
    }
}

export default UserController;