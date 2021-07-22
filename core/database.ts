//Dependencias
import mongo from 'mongoose';
import { DB, DB_PASSWORD, DB_USER } from "./environment";

export default class Database {

    private static _instance: Database;
    private uri: string;

    private constructor () {
        this.uri = `mongodb+srv://${ DB_USER }:${ DB_PASSWORD }@${ DB }.zkxvj.mongodb.net/BearDB?retryWrites=true&w=majority`;
    }

    public static get instance() {
        return this._instance || ( this._instance = new Database() )
    }

    public connect () {
        mongo.connect( this.uri, 
            { 
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            }, 
        ( err: any ) => {
            if( err ) return console.log( err.message );

            console.log( `Conectado a la base ${ DB }` );
        });
    }
}