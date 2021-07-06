import { Model, model, Schema } from 'mongoose';

const schema = new Schema({

    name: {
        type: String,
        required: [ true, 'El nombre es requerido' ],
        maxLength: [ 50, 'El nombre no puede tener más de 200 caracteres' ],
        minLength: [ 3, 'El nombre no puede tener menos de 3 catacteres' ],
    },
    linkName: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
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

}, { collection: 'examples' })

export const ExampleModel: Model<any> = model( 'Example', schema );