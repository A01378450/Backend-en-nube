import { Request,Response } from "express";
import { checkSchema } from "express-validator";
import AbstractController from "./AbstractController";
import UserModel from '../modelsNOSQL/userNOSQL';
import db from '../models';

class AuthenticationController extends AbstractController{
    protected validateBody(type: any) {
        throw new Error("Method not implemented.");
    }
    //Singleton
    //Atributo de clase
    private static instance:AuthenticationController;
    //Método de clase
    public static getInstance():AbstractController{
        if(this.instance){
            return this.instance;
        }
        this.instance = new AuthenticationController('auth');
        return this.instance;
    }

    protected initRoutes(): void {
        this.router.post('/signup', this.signup.bind(this));
        this.router.post('/verify',this.verify.bind(this));
        this.router.post('/signin',this.signin.bind(this));
        this.router.get('/test',this.authMiddleware.verifyToken,this.test.bind(this));
    }

    private async test(req:Request,res:Response){
        res.status(200).send("Esto es una prueba");
    }

    private async signin(req:Request,res:Response){
        const {email,password} = req.body;
        try{
            const login = await this.cognitoService.signInUser(email,password);
            
            res.status(200).send({...login.AuthenticationResult});
        }catch(error:any){
            res.status(500).send({code:error.code,message:error.message}).end()
        }
    }

    private async verify(req:Request,res:Response){
        const{email,code} =req.body;
        try{
            await this.cognitoService.verifyUser(email,code);
            
            return res.status(200).end();

        }catch(error:any){
            res.status(500).send({code:error.code,message:error.message}).end()
        }
    }

    private async signup(req:Request,res:Response){
        const {email,password,name, role} = req.body;
        try{
            //Create a new user in Cognito
            const user = await this.cognitoService.signUpUser(email,password,[
                {
                    Name: 'email',
                    Value: email
                }
            ])
            //Guardar el usuario en DB NoSQL (DynamoDB)
            await UserModel.create(
                {
                    awsCognitoId:user.UserSub,
                    name,
                    role,
                    email
                },
                {overwrite:false}
            )
            console.log('Usuario guardado en BDNoSQL')
            //Guard el usuario en DB relacional (MySQL)
            await db['User'].create(
                {
                    awsCognitoId:user.UserSub,
                    name,
                    role,
                    email
                }
            )
            console.log("Usuario de cognito creado",user);
            res.status(201).send({message:"User signedUp"})
        }catch(error:any){
            res.status(500).send({code:error.code,message:error.message}).end()
        }
    }
}

export default AuthenticationController;