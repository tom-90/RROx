import { APlayerState } from "./Engine";
import { ASplineActor, ASplineTrack, ASwitch, Aframecar, Aindustry, Asandhouse, Aturntable, Awatertower } from "./arr";

export interface IWorldObjects {
    players: APlayerState[];
    frameCars: Aframecar[];
    switches: ASwitch[];
    turntables: Aturntable[];
    watertowers: Awatertower[];
    sandhouses: Asandhouse[];
    industries: Aindustry[];
    splines: ASplineActor[];
    splineTracks: ASplineTrack[];
}