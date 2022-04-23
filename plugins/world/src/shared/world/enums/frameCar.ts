export enum FrameCarType {
    PORTER = 'porter_040',
    PORTER2 = 'porter_042',
    HANDCAR = 'handcar',
    EUREKA = 'eureka',
    EUREKA_TENDER = 'eureka_tender',
    CLIMAX = 'climax',
    HEISLER = 'heisler',
    CLASS70 = 'class70',
    CLASS70_TENDER = 'class70_tender',
    COOKE260 = 'cooke260',
    COOKE260_TENDER = 'cooke260_tender',
    BOXCAR = 'boxcar',
    FLATCAR_CORDWOOD = 'flatcar_cordwood',
    HOPPER = 'flatcar_hopper',
    FLATCAR_LOGS = 'flatcar_logs',
    FLATCAR_STAKES = 'flatcar_stakes',
    TANKER = 'flatcar_tanker',
    CABOOSE = 'caboose',
}

export type EngineFrameCarType = FrameCarType.PORTER | FrameCarType.PORTER2 | FrameCarType.HANDCAR | FrameCarType.EUREKA |
        FrameCarType.EUREKA_TENDER | FrameCarType.CLIMAX | FrameCarType.HEISLER | FrameCarType.CLASS70 | FrameCarType.CLASS70_TENDER;

export type FreightFrameCarType = FrameCarType.BOXCAR | FrameCarType.FLATCAR_CORDWOOD | FrameCarType.HOPPER | FrameCarType.FLATCAR_LOGS |
        FrameCarType.FLATCAR_STAKES | FrameCarType.TANKER;