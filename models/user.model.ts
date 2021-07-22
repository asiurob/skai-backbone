import { Model, model, Schema } from 'mongoose';


const schema = new Schema({

    name: {
        type: String,
        maxLength: [ 50, 'El nombre no puede tener más de 50 caracteres' ],
        minLength: [ 3, 'El nombre no puede tener menos de 3 catacteres' ],
    },
    last_name: {
        type: String,
        maxLength: [ 75, 'El apellido paterno no puede tener más de 75 caracteres' ],
        minLength: [ 3, 'El apellido paterno no puede tener menos de 3 catacteres' ],
    },
    last_name2: {
        type: String,
        maxLength: [ 75, 'El apellido materno no puede tener más de 75 caracteres' ],
        minLength: [ 3, 'El apellido materno no puede tener menos de 3 catacteres' ],
    },
    nick_name: {
        type: String,
        required: [ true, 'El nombre de usuario es requerido' ],
        unique: true,
        maxLength: [ 25, 'El nombre de usuario no puede tener más de 25 caracteres' ],
        minLength: [ 3, 'El nombre de usuario no puede tener menos de 3 catacteres' ],
    },
    phone: {
        type: Number,
        required: [ true, 'El teléfono es requerido' ],
        maxLength: [ 12, 'El teléfono no puede tener más de 12 caracteres' ],
        minLength: [ 10, 'El teléfono no puede tener menos de 10 catacteres' ],
    },
    email: {
        type: String,
        unique: true,
        required: [ true, 'El correo electrónico es requerido' ],
        maxLength: [ 150, 'El correo electrónico no puede tener más de 150 caracteres' ],
        minLength: [ 6, 'El correo electrónico no puede tener menos de 6 catacteres' ],
        match: [ 
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'El correo electrónico no tiene el formato adecuado.'
         ]
    },
    password: {
        type: String,
        required: [ true, 'La contraseña es necesaria' ],
        maxLength: 60,
        minLength: 60,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: Boolean,
        default: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    modifications: [{
        by: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        at: {
            type: Date,
            default: Date.now
        },
        fields: {
            type: String
        },
        oldFields: {
            type: String
        }
    }]

}, { collection: 'users' });


export const UserModel: Model<any> = model( 'User', schema );