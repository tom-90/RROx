import { Router } from 'express';

const router = Router();

router.all( '/*', ( req, res ) => res.sendStatus( 404 ) )

export default router;