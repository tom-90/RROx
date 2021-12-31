import { Action } from "./action";
import { promises as fs } from "fs";
import path from "path";
import { PipeType } from "../pipes";
import axios from "axios";
import FormData from "form-data";
import { Cars } from "../../shared/cars";

export class MinizwergColorsAction extends Action<string, [ share: true ] | [ share: false, code: string ]> {

    public actionID   = 0; // Not used
    public actionName = 'Minizwerg color sharing';
    public pipes      = [] as PipeType[];

    public readonly server = 'https://minizwerg.online';

    protected async execute( share: boolean, code?: string ): Promise<string> {

        if( share ) {
            let res = await axios.post( `${this.server}/api.php`, { colors: {
                ce_flatcar_logs    : this.app.settings.get( `colors.${Cars.FLATCAR_LOGS}.unloaded`     ),
                cf_flatcar_logs    : this.app.settings.get( `colors.${Cars.FLATCAR_LOGS}.loaded`       ),
                ce_flatcar_cordwood: this.app.settings.get( `colors.${Cars.FLATCAR_CORDWOOD}.unloaded` ),
                cf_flatcar_cordwood: this.app.settings.get( `colors.${Cars.FLATCAR_CORDWOOD}.loaded`   ),
                ce_flatcar_stakes  : this.app.settings.get( `colors.${Cars.FLATCAR_STAKES}.unloaded`   ),
                cf_flatcar_stakes  : this.app.settings.get( `colors.${Cars.FLATCAR_STAKES}.loaded`     ),
                ce_flatcar_hopper  : this.app.settings.get( `colors.${Cars.HOPPER}.unloaded`           ),
                cf_flatcar_hopper  : this.app.settings.get( `colors.${Cars.HOPPER}.loaded`             ),
                ce_flatcar_tanker  : this.app.settings.get( `colors.${Cars.TANKER}.unloaded`           ),
                cf_flatcar_tanker  : this.app.settings.get( `colors.${Cars.TANKER}.loaded`             ),
                ce_boxcar          : this.app.settings.get( `colors.${Cars.BOXCAR}.unloaded`           ),
                cf_boxcar          : this.app.settings.get( `colors.${Cars.BOXCAR}.loaded`             ),
                ce_caboose         : this.app.settings.get( `colors.${Cars.CABOOSE}`                   ),
                cf_caboose         : this.app.settings.get( `colors.${Cars.CABOOSE}`                   ),
            } } );

            if ( res.status !== 200 || !res.data?.code )
                throw new Error( 'Failed to send colors to minizwerg' );

            return res.data.code;
        }

        let url = new URL( '/api.php', this.server );
        url.searchParams.append( 'code', code );

        let res = await axios.get( url.toString() );

        if ( res.status !== 200 || !res.data?.colors )
            throw new Error( 'Failed to retrieve colors from minizwerg' );

        this.app.settings.set( `colors.${Cars.FLATCAR_LOGS}.unloaded`    , res.data.colors[ 'ce_flatcar_logs' ]     );
        this.app.settings.set( `colors.${Cars.FLATCAR_LOGS}.loaded`      , res.data.colors[ 'cf_flatcar_logs' ]     );
        this.app.settings.set( `colors.${Cars.FLATCAR_CORDWOOD}.unloaded`, res.data.colors[ 'ce_flatcar_cordwood' ] );
        this.app.settings.set( `colors.${Cars.FLATCAR_CORDWOOD}.loaded`  , res.data.colors[ 'cf_flatcar_cordwood' ] );
        this.app.settings.set( `colors.${Cars.FLATCAR_STAKES}.unloaded`  , res.data.colors[ 'ce_flatcar_stakes' ]   );
        this.app.settings.set( `colors.${Cars.FLATCAR_STAKES}.loaded`    , res.data.colors[ 'cf_flatcar_stakes' ]   );
        this.app.settings.set( `colors.${Cars.HOPPER}.unloaded`          , res.data.colors[ 'ce_flatcar_hopper' ]   );
        this.app.settings.set( `colors.${Cars.HOPPER}.loaded`            , res.data.colors[ 'cf_flatcar_hopper' ]   );
        this.app.settings.set( `colors.${Cars.TANKER}.unloaded`          , res.data.colors[ 'ce_flatcar_tanker' ]   );
        this.app.settings.set( `colors.${Cars.TANKER}.loaded`            , res.data.colors[ 'cf_flatcar_tanker' ]   );
        this.app.settings.set( `colors.${Cars.BOXCAR}.unloaded`          , res.data.colors[ 'ce_boxcar' ]           );
        this.app.settings.set( `colors.${Cars.BOXCAR}.loaded`            , res.data.colors[ 'cf_boxcar' ]           );
        this.app.settings.set( `colors.${Cars.CABOOSE}`                  , res.data.colors[ 'ce_caboose' ]          );

        return code;
    }

    private getFilePath( slot: number ) {
        return path.resolve( process.env.LOCALAPPDATA, "arr/saved/savegames", `slot${slot}.sav` );
    }

}