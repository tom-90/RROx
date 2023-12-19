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
	WAYCAR = 'waycar',
	MONTEZUMA = 'montezuma',
	MONTEZUMA_TENDER = 'montezuma_tender',
	GLENBROOK = 'glenbrook',
    GLENBROOK_TENDER = 'glenbrook_tender',
	SHAY = 'shay',
	BALDWIN622D = '622D',
    MOSCA = 'mosca',
    MOSCA_TENDER = 'mosca_tender',
	COOKE280 = 'cooke280',
    COOKE280_TENDER = 'cooke280_tender',
	PLOW = 'plow',
	SKELETONCAR = 'skeletoncar',
	HOPPERBB = 'hopperBB',
	TANKERNCO = 'tankcarNCO',
	STOCKCAR = 'stockcar',
	TENMILE = 'tenmile',
	RUBYBASIN = 'rubybasin',
	COOKE260COAL = 'cooke260_new',
	COOKE260COAL_TENDER = 'cooke260_new_tender',
	TWEETSIE280 = 'tweetsie280',
	TWEETSIE280_TENDER = 'tweetsie280_tender',
	PLANTATIONCAR_FLATCAR = 'plantationcar_flatcar',
	PLANTATIONCAR_FLATCAR_LOGS = 'plantationcar_flatcar_logs',
	PLANTATIONCAR_FLATCAR_STAKES= 'plantationcar_flatcar_stakes',
	PLANTATIONCAR_FLATCAR_STAKES_BULKHEAD = 'plantationcar_flatcar_stakes_bulkhead',
	PLANTATIONCAR_HOPPER_SMALL = 'plantationcar_hopper_small',
	PLANTATIONCAR_HOPPER_MEDIUM = 'plantationcar_hopper_medium',
	PLANTATIONCAR_HOPPER_LARGE = 'plantationcar_hopper_large',
	PLANTATIONCAR_TANKER = 'plantationcar_tanker',
	PLANTATIONCAR_BOXCAR = 'plantationcar_boxcar',
	COACH_DSPRR_1 = 'coach_dsprr_1',
	COACH_DSPRR_2 = 'coach_dsprr_2',
	LIMA280 = 'lima280',
	LIMA280_TENDER = 'lima280_tender',
	VENTILATED_BOXCAR_CC = 'VentilatedBoxcarCC',
	WATERCAR = 'WaterCar',
	FERRIES_242_T = 'Ferries242T',
	OAHU_WATER_CAR = 'OahuWaterCar',
	
    UNKNOWN = 'unknown',
}

export type EngineFrameCarType = FrameCarType.PORTER | FrameCarType.PORTER2 | FrameCarType.HANDCAR | FrameCarType.EUREKA |
        FrameCarType.EUREKA_TENDER | FrameCarType.CLIMAX | FrameCarType.HEISLER | FrameCarType.CLASS70 | FrameCarType.CLASS70_TENDER | FrameCarType.COOKE260 | FrameCarType.COOKE260_TENDER |
		FrameCarType.MONTEZUMA | FrameCarType.MONTEZUMA_TENDER | FrameCarType.GLENBROOK | FrameCarType.GLENBROOK_TENDER | FrameCarType.SHAY |
		FrameCarType.BALDWIN622D | FrameCarType.MOSCA | FrameCarType.COOKE280 | FrameCarType.TENMILE | FrameCarType.RUBYBASIN | 
		FrameCarType.COOKE260COAL | FrameCarType.COOKE260COAL_TENDER | FrameCarType.TWEETSIE280 | FrameCarType.TWEETSIE280_TENDER | FrameCarType.LIMA280 | FrameCarType.LIMA280_TENDER | FrameCarType.FERRIES_242_T;


export type FreightFrameCarType = FrameCarType.BOXCAR | FrameCarType.FLATCAR_CORDWOOD | FrameCarType.HOPPER | FrameCarType.FLATCAR_LOGS |
        FrameCarType.FLATCAR_STAKES | FrameCarType.TANKER | FrameCarType.SKELETONCAR | FrameCarType.HOPPERBB | FrameCarType.TANKERNCO | FrameCarType.STOCKCAR |
		FrameCarType.PLANTATIONCAR_FLATCAR | FrameCarType.PLANTATIONCAR_FLATCAR_LOGS | FrameCarType.PLANTATIONCAR_FLATCAR_STAKES | 
		FrameCarType.PLANTATIONCAR_FLATCAR_STAKES_BULKHEAD | FrameCarType.PLANTATIONCAR_HOPPER_SMALL | FrameCarType.PLANTATIONCAR_HOPPER_MEDIUM | 
		FrameCarType.PLANTATIONCAR_HOPPER_LARGE | FrameCarType.PLANTATIONCAR_TANKER | FrameCarType.PLANTATIONCAR_BOXCAR |
		FrameCarType.VENTILATED_BOXCAR_CC | FrameCarType.WATERCAR | FrameCarType.OAHU_WATER_CAR;