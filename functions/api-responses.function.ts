export const ErrorMongoResult = ( e: any ): any => {

    if ( e.errors ) {
        const processed = Object.keys( e.errors )
            .map( key => {
                const obj = { key: null, value: null };
                const route   = e.errors[ key ].properties;
                const routeID = e.errors[ key ];
                obj.key   = route ? route.path : routeID.path;
                obj.value = route ? route.message : routeID.message;
                return obj;
            });
        
        return processed;
    } else if( e.code ) {
        return [{
            key: 'duplicated',
            value: e.keyValue
        }];
    } else {
        return e;
    }
};


export const ErrorResponse = ( errors: any, startedAt: Date, error?: any ): any => {
    return {
        payload: [],
        errors,
        response: {
            title: 'Ocurrió un error interno',
            message: 'Algo inesperado sucedió, inténtalo nuevamente más tarde',
    
        },
        meta: {
            startedAt,
            endAt: new Date(),
            error
        }
    }
}


export const SuccessInsertion = ( payload: any, startedAt: Date ): any => {

    return {
        payload,
        errors: [],
        response: {
            title: '¡Correcto!',
            message: 'Se añadió correctamente el recurso a la base de datos',
    
        },
        meta: {
            startedAt,
            endAt: new Date()
        }
    }
}

export const loginProcess = ( 
    payload: any, errors: any[], 
    missData: boolean, failed: boolean, 
    notFound: boolean, noAccess: boolean, 
    badPass: boolean, startedAt: Date ): any => {
    let response: any = { title: undefined, message: undefined };
        if ( missData ) {
            response.title   = 'Imposible autenticarse';
            response.message = 'El usuario y/o contraseña son necesarios';
        }else if ( failed ) {
            response.title   = 'Ocurrió un error interno';
            response.message = 'Algo inesperado sucedió, inténtalo nuevamente más tarde';
        } else if ( notFound ) {
            response.title   = 'Imposible autenticarse';
            response.message = 'El usuario no fue encontrado';
        } else if( noAccess ) {
            response.title   = 'Imposible autenticarse';
            response.message = 'Tu cuenta ha sido suspendida. Si crees que es un error, escríbenos a hola@skai.com.mx';
        }else if( badPass ) {
            response.title   = 'Imposible autenticarse';
            response.message = 'La contraseña proporcionada es incorrecta';
        }
        else {
            response.title   = 'Autenticación correcta';
            response.message = 'Bienvenid@';
        }

    return {
        payload,
        errors,
        response,
        meta: {
            startedAt,
            endAt: new Date()
        }
    }
}

export const UpdateStatus = ( startedAt: Date, failed: boolean, notFound: boolean, error?: any, deleted?: boolean ): any => {
    let response: any = { title: undefined, message: undefined };
    if ( failed ) {
        response.title   = 'Ocurrió un error interno';
        response.message = 'Algo inesperado sucedió, inténtalo nuevamente más tarde';
    } else if ( notFound ) {
        response.title   = 'No encontramos el recurso';
        response.message = 'Intentamos buscar el recurso, pero no lo encontramos en la base de datos';
    } else if( deleted ) {
        response.title   = '¡Correcto!';
        response.message = 'El recurso se eliminó correctamente';
    }else {
        response.title   = '¡Correcto!';
        response.message = 'El recurso se actualizó correctamente';
    }
    return {
        response,
        meta: {
            startedAt,
            endAt: new Date(),
            error
        }
    }
}

export const getResults = ( payload: any, startedAt: Date, count: number, failed?: boolean, error?: any ): any => {

    let response: any = { title: undefined, message: undefined };
    if ( failed ) {
        response.title   = 'Ocurrió un error interno';
        response.message = 'Algo inesperado sucedió, inténtalo nuevamente más tarde';
    } else {
        response.title   = '¡Correcto!';
        response.message = 'Estos son los resultados';
    }
    return {
        payload,
        response,
        meta: {
            startedAt,
            endAt: new Date(),
            error,
            count
        }
    }
}

