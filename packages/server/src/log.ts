import express from 'express';

export const logger: express.Handler = ( req, res, next ) => {
    let current_datetime = new Date();
    let formatted_date =
        current_datetime.getFullYear() +
        "-" +
        ( current_datetime.getMonth() + 1 ).toString().padStart( 2, '0' ) +
        "-" +
        current_datetime.getDate().toString().padStart( 2, '0' ) +
        " " +
        current_datetime.getHours().toString().padStart( 2, '0' ) +
        ":" +
        current_datetime.getMinutes().toString().padStart( 2, '0' ) +
        ":" +
        current_datetime.getSeconds().toString().padStart( 2, '0' );
    let log = `[${formatted_date}] ${req.method}:${req.url}`;
    console.log( log );
    next();
};