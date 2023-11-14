import { Actions, IPluginController, IQuery, SettingsStore, StructConstructor } from "@rrox/api";
import WorldPlugin from ".";
import { ICheats, IWorldSettings } from "../shared";
import { Structs } from "./structs/types";

export class Cheats {
    private pawnQuery: IQuery<Structs.APlayerState>;
    private cheatsQuery: IQuery<Structs.ASCharacter>;

    private fastSprintPlayers = new Map<Structs.ASCharacter, number>();;

    private interval: NodeJS.Timeout;

    constructor( private plugin: WorldPlugin, private settings: SettingsStore<IWorldSettings> ) {}

    public async prepare() {
        const data = this.plugin.controller.getAction( Actions.QUERY );

        this.pawnQuery = await data.prepareQuery( this.plugin.world.structs.Engine.APlayerState, ( player ) => [
            player.PawnPrivate
        ] );

        this.cheatsQuery = await data.prepareQuery( this.plugin.world.structs.arr.ASCharacter as StructConstructor<Structs.ASCharacter>, ( char ) => [
            char.CharacterMovement.MaxFlySpeed,
            char.CharacterMovement.MaxWalkSpeed,
            char.CharacterMovement.MovementMode,
        ] );
    }

    public start() {
        this.stop();

        const data = this.plugin.controller.getAction( Actions.QUERY );

        this.interval = setInterval( async () => {
            if( !this.settings.get( 'features.cheats' ) ) {
                this.fastSprintPlayers.clear();
            }

            for( let [ character, speed ] of this.fastSprintPlayers ) {
                const latestData = await data.query( this.cheatsQuery, character );
                if( !latestData || latestData.CharacterMovement.MaxWalkSpeed === 200 )
                    continue;

                latestData.CharacterMovement.MaxWalkSpeed = speed;

                await data.save( latestData.CharacterMovement );
            }
        }, 500 );
    }

    public stop() {
        clearInterval( this.interval );
        this.fastSprintPlayers.clear();
    }

    private async getCharacter( player: Structs.APlayerState ): Promise<Structs.ASCharacter> {
        const data = this.plugin.controller.getAction( Actions.QUERY );

        let pawn: Structs.APawn;
        if( player.PawnPrivate )
            pawn = player.PawnPrivate;
        else {
            const p = await data.query( this.pawnQuery, player );
            if( !p?.PawnPrivate )
                throw new Error( 'Could not find player to get cheats for.' );

            pawn = player.PawnPrivate;
        }
        
        const character = await data.cast( pawn, this.plugin.world.structs.arr.ASCharacter as StructConstructor<Structs.ASCharacter> );

        if( !character )
            throw new Error( 'Could not find character to get cheats for.' );

        const cheats = await data.query( this.cheatsQuery, character );

        if( !cheats || !cheats.CharacterMovement )
            throw new Error( 'Could not retrieve character cheats.' );

        return cheats;
    }

    public async getCheats( player: Structs.APlayerState ): Promise<ICheats> {
        const data = this.plugin.controller.getAction( Actions.QUERY );

        const character = await this.getCharacter( player );

        const fastSprintKey = Array.from( this.fastSprintPlayers.keys() ).find( ( p ) => data.equals( p, character ) );
    
        return {
            flySpeed: character.CharacterMovement.MovementMode === this.plugin.world.structs.Engine.EMovementMode.MOVE_Flying ? character.CharacterMovement.MaxFlySpeed : undefined,
            walkSpeed: fastSprintKey ? this.fastSprintPlayers.get(fastSprintKey) : undefined,
        }
    }

    public async setCheats( player: Structs.APlayerState, cheats: ICheats ): Promise<void> {
        if( !this.settings.get( 'features.cheats' ) )
            return;

        const data = this.plugin.controller.getAction( Actions.QUERY );

        const character = await this.getCharacter( player );
    
        if( cheats.flySpeed ) {
            character.CharacterMovement.MovementMode = this.plugin.world.structs.Engine.EMovementMode.MOVE_Flying;
            character.CharacterMovement.MaxFlySpeed = cheats.flySpeed;
        } else {
            character.CharacterMovement.MovementMode = this.plugin.world.structs.Engine.EMovementMode.MOVE_Walking;
        }

        const keys = Array.from( this.fastSprintPlayers.keys() ).filter( ( p ) => data.equals( p, character ) );
        for( let key of keys )
            this.fastSprintPlayers.delete( key );

        if( cheats.walkSpeed ) {
            this.fastSprintPlayers.set( character, cheats.walkSpeed );
        }

        await data.save( character.CharacterMovement );
    }

    public async setMoneyXP( player: Structs.APlayerState, money?: number, xp?: number ): Promise<void> {
        if( !this.settings.get( 'features.cheats' ) )
            return;

        const data = this.plugin.controller.getAction( Actions.QUERY );

        const character = await this.getCharacter( player );

        if( money )
            await character.ChangePlayerMoney( money );
        if( xp )
            await character.ChangePlayerXP( xp );

        await data.save( character.CharacterMovement );
    }
}