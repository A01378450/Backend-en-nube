import { Request, Response } from "express";
import { checkSchema } from "express-validator";
import AbstractController from "./AbstractController";
import UserModel from "../modelsNOSQL/userNOSQL";

class AccountController extends AbstractController {
  protected validateBody(type: any) {
    throw new Error("Method not implemented.");
  }
  //Singleton
  //Atributo de clase
  private static instance: AccountController;
  //Método de clase
  public static getInstance(): AbstractController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new AccountController("cuenta");
    return this.instance;
  }

  protected initRoutes(): void {
    this.router.post("/deposito",this.authMiddleware.verifyToken, this.deposito.bind(this));
    this.router.post("/retiro",this.authMiddleware.verifyToken, this.retiro.bind(this));
    this.router.get("/saldo",this.authMiddleware.verifyToken, this.saldo.bind(this));
    this.router.get("/test", this.authMiddleware.verifyToken, this.test.bind(this));
  }

  private async test(req: Request, res: Response) {
    res.status(200).send("Esto es una prueba");
  }

  private async deposito(req: Request, res: Response) {
    const { amount } = req.body;

    UserModel.get(req.id, (err, data) => {
      const userId = req.id
      if (err) {
        console.error("Error:", err);
        return res
          .status(500)
          .json({ message: "Error", error: err.message || "Unknown error" });
      }
      if (data) {
        const name = data.attrs.name;
        const newBalance = data.attrs.balance + amount;
        const email = data.attrs.email;
        UserModel.update(
          {
            awsCognitoId: userId,
            name: name,
            balance: newBalance,
            email: email
          }, (err, data) => {
            if (err) {
              console.error("Error:", err);
              return res
                .status(500)
                .json({ message: "Error", error: err.message || "Unknown error" });
            }
          })
        console.log("Balance: %f", newBalance);
        return res.status(200).json({ message: "Deposito", amount });
      } else {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
    });
  }

  private async retiro(req: Request, res: Response) {
    const { amount } = req.body;

    UserModel.get(req.id, (err, data) => {
      const userId = req.id
      if (err) {
        console.error("Error:", err);
        return res
          .status(500)
          .json({ message: "Error", error: err.message || "Unknown error" });
      }
      if(amount < data.attrs.balance){
        if (data) {
          const name = data.attrs.name;
          const newBalance = data.attrs.balance - amount;
          const email = data.attrs.email;
          UserModel.update(
            {
              awsCognitoId: userId,
              name: name,
              balance: newBalance,
              email: email
            }, (err, data) => {
              if (err) {
                console.error("Error:", err);
                return res
                  .status(500)
                  .json({ message: "Error", error: err.message || "Unknown error" });
              }
            })
          console.log("Balance: %f", newBalance);
          return res.status(200).json({ message: "Retiro", amount });
        } else {
          return res.status(404).json({ message: "Usuario no encontrado" });
        }
      }
      else{
        console.log("No cuenta con el saldo suficiente")
        return res.status(404).json({ message: "Saldo insuficiente" });
      }
    });
  }

  private saldo(req: Request, res: Response) {
    UserModel.get(req.id, (err, data) => {
      const userId = req.id
      if (err) {
        console.error("Error:", err);
        return res
          .status(500)
          .json({ message: "Error", error: err.message || "Unknown error" });
      }
      if (userId) {
        const balance = data.attrs.balance;
        console.log("Balance: %f", balance);
        return res.status(200).json({ message: "Bienvenido", balance });
      } else {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
    });
  }
}

export default AccountController;
