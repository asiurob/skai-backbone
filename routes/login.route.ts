import { Router, Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { compare, hashSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SEED } from '../core/environment';
import { BSONtoJSON } from '../functions/utils.function';
import { loginProcess } from '../functions/api-responses.function';



const LoginRoute = Router();

LoginRoute.post( '/', async ( req: Request, res: Response ) => {
    const startAt = new Date();
    let response: any;

    const user   = req.body.user;
    const deleted = false;
    const pass    = req.body.pass;

    if ( !user || !pass ) {
        response = loginProcess( [], [], true, false, false, false, false, startAt );
        return res.status( 400 ).json( response );
    }

    try {
        console.log( hashSync('Password1!', 10) );
        const select = 'name last_name last_name2 email phone password status'; 
        const result = await UserModel.find()
        .select( select )
        .or( [{ nick_name: user }, { email: user }] )


        if ( result.length === 0 ) {
            response = loginProcess( [], [], false, false, true, false, false, startAt );
            return res.status( 401 ).json( response );
        }

        if ( result[0].status === false ) {
            response = loginProcess( [], [], false, false, false, true, false, startAt );
            return res.status( 401 ).json( response );
        }
        
        const compareResult = await compare( pass, result[0].password );
        if ( !compareResult ) {
            response = loginProcess( [], [], false, false, false, false, true, startAt );
            return res.status( 401 ).json( response );
        }

        const payload = BSONtoJSON( result[0] );
        delete payload.password;
        delete payload.status;

        const token = sign(
            { loggedUser: payload },
            SEED,
            { expiresIn: '96h'  }
        );
        payload.token = token;
        response = loginProcess( payload, [], false, false, false, false, false, startAt );
        return res.status( 200 ).json( response );
        

    } catch( e ) {
        response = loginProcess( [], e, false, true, false, false, false, startAt );
        return res.status( 500 ).json( response );
    }
});



export default LoginRoute;