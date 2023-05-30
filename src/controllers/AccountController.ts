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
        this.router.get('/saldo',this.authMiddleware.verifyToken, this.saldo.bind(this)); //Teniamos post no get en el metodo
        this.router.get('/test',this.authMiddleware.verifyToken,this.test.bind(this));
    }

    private async test(req:Request,res:Response){
        res.status(200).send("Esto es una prueba");
    }

    private async deposito(req:Request,res:Response){
        const {useraccount, ammount} = req.body;
        // sumarle a balance en base de datos ammount
        const awsCognitoId = useraccount; //Cambiar constante y verificar cognito
        try{
            UserModel.update({
                awsCognitoId,
                balance: {
                    $add: ammount
                }
            }, (err, acc) => {
                if (err) {
                    res.status(500).send({message: "Error", error: err.message});
                } else {
                    res.status(200).send({ message: "Deposito exitoso", saldo: acc.get('balance')});
                }
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send({ message: "Error", error: error.message });
            } else {
                res.status(500).send({ message: "Error", error: "Unknown error" });
            }
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

    private async saldo(req: Request, res: Response) {
        const {useraccount} = req.body;
        try {
            const user: any = await UserModel.get(useraccount)
          if (user) {
            const balance = user.get('balance');
            res.status(200).send({message:"Bienvenido",  balance });
          } else {
            res.status(404).json({ message: "Usuario no encontrado" });
          }
        } catch (error) {
          if (error instanceof Error) {
            res.status(500).json({ message: "Error", error: error.message });
          } else {
            res.status(500).json({ message: "Error", error: "Unknown error" });
          }
        }
    }
}


export default AccountController;