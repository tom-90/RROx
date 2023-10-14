import WorldPlugin from ".";
import { ILocation2D, Log } from "../shared";
import * as Throttle from 'promise-parallel-throttle';
import tmp from 'tmp';
import fs from 'fs';
import * as MainStructs from './structs/main-UE4';
import { Actions, InOutParam } from "@rrox/api";
import { Structs } from "./structs/types";

interface HeightMapperInstances {
    kismet: MainStructs.Engine.UKismetSystemLibrary;
    start: MainStructs.CoreUObject.FVector;
    end: MainStructs.CoreUObject.FVector;
    hitResult: MainStructs.Engine.FHitResult;
    color1: MainStructs.CoreUObject.FLinearColor;
    color2: MainStructs.CoreUObject.FLinearColor;
    world: Structs.UWorld;
}

export class HeightMapper {

    // Vars for LakeValley map:
    private readonly mapTopLeftX = 197500;
    private readonly mapTopLeftY = 194000;
    private readonly mapBottomRightX = -197500;
    private readonly mapBottomRightY = -194000;
    private readonly traceHeight = 21000; // Should be higher than the highest point on the map, but lower than the skybox
    private readonly precision = 500;

    constructor( private plugin: WorldPlugin ) {}

    public getCurrentCoordinates() {
        const world = this.plugin.world.valueProvider.getValue();

        for(const player of world?.players ?? []) {
            Log.info(`Location of ${player.name}: X=${player.location.X}, Y=${player.location.Y}, Z=${player.location.Z}`);
        }
    }

    public async extractHeights() {
        const parallel = 50;
        const instances: HeightMapperInstances[] = [];
        for(let i = 0; i < parallel; i++) {
            instances.push(await this.prepareHeightQuery());
        }
        
        Log.info('Instances prepared');

        let heights: ((instance: HeightMapperInstances) => Promise<readonly [number, number, number | null]>)[] = [];

        for(let X = this.mapBottomRightX; X <= this.mapTopLeftX; X += this.precision) {
            for(let Y = this.mapBottomRightY; Y <= this.mapTopLeftY; Y += this.precision) {
                heights.push((instance: HeightMapperInstances) => this.getHeightOptimized({
                    X,
                    Y,
                }, instance).then((Z) => [X, Y, Z ? Math.round(Z) : Z] as const));
            }
        }

        // Debugging on a small slice: heights = heights.slice(0, 15000);

        const results: (readonly [number, number, number | null])[] = [];

        await new Promise<void>((resolve, reject) => {
            let rejected = false;

            const execute = () => {
                if(instances.length === 0 || rejected) {
                    return;
                }

                if(heights.length === 0 && instances.length === parallel) {
                    return resolve();
                }

                if(heights.length === 0) {
                    return;
                }

                if(heights.length % 1000 === 0) {
                    Log.info(`${heights.length} heights left`);
                }

                const instance = instances.shift()!;
                const fn = heights.shift()!;

                let retries = 0;

                const tryExec = () => {
                    fn(instance).then((result) => {
                        results.push(result);
                        instances.push(instance);
                        execute();
                    }).catch((err) => {
                        if(err.message && err.message.includes('timed out') && err.message.includes('GetDataResponse') && retries < 10) {
                            Log.info('Timeout. Trying again...');
                            retries++;
                            tryExec();
                            return;
                        }
                        rejected = true;
                        reject(err);
                    });
                }

                tryExec();
            }

            while(instances.length > 0) {
                execute();
            }
        });

        const res = tmp.fileSync();
        fs.writeFileSync(res.fd, ['X,Y,Z'].concat(results.map(([X, Y, Z]) => `${X},${Y},${Z}`)).join('\n'));

        Log.info(res.name);
    }

    private async prepareHeightQuery(): Promise<HeightMapperInstances> {
        const data = this.plugin.controller.getAction( Actions.QUERY );

        const kismet = await this.plugin.world.getKismetSystemLibrary();
        if(!kismet)
            throw new Error('Could not get KismetSystemLibrary');

        const world = await this.plugin.world.getWorld();
        if(!world)
            throw new Error('Could not get world');

        const start = await data.create( this.plugin.world.structs.CoreUObject.FVector );
        const end = await data.create( this.plugin.world.structs.CoreUObject.FVector );

        const hitResult = await data.create( this.plugin.world.structs.Engine.FHitResult );

        const color1 = await data.create( this.plugin.world.structs.CoreUObject.FLinearColor );
        const color2 = await data.create( this.plugin.world.structs.CoreUObject.FLinearColor );

        return {
            kismet,
            start,
            end,
            hitResult,
            color1,
            color2,
            world,
        };
    }

    private async getHeightOptimized(position: ILocation2D, { start, end, kismet, hitResult, color1, color2, world }: HeightMapperInstances) {
        // Optimized height call with reused struct instances such that we only have a single async operation.

        start.X = position.X;
        start.Y = position.Y;
        start.Z = this.traceHeight;

        end.X = position.X;
        end.Y = position.Y;
        end.Z = 0;

        const result = new InOutParam( hitResult );

        const hasHit = await kismet.LineTraceSingle(
            world.ARRGameState,
            start,
            end,
            this.plugin.world.structs.Engine.ETraceTypeQuery.TraceTypeQuery1,
            false,
            new InOutParam( [] ),
            this.plugin.world.structs.Engine.EDrawDebugTrace.None,
            result,
            false,
            color1,
            color2,
            0
        );

        if( !hasHit || !result.out )
            return null;

        return result.out.ImpactPoint.Z;
    }
}