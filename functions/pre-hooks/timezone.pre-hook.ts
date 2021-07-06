import { tz } from 'moment-timezone';

export const setTimezone = async function( this: any, next: any ) {
    console.log( tz( Date.now(), "America/Mexico_City" ).toISOString() );
    this.createdAt = tz( Date.now(), "America/Mexico_City" ).toISOString()
    next();
};