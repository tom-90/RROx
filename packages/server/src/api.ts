import path from "path";

const express = require('express');
const apiRouter = express.Router();

apiRouter.get( "/", ( req: any, res: { sendFile: (arg0: string, arg1: (err: any) => void) => void; sendStatus: (arg0: number) => void; } ) => {
    res.sendFile( path.join( __dirname, "../public/index.html" ), err => {
        if ( err ) res.sendStatus( 500 );
    } );
} );

exports.router = apiRouter;