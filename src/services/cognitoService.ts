import AWS, { SecretsManager } from 'aws-sdk';
import crypto from 'node:crypto';
import { AWS_REGION, COGNITO_APP_CLIENT_ID,COGNITO_APP_SECRET_HASH } from '../config';

type CognitoAttributes = 'email'|'name'|'phone_number';

class CognitoService{
    //Conectar la aplicación con cognito
    private config: AWS.CognitoIdentityServiceProvider.ClientConfiguration;
    private cognitoIdentity: AWS.CognitoIdentityServiceProvider;

    //Datos del cliente
    private clientId= COGNITO_APP_CLIENT_ID;
    private secretHash= COGNITO_APP_SECRET_HASH;

    //Singleton
    private static instance: CognitoService;
    public static getInstance():CognitoService{
        if(this.instance){
            return this.instance;
        }
        this.instance = new CognitoService();
        return this.instance;
    }

    private constructor(){
        this.config={
            region: AWS_REGION,
        };
        this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config);
    }

    //Metodo de registro
    public async signUpUser(email:string, password:string,userAttr:{Name:CognitoAttributes; Value:string}[]){
        const params={
            ClientId: this.clientId,
            Password: password,
            Username: email,
            SecretHash: this.hashSecret(email),
            UserAttributes:userAttr
        }
        return await this.cognitoIdentity.signUp(params).promise();
    }

    //Metodo de verificacion de nuevos usuarios
    public async verifyUser(email:string, code:string){
        const params={
            ClientId: this.clientId,
            ConfirmationCode: code,
            Username: email,
            SecretHash: this.hashSecret(email)
        }
        return await this.cognitoIdentity.confirmSignUp(params).promise();
    }

    //Metodo de autenticación
    public async signInUser(email:string, password:string){
        const params={
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: this.clientId,
            AuthParameters:{
                USERNAME:email,
                PASSWORD:password,
                SECRET_HASH:this.hashSecret(email)
            }            
        }
        
        return await this.cognitoIdentity.initiateAuth(params).promise();
    }

    //TODO: Recuperación de password, admistración de admins de la pool


    private hashSecret(username:string):string{
        return crypto
            .createHmac('SHA256',this.secretHash)
            .update(username+this.clientId)
            .digest('base64')
    }

}

export default CognitoService;