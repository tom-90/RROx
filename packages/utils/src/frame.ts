import { Frame } from "@rrox/types";

export type CoupledFrameItem = {
    frame    : Frame,
    flipped  : boolean,
    isCoupled: boolean;
};

export function getCoupledFrames( frame: Frame, frames: Frame[] ) {
    const coupledFrames: CoupledFrameItem[] = [];

    const getCoupledFrame = ( frame: Frame, type: 'front' | 'rear' ) => {
        if( type === 'front' && frame.Couplings.FrontID != null )
            return frames.find( ( f ) => f.ID === frame.Couplings.FrontID )
        else if( type === 'rear' && frame.Couplings.RearID != null )
            return frames.find( ( f ) => f.ID === frame.Couplings.RearID )
    };

    const processFrame = ( frame: Frame | null, prevItem: CoupledFrameItem, direction: 'forward' | 'backward' ) => {
        if( !frame )
            return;

        if( coupledFrames.find( ( f ) => f.frame === frame ) )
            return; // Prevent infinite recursion

        let flipped = prevItem.flipped;
        let isCoupled = prevItem.isCoupled;
        let next: Frame;

        if( frame.Couplings.FrontID === prevItem.frame.ID ) {
            if( frame.ID === prevItem.frame.Couplings.FrontID )
                flipped = !flipped;

            next = getCoupledFrame( frame, 'rear' );
            isCoupled = isCoupled && frame.Couplings.FrontCoupled;
        } else if( frame.Couplings.RearID === prevItem.frame.ID ) {
            if( frame.ID === prevItem.frame.Couplings.RearID )
                flipped = !flipped;

            next = getCoupledFrame( frame, 'front' );
            isCoupled = isCoupled && frame.Couplings.RearCoupled;
        }

        const item = { frame, flipped, isCoupled };

        if( direction === 'forward' )
            coupledFrames.unshift( item );
        else if( direction === 'backward' )
            coupledFrames.push( item );

        processFrame( next, item, direction );
    };

    const item = { frame, flipped: false, isCoupled: true };
    coupledFrames.push( item );
    processFrame( getCoupledFrame( frame, 'front' ), item, 'forward'  );
    processFrame( getCoupledFrame( frame, 'rear'  ), item, 'backward' );

    return coupledFrames;
}

const EngineTypes = [ 'porter_040', 'porter_042', 'handcar', 'eureka', 'climax', 'heisler', 'class70', 'cooke260' ];

export function isEngine( frame: Frame ) {
    return EngineTypes.includes( frame.Type );
}