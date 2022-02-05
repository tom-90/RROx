import { Router } from 'express';
import { Layout } from '../layout';
import { body, validationResult } from 'express-validator';

const router = Router();

// Retrieve layouts list
router.get( '/', ( req, res ) => {
    Layout.getList()
        .then( ( layouts ) => {
            res.json( layouts.map( ( l ) => ( {
                id         : l.id              ,
                name       : l.data.name       ,
                description: l.data.description,
            } ) ) );
        } )
        .catch( ( e ) => {
            console.error( e );
            res.sendStatus( 500 );
        } );
} );

// Upload new layout
router.post(
    '/',
    
    body( 'name' ).isString().notEmpty(),
    body( 'description' ).isString().optional(),
    body( 'data' ).isObject(),
    body( 'thumbnail' ).isString().custom( ( value: string ) => typeof value === 'string' && value.startsWith( 'data:image/png;base64,' ) ),

    ( req, res ) => {
        const errors = validationResult( req );
        if( !errors.isEmpty() ) {
            res.status( 400 ).json( { errors: errors.array() } ); 
            return;
        }

        let layout: Layout;

        Layout.create( {
            name       : req.body.name,
            description: req.body.description,
            data       : req.body.data,
        } )
            .then( ( l ) => {
                layout = l;
                return layout.setThumbnail( req.body.thumbnail );
            } )
            .then( ( success ) => {
                if( !success )
                    res.sendStatus( 500 );
                else
                    res.json( { id: layout.id } );
            } )
            .catch( ( e ) => {
                console.error( e );
                res.sendStatus( 500 );
            } );
    }
);

// Get specific layout
router.get( '/:id', ( req, res ) => {
    Layout.get( Number( req.params.id ) )
        .then( ( layout ) => {
            if( !layout )
                res.sendStatus( 404 );
            else
                res.json( layout );
        } ).catch( ( e ) => {
            console.error( e );
            res.sendStatus( 500 );
        } );
} );

// Get layout thumbnail
router.get( '/:id/thumbnail', ( req, res ) => {
    Layout.get( Number( req.params.id ) )
        .then( ( layout ) => {
            if( !layout ) {
                res.sendStatus( 404 );
                return;
            }

            res.sendFile( layout.getThumbnailPath(), ( err ) => {
                if ( err ) res.sendStatus( 500 );
            } );
        } ).catch( ( e ) => {
            console.error( e );
            res.sendStatus( 500 );
        } );
} );

export default router;