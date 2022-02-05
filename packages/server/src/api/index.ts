import layouts from './layouts';
import { Router } from 'express';

const router = Router();

router.use( '/layouts', layouts );

router.all( '/*', ( req, res ) => res.sendStatus( 404 ) )

export default router;