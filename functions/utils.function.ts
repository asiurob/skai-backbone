export const BSONtoJSON = ( json: any ): any => {
    return JSON.parse( JSON.stringify( json ) );
}