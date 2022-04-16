import { IPluginController, Controller, Actions, IQuery } from '@rrox/api';
import { Log, TeleportCommunicator, ChangeSwitchCommunicator, SetControlsCommunicator, FrameCarControl } from '../shared';
import { ASwitch } from './structs/arr/Switch';
import { FVector } from './structs/CoreUObject/Vector';
import { World } from './world';

export default class WorldPlugin extends Controller {
    private world: World;

    public async load( controller: IPluginController ): Promise<void> {
        this.world = new World( controller );

        const query = controller.getAction( Actions.QUERY );

        let switchQuery: IQuery<ASwitch> | undefined = undefined;

        controller.addSetup( async () => {
            await this.world.prepare();

            const interval = setInterval( () => this.world.load(), 1000 );

            
            switchQuery = await query.prepareQuery( ASwitch, ( sw ) => [ sw.switchstate ] );

            return () => {
                clearInterval( interval );
            }
        } );

        controller.communicator.handle( TeleportCommunicator, async ( playerName, location ) => {
            const player = this.world.gameState?.PlayerArray?.find( ( player ) => player.PlayerNamePrivate === playerName );

            if( !player || !player.PawnPrivate )
                return Log.warn( `Cannot teleport player '${playerName}' as this player could not be found.` );

            const vector = await query.create( FVector );

            vector.X = location.X;
            vector.Y = location.Y;

            if( 'Z' in location )
                vector.Z = location.Z;
            else {
                const height = await this.world.getHeight( location );

                if( !height )
                    return Log.warn( `Cannot teleport player '${playerName}' as the height of the location could not be determined.` );

                vector.Z = height + 400;
            }

            const success = await player.PawnPrivate.K2_SetActorLocation( vector, false, null as any, false );
            
            if( !success )
                return Log.warn( `Cannot teleport player '${playerName}'.` );
        } );

        controller.communicator.handle( ChangeSwitchCommunicator, async ( switchIndex ) => {
            const swtch = this.world.gameState?.SwitchArray?.[ switchIndex ];
            
            if( !swtch )
                return Log.warn( `Cannot change switch as it could not be found.` );

            const character = await this.world.getCharacter();
            if( !character )
                return Log.warn( `Cannot change switch as no character could be found.` );

            const latestSwitch = await query.query( switchQuery!, swtch );
            if( !latestSwitch )
                return Log.warn( `Cannot change switch as it's state could not be retrieved.` );

            if( latestSwitch.switchstate == 0 )
                character?.ServerSwitchUp( swtch );
            else if( latestSwitch.switchstate == 1 )
                character?.ServerSwitchDown( swtch );
        } );

        controller.communicator.handle( SetControlsCommunicator, async ( index, type, value ) => {
            const frameCar = this.world.gameState?.FrameCarArray?.[ index ];
            
            if( !frameCar )
                return Log.warn( `Cannot change controls as the framecar could not be found.` );

            const character = await this.world.getCharacter();
            if( !character )
                return Log.warn( `Cannot change controls as no character could be found.` );

            switch( type ) {
                case FrameCarControl.Brake: {
                    if( frameCar.MyBrake == null )
                        break;
                    await character.ServerSetRaycastBake( frameCar.MyBrake, value );
                    break;
                }
                case FrameCarControl.Regulator: {
                    if( frameCar.MyRegulator == null )
                        break;
                    await character.ServerSetRaycastRegulator( frameCar.MyRegulator, value );
                    break;
                }
                case FrameCarControl.Reverser: {
                    if( frameCar.MyReverser == null )
                        break;
                    await character.ServerSetRaycastReverser( frameCar.MyReverser, value );
                    break;
                }
                case FrameCarControl.Whistle: {
                    if( frameCar.Mywhistle == null )
                        break;
                    await frameCar.SetWhistle( value );
                    await character.ServerSetRaycastWhistle( frameCar.Mywhistle, value );
                    break;
                }
                case FrameCarControl.Generator: {
                    if( frameCar.Myhandvalvegenerator == null )
                        break;
                    await character.ServerSetRaycastHandvalve( frameCar.Myhandvalvegenerator, value );
                    break;
                }
                case FrameCarControl.Compressor: {
                    if( frameCar.Myhandvalvecompressor == null )
                        break;
                    await character.ServerSetRaycastHandvalve( frameCar.Myhandvalvecompressor, value );
                    break;
                }
            }
        } );
    }
    
    public unload( controller: IPluginController ): void | Promise<void> {
        throw new Error( 'Method not implemented.' );
    }
}