import { Request,Response } from "express";
import { checkSchema } from "express-validator";
import AbstractController from "./AbstractController";
import UserModel from '../modelsNOSQL/userNOSQL';

class AccountController extends AbstractController{
    protected validateBody(type: any) {
        throw new Error("Method not implemented.");
    }
    //Singleton
    //Atributo de clase
    private static instance:AccountController;
    //Método de clase
    public static getInstance():AbstractController{
        if(this.instance){
            return this.instance;
        }
        this.instance = new AccountController('cuenta');
        return this.instance;
    }

    protected initRoutes(): void {
        this.router.post('/deposito', this.deposito.bind(this));
        this.router.post('/retiro',this.retiro.bind(this));
        this.router.post('/saldo',this.saldo.bind(this));
        this.router.get('/test',this.authMiddleware.verifyToken,this.test.bind(this));
    }

    private async test(req:Request,res:Response){
        res.status(200).send("Esto es una prueba");
    }

    private async deposito(req:Request,res:Response){
        const {email, ammount} = req.body;
        // sumarle a balance en base de datos ammount
        try{
            //const user = await UserModel.get(email, '', {
            //    AttributesToGet: ['EmailIndex']
            //        });
            //UserModel.get(email, {ConsistentRead: true}, function (err, acc) {
                //console.log('got account', acc.get('email'));
                console.log(email)
            const a= UserModel.scan().loadAll()
            //.where('email').equals(email)
            .exec();
            console.log(a)
            
            return res.status(200).send('Deposito Hecho')

            //const oldBalance = UserModel.get(balance, {ConsistentRead: true}, function (err, acc) {
                //console.log('got balance', acc.get('balance'));
            //});
            
            //const newBalance = oldBalance + ammount;

            //UserModel.update({email: {userEmail}, Balance: {newBalance}},function (err, acc) {
                //console.log('update balance', acc.get('balance')); // prints the old account name
            //});

            
            //return res.status(200).send('Deposito Hecho')
        }catch(error:any){
            res.status(500).send({code:error.code,message:error.message}).end();
        }
    }

    private async retiro(req:Request,res:Response){
        const{email,ammount} = req.body;
        // checar balance, 
        // si balance > ammount -> restarle ammount a balance -> mensaje de exito
        // si no -> mensaje de error
        //res.status(200).send('Retiro Hecho')
        //res.status(200).send({message:"Retiro Hecho"})
        
        //res.status(500).send({code:error.code,message:error.message})
    }

    private async saldo(req:Request,res:Response){
        const {email} = req.body;
        // consulta a base de datos y regresar balance
        //res.status(200).send('Saldo consultado')
        //res.status(200).send({message:"Saldo consultado"})
    }

}


export default AccountController;