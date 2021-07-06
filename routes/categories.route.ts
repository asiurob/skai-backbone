import { Router, Request, Response } from 'express';
import { ExampleModel } from '../models/example.model';
import { ErrorMongoResult, ErrorResponse, 
        getResults, SuccessInsertion, UpdateStatus } from '../functions/api-responses.function';

const ExampleRoute = Router();

ExampleRoute.get( '/', async ( req: Request, res: Response ) => {

    const startAt   = new Date();
    let response: any;
    let code: number;
    const _map: any = {};
    const _mapDefaults = {
        id: {}, limit: 20, order: 1,
        orderBy: 'name', match: '', skip: 0
    };

    [
        'id', 'limit', 'order', 'history',
        'orderBy', 'match', 'skip',
    ].forEach( key => {
        if ( req.query[ key ] ) {
            _map[ key ] = req.query[ key ];
        }
    });
    
    let where: any = { deleted: false };

    if ( _map.id ) {
        where._id = _map.id
    } else if ( _map.match ) {
        where.name = new RegExp( _map.match, 'ig' )
    }
    const requirements = '_id status name createdBy createdAt' + 
    ( _map.history ? ' modifications' : '' );

    const populateCreateBy =  {
        path: 'createdBy',
        select: '_id name last_name last_name2'
    };

    const populateModifiedBy = _map.history ? {
        path: 'modifications.by',
        select: '_id name last_name last_name2'
    } : undefined;


    try {
        const result = await ExampleModel.find({}, requirements)
        .limit( 
            Number( _map.limit ) || 
            _mapDefaults.limit
        )
        .skip( 
            Number( _map.skip ) || 
            _mapDefaults.skip 
        )
        .sort([[ 
            _map.orderBy || _mapDefaults.orderBy, 
            Number ( _map.order )|| _mapDefaults.order
        ]])
        .populate( populateCreateBy )
        .populate( populateModifiedBy )
        .where( where )
        const count = await ExampleModel.countDocuments( { deleted: false } );
        response = getResults( result, startAt, count );
        code     = 200;
    } catch ( e ) {
        response = getResults( [], startAt, 0, true, e );
        code     = 500;
    }

    return res.status( code ).json( response );
});

ExampleRoute.post( '/:id', async ( req: Request, res: Response ) => {
    const startAt = new Date();
    const id      = req.params.id;
    let response: any;
    let code: number;
    const _model: any = {};
    [
        'name', 'status',
    ].forEach( key => {
        const value = req.body[ key ];
        if ( value !== undefined && value !== null && value !== '' ) {
            _model[ key ] = value;
        }
    });


    let oldFields: string;
    try {
        const olds = await ExampleModel.findById( id );
        const obj: any = {};
        Object.keys( _model ).forEach( key => obj[ key ] = olds[ key ])
        oldFields  = JSON.stringify( obj );
    } catch ( e ) {
        oldFields = `Error al buscar ${ JSON.stringify( e ) }`;
    }
    _model.$push = {
        modifications: {
            by: req.body.loggedUser._id,
            fields: JSON.stringify( _model ),
            oldFields
        }
    };

    try {
        const res      = await ExampleModel.findByIdAndUpdate( id, _model );
        const notFound = !res ? true : false;
        response = UpdateStatus( startAt, false, notFound );
        code     = res ? 200 : 400;
    } catch( e ) {
        response = UpdateStatus( startAt, true, false, e );
        code     = 500;
    }
    return res.status( code ).json( response );
});

ExampleRoute.put( '/', async ( req: Request, res: Response ) => {
    const startAt = new Date();
    let response: any;
    let code: number;
    const _model: any = {};
    [ 'name']
    .forEach( key => {
        if (req.body[ key ] ){
            _model[ key ] = req.body[ key ];
        }
    });

    _model.createdBy = req.body.loggedUser._id;

    
    
    try {
        const res       = await new ExampleModel( _model ).save();
        const file: any = req.files?.image;
        if ( file ) {
            const image = `public/images/motos/${ res._id }.png`;
            await file.mv( image );
            await ExampleModel.findByIdAndUpdate( res._id, { image } );
        }

        response = SuccessInsertion( res, startAt );
        code     = 201;
    } catch( e ) {        
        const errors = ErrorMongoResult( e );
        response     = ErrorResponse( errors, startAt, e );
        code         = 500;
    }
    return res.status( code ).json( response );
});

ExampleRoute.delete( '/', async ( req: Request, res: Response ) => {

    const startAt = new Date();
    const id      = req.params.id;
    let response: any;
    let code: number;

    const deleted = { 
        deleted: true,
        $push: {
            modifications: {
                by: req.body.loggedUser._id,
                fields: '{ "deleted": "true" }',
                oldFields: '{ "deleted": "false" }'
            }
        }
    };

    try {
        const res      = await ExampleModel.findByIdAndUpdate( id, deleted );
        const notFound = !res ? true : false;
        response = UpdateStatus( startAt, false, notFound, undefined, true );
        code     = res ? 200 : 400;
    } catch( e ) {
        response = UpdateStatus( startAt, true, false, e );
        code     = 500;
    }
    return res.status( code ).json( response );
});

export default ExampleRoute;