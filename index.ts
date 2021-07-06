// Core
import Server from './core/server';
import Database from './core/database';

//Frameworks
import bodyParser from 'body-parser';
import cors from 'cors';
import fileupload from 'express-fileupload';
import express from 'express';

//Routes


//Declaraciones
const server   = Server.instance;
const database = Database.instance;


//Middlewares
server.app.use( bodyParser.urlencoded({ extended: true }) );
server.app.use( bodyParser.json() );
server.app.use( cors( { origin: true, credentials: true } ) );
server.app.use( fileupload() );
server.app.use( express.static('public') );

//Routes



server.start( () => {
    console.log(`Initializing at ${ server.port } port`);
    database.connect();
});
