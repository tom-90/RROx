import React from "react";

export enum TrackTypes{
    none,
    track_horizontal,
    track_vertical,
    track_diagonal_left,
    track_diagonal_right,
    track_cross,
    switch_horizontal_top_left,
    switch_horizontal_top_right,
    switch_horizontal_bottom_left,
    switch_horizontal_bottom_right,
    switch_vertical_top_left,
    switch_vertical_top_right,
    switch_vertical_bottom_left,
    switch_vertical_bottom_right,
    switch_diagonal_left_left,
    switch_diagonal_left_right,
    switch_diagonal_left_top,
    switch_diagonal_left_bottom,
    switch_diagonal_right_left,
    switch_diagonal_right_right,
    switch_diagonal_right_top,
    switch_diagonal_right_bottom,
    corner_top_bottom_left,
    corner_top_bottom_right,
    corner_bottom_top_left,
    corner_bottom_top_right,
    corner_left_top_right,
    corner_left_bottom_right,
    corner_right_top_left,
    corner_right_bottom_left,
    end_left,
    end_right,
    end_top,
    end_bottom,
}

export function TrackPieces({ trackKey, type, x, y, width, height, switchState }: {
    trackKey: number,
    type: TrackTypes,
    x : number,
    y : number,
    width : number,
    height : number
    switchState?: boolean
}){
    const trackActiveColor = "black";
    const trackInactiveColor = "red";
    
    switch (type){
        case TrackTypes.track_horizontal:
            return (<g key={'layout-square-content-'+trackKey}>
                <line x1={x} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.track_vertical:
            return (<g key={'layout-square-content-'+trackKey}>
                <line x1={x + (width/2)} y1={y} x2={x + (width/2)} y2={y + height} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.track_diagonal_left:
            return (<g key={'layout-square-content-'+trackKey}>
                    <line x1={x} y1={y} x2={x + width} y2={y + height} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.track_diagonal_right:
            return (<g key={'layout-square-content-'+trackKey}>
                    <line x1={x + width} y1={y} x2={x} y2={y + height} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.switch_horizontal_bottom_left:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x} y1={y + (height/2)} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
                {!switchState && <g>
                    <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke={trackActiveColor} />
                    <line x1={x + (width/2)} y1={y + (height/2)} x2={x} y2={y + height} stroke={trackInactiveColor} />
                </g>}
                {switchState && <g>
                    <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke={trackInactiveColor} />
                    <line x1={x + (width/2)} y1={y + (height/2)} x2={x} y2={y + height} stroke={trackActiveColor} />
                </g>}
            </g>);
        case TrackTypes.switch_horizontal_bottom_right:
            return (<g key={'layout-square-content-'+trackKey} style={{zIndex: 50}}>
                <line x1={x} y1={y + (height/2)} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
                {!switchState && <g>
                    <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke={trackActiveColor} />
                    <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y + height} stroke={trackInactiveColor} />
                </g>}
                {switchState && <g>
                    <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke={trackInactiveColor} />
                    <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y + height} stroke={trackActiveColor} />
                </g>}
            </g>);
        case TrackTypes.switch_horizontal_top_left:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x} y1={y + (height/2)} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
                {!switchState && <g>
                    <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke={trackActiveColor} />
                    <line x1={x + (width/2)} y1={y + (height/2)} x2={x} y2={y} stroke={trackInactiveColor} />
                </g>}
                {switchState && <g>
                    <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke={trackInactiveColor} />
                    <line x1={x + (width/2)} y1={y + (height/2)} x2={x} y2={y} stroke={trackActiveColor} />
                </g>}
            </g>);
        case TrackTypes.switch_horizontal_top_right:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke={trackActiveColor} />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x} y2={y} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.switch_vertical_bottom_left:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x + (width/2)} y1={y} x2={x + (width/2)} y2={y + height} stroke={trackActiveColor} />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y + height} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.switch_vertical_bottom_right:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x + (width/2)} y1={y} x2={x + (width/2)} y2={y + height} stroke={trackActiveColor} />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x} y2={y + height} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.switch_vertical_top_left:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x + (width/2)} y1={y} x2={x + (width/2)} y2={y + height} stroke={trackActiveColor} />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.switch_vertical_top_right:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x + (width/2)} y1={y} x2={x + (width/2)} y2={y + height} stroke={trackActiveColor} />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x} y2={y} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.switch_diagonal_left_left:
            return (<g key={'layout-square-content-'+trackKey} >
                <line key={'layout-square-content-'+trackKey} x1={x} y1={y} x2={x + width} y2={y + height} stroke={trackActiveColor} />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x} y2={y + (height/2)} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.switch_diagonal_left_right:
            return (<g key={'layout-square-content-'+trackKey} >
                <line key={'layout-square-content-'+trackKey} x1={x} y1={y} x2={x + width} y2={y + height} stroke={trackActiveColor} />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.switch_diagonal_left_top:
            return (<g key={'layout-square-content-'+trackKey} >
                <line key={'layout-square-content-'+trackKey} x1={x} y1={y} x2={x + width} y2={y + height} stroke={trackActiveColor} />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + (width/2)} y2={y} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.switch_diagonal_left_bottom:
            return (<g key={'layout-square-content-'+trackKey} >
                <line key={'layout-square-content-'+trackKey} x1={x} y1={y} x2={x + width} y2={y + height} stroke={trackActiveColor} />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + (width/2)} y2={y + height} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.switch_diagonal_right_left:
            return (<g key={'layout-square-content-'+trackKey} >
                <line key={'layout-square-content-'+trackKey} x1={x + width} y1={y} x2={x} y2={y + height} stroke={trackActiveColor} />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x} y2={y + (height/2)} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.switch_diagonal_right_right:
            return (<g key={'layout-square-content-'+trackKey} >
                <line key={'layout-square-content-'+trackKey} x1={x + width} y1={y} x2={x} y2={y + height} stroke={trackActiveColor} />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.switch_diagonal_right_top:
            return (<g key={'layout-square-content-'+trackKey} >
                <line key={'layout-square-content-'+trackKey} x1={x + width} y1={y} x2={x} y2={y + height} stroke={trackActiveColor} />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + (width/2)} y2={y} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.switch_diagonal_right_bottom:
            return (<g key={'layout-square-content-'+trackKey} >
                <line key={'layout-square-content-'+trackKey} x1={x + width} y1={y} x2={x} y2={y + height} stroke={trackActiveColor} />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + (width/2)} y2={y + height} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.corner_top_bottom_left:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x + (width/2)} y1={y} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x} y2={y + height} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.corner_top_bottom_right:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x + (width/2)} y1={y} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y + height} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.corner_bottom_top_left:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x + (width/2)} y1={y + height} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
                <line x1={x} y1={y} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.corner_bottom_top_right:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x + (width/2)} y1={y + height} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
                <line x1={x + width} y1={y} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.corner_left_top_right:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x} y1={y + (height/2)} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
                <line x1={x + width} y1={y} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.corner_left_bottom_right:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x} y1={y + (height/2)} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
                <line x1={x + width} y1={y + height} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.corner_right_top_left:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x + width} y1={y + (height/2)} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
                <line x1={x} y1={y} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.corner_right_bottom_left:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x + width} y1={y + (height/2)} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
                <line x1={x} y1={y + height} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.track_cross:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke={trackActiveColor} />
                <line x1={x + (width/2)} y1={y} x2={x + (width/2)} y2={y + height} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.end_right:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x} y1={y + (height/2)} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
                <line x1={x + (width/2)} y1={y + (height/4)} x2={x + (width/2)} y2={y + (height - (height/4))} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.end_left:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke={trackActiveColor} />
                <line x1={x + (width/2)} y1={y + (height/4)} x2={x + (width/2)} y2={y + (height - (height/4))} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.end_top:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x + (width/2)} y1={y} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
                <line x1={x + (width/4)} y1={y + (height/2)} x2={x + (width - (width/4)) } y2={y + (height/2)} stroke={trackActiveColor} />
            </g>);
        case TrackTypes.end_bottom:
            return (<g key={'layout-square-content-'+trackKey} >
                <line x1={x + (width/2)} y1={y + height} x2={x + (width/2)} y2={y + (height/2)} stroke={trackActiveColor} />
                <line x1={x + (width/4)} y1={y + (height/2)} x2={x + (width - (width/4)) } y2={y + (height/2)} stroke={trackActiveColor} />
            </g>);
        default:
            return (<g key={'layout-square-content-' + trackKey}/>);
    }
}

// Example Layout
// {"0":{"trackType":0},"1":{"trackType":0},"2":{"trackType":0},"3":{"trackType":1},"4":{"trackType":0},"5":{"trackType":0},"6":{"trackType":0},"7":{"trackType":0},"8":{"trackType":0},"9":{"trackType":0},"10":{"trackType":0},"11":{"trackType":0},"12":{"trackType":0},"13":{"trackType":0},"14":{"trackType":0},"15":{"trackType":0},"16":{"trackType":0},"17":{"trackType":0},"18":{"trackType":0},"19":{"trackType":0},"20":{"trackType":0},"21":{"trackType":0},"22":{"trackType":0},"23":{"trackType":1},"24":{"trackType":0},"25":{"trackType":0},"26":{"trackType":0},"27":{"trackType":0},"28":{"trackType":0},"29":{"trackType":0},"30":{"trackType":0},"31":{"trackType":0},"32":{"trackType":0},"33":{"trackType":0},"34":{"trackType":0},"35":{"trackType":0},"36":{"trackType":0},"37":{"trackType":0},"38":{"trackType":0},"39":{"trackType":0},"40":{"trackType":0},"41":{"trackType":0},"42":{"trackType":0},"43":{"trackType":1},"44":{"trackType":0},"45":{"trackType":0},"46":{"trackType":0},"47":{"trackType":0},"48":{"trackType":0},"49":{"trackType":0},"50":{"trackType":0},"51":{"trackType":0},"52":{"trackType":0},"53":{"trackType":0},"54":{"trackType":0},"55":{"trackType":0},"56":{"trackType":0},"57":{"trackType":0},"58":{"trackType":0},"59":{"trackType":0},"60":{"trackType":0},"61":{"trackType":0},"62":{"trackType":0},"63":{"trackType":1},"64":{"trackType":0},"65":{"trackType":0},"66":{"trackType":0},"67":{"trackType":0},"68":{"trackType":0},"69":{"trackType":0},"70":{"trackType":0},"71":{"trackType":0},"72":{"trackType":0},"73":{"trackType":0},"74":{"trackType":0},"75":{"trackType":0},"76":{"trackType":0},"77":{"trackType":0},"78":{"trackType":0},"79":{"trackType":0},"80":{"trackType":0},"81":{"trackType":0},"82":{"trackType":0},"83":{"trackType":1},"84":{"trackType":0},"85":{"trackType":0},"86":{"trackType":0},"87":{"trackType":0},"88":{"trackType":0},"89":{"trackType":0},"90":{"trackType":0},"91":{"trackType":0},"92":{"trackType":0},"93":{"trackType":0},"94":{"trackType":0},"95":{"trackType":0},"96":{"trackType":0},"97":{"trackType":0},"98":{"trackType":0},"99":{"trackType":0},"100":{"trackType":0},"101":{"trackType":0},"102":{"trackType":0},"103":{"trackType":1},"104":{"trackType":0},"105":{"trackType":0},"106":{"trackType":0},"107":{"trackType":0},"108":{"trackType":0},"109":{"trackType":0},"110":{"trackType":0},"111":{"trackType":0},"112":{"trackType":0},"113":{"trackType":0},"114":{"trackType":0},"115":{"trackType":0},"116":{"trackType":0},"117":{"trackType":0},"118":{"trackType":0},"119":{"trackType":0},"120":{"trackType":0},"121":{"trackType":0},"122":{"trackType":0},"123":{"trackType":1},"124":{"trackType":0},"125":{"trackType":0},"126":{"trackType":0},"127":{"trackType":0},"128":{"trackType":0},"129":{"trackType":0},"130":{"trackType":0},"131":{"trackType":0},"132":{"trackType":0},"133":{"trackType":0},"134":{"trackType":0},"135":{"trackType":0},"136":{"trackType":0},"137":{"trackType":0},"138":{"trackType":0},"139":{"trackType":0},"140":{"trackType":0},"141":{"trackType":0},"142":{"trackType":0},"143":{"trackType":1},"144":{"trackType":0},"145":{"trackType":0},"146":{"trackType":0},"147":{"trackType":0},"148":{"trackType":0},"149":{"trackType":0},"150":{"trackType":0},"151":{"trackType":0},"152":{"trackType":0},"153":{"trackType":0},"154":{"trackType":0},"155":{"trackType":0},"156":{"trackType":0},"157":{"trackType":0},"158":{"trackType":0},"159":{"trackType":0},"160":{"trackType":0},"161":{"trackType":0},"162":{"trackType":0},"163":{"trackType":1},"164":{"trackType":0},"165":{"trackType":0},"166":{"trackType":0},"167":{"trackType":0},"168":{"trackType":0},"169":{"trackType":0},"170":{"trackType":0},"171":{"trackType":0},"172":{"trackType":0},"173":{"trackType":0},"174":{"trackType":0},"175":{"trackType":0},"176":{"trackType":0},"177":{"trackType":0},"178":{"trackType":0},"179":{"trackType":0},"180":{"trackType":0},"181":{"trackType":0},"182":{"trackType":0},"183":{"trackType":1},"184":{"trackType":0},"185":{"trackType":0},"186":{"trackType":0},"187":{"trackType":0},"188":{"trackType":0},"189":{"trackType":0},"190":{"trackType":0},"191":{"trackType":0},"192":{"trackType":0},"193":{"trackType":0},"194":{"trackType":0},"195":{"trackType":0},"196":{"trackType":0},"197":{"trackType":0},"198":{"trackType":0},"199":{"trackType":0},"200":{"trackType":0},"201":{"trackType":0},"202":{"trackType":0},"203":{"trackType":1},"204":{"trackType":0},"205":{"trackType":0},"206":{"trackType":0},"207":{"trackType":0},"208":{"trackType":0},"209":{"trackType":0},"210":{"trackType":0},"211":{"trackType":0},"212":{"trackType":0},"213":{"trackType":0},"214":{"trackType":0},"215":{"trackType":0},"216":{"trackType":0},"217":{"trackType":0},"218":{"trackType":0},"219":{"trackType":0},"220":{"trackType":0},"221":{"trackType":0},"222":{"trackType":0},"223":{"trackType":8},"224":{"trackType":0},"225":{"trackType":0},"226":{"trackType":0},"227":{"trackType":0},"228":{"trackType":0},"229":{"trackType":0},"230":{"trackType":0},"231":{"trackType":0},"232":{"trackType":0},"233":{"trackType":0},"234":{"trackType":0},"235":{"trackType":0},"236":{"trackType":0},"237":{"trackType":0},"238":{"trackType":0},"239":{"trackType":0},"240":{"trackType":0},"241":{"trackType":0},"242":{"trackType":0},"243":{"trackType":1},"244":{"trackType":15},"245":{"trackType":0},"246":{"trackType":0},"247":{"trackType":0},"248":{"trackType":0},"249":{"trackType":0},"250":{"trackType":0},"251":{"trackType":0},"252":{"trackType":0},"253":{"trackType":0},"254":{"trackType":0},"255":{"trackType":0},"256":{"trackType":0},"257":{"trackType":0},"258":{"trackType":0},"259":{"trackType":0},"260":{"trackType":0},"261":{"trackType":0},"262":{"trackType":0},"263":{"trackType":1},"264":{"trackType":1},"265":{"trackType":15},"266":{"trackType":0},"267":{"trackType":0},"268":{"trackType":0},"269":{"trackType":0},"270":{"trackType":0},"271":{"trackType":0},"272":{"trackType":0},"273":{"trackType":0},"274":{"trackType":0},"275":{"trackType":0},"276":{"trackType":0},"277":{"trackType":0},"278":{"trackType":0},"279":{"trackType":0},"280":{"trackType":0},"281":{"trackType":0},"282":{"trackType":0},"283":{"trackType":1},"284":{"trackType":1},"285":{"trackType":1},"286":{"trackType":15},"287":{"trackType":0},"288":{"trackType":0},"289":{"trackType":0},"290":{"trackType":0},"291":{"trackType":0},"292":{"trackType":0},"293":{"trackType":0},"294":{"trackType":0},"295":{"trackType":0},"296":{"trackType":0},"297":{"trackType":0},"298":{"trackType":0},"299":{"trackType":0},"300":{"trackType":0},"301":{"trackType":0},"302":{"trackType":0},"303":{"trackType":1},"304":{"trackType":1},"305":{"trackType":1},"306":{"trackType":1},"307":{"trackType":28},"308":{"trackType":0},"309":{"trackType":0},"310":{"trackType":0},"311":{"trackType":0},"312":{"trackType":0},"313":{"trackType":0},"314":{"trackType":0},"315":{"trackType":0},"316":{"trackType":0},"317":{"trackType":0},"318":{"trackType":0},"319":{"trackType":0},"320":{"trackType":0},"321":{"trackType":0},"322":{"trackType":0},"323":{"trackType":1},"324":{"trackType":1},"325":{"trackType":1},"326":{"trackType":1},"327":{"trackType":1},"328":{"trackType":0},"329":{"trackType":0},"330":{"trackType":0},"331":{"trackType":0},"332":{"trackType":0},"333":{"trackType":0},"334":{"trackType":0},"335":{"trackType":0},"336":{"trackType":0},"337":{"trackType":0},"338":{"trackType":0},"339":{"trackType":0},"340":{"trackType":0},"341":{"trackType":0},"342":{"trackType":0},"343":{"trackType":1},"344":{"trackType":1},"345":{"trackType":1},"346":{"trackType":1},"347":{"trackType":1},"348":{"trackType":0},"349":{"trackType":0},"350":{"trackType":0},"351":{"trackType":0},"352":{"trackType":0},"353":{"trackType":0},"354":{"trackType":0},"355":{"trackType":0},"356":{"trackType":0},"357":{"trackType":0},"358":{"trackType":0},"359":{"trackType":0},"360":{"trackType":0},"361":{"trackType":0},"362":{"trackType":0},"363":{"trackType":1},"364":{"trackType":1},"365":{"trackType":1},"366":{"trackType":1},"367":{"trackType":1},"368":{"trackType":0},"369":{"trackType":0},"370":{"trackType":0},"371":{"trackType":0},"372":{"trackType":0},"373":{"trackType":30},"374":{"trackType":0},"375":{"trackType":0},"376":{"trackType":0},"377":{"trackType":0},"378":{"trackType":0},"379":{"trackType":0},"380":{"trackType":0},"381":{"trackType":0},"382":{"trackType":0},"383":{"trackType":1},"384":{"trackType":1},"385":{"trackType":1},"386":{"trackType":1},"387":{"trackType":1},"388":{"trackType":0},"389":{"trackType":0},"390":{"trackType":0},"391":{"trackType":0},"392":{"trackType":0},"393":{"trackType":1},"394":{"trackType":0},"395":{"trackType":0},"396":{"trackType":0},"397":{"trackType":0},"398":{"trackType":0},"399":{"trackType":0},"400":{"trackType":0},"401":{"trackType":0},"402":{"trackType":0},"403":{"trackType":1},"404":{"trackType":1},"405":{"trackType":1},"406":{"trackType":1},"407":{"trackType":1},"408":{"trackType":0},"409":{"trackType":0},"410":{"trackType":0},"411":{"trackType":0},"412":{"trackType":0},"413":{"trackType":1},"414":{"trackType":0},"415":{"trackType":0},"416":{"trackType":0},"417":{"trackType":0},"418":{"trackType":0},"419":{"trackType":0},"420":{"trackType":0},"421":{"trackType":0},"422":{"trackType":0},"423":{"trackType":1},"424":{"trackType":1},"425":{"trackType":1},"426":{"trackType":1},"427":{"trackType":1},"428":{"trackType":0},"429":{"trackType":0},"430":{"trackType":0},"431":{"trackType":0},"432":{"trackType":0},"433":{"trackType":1},"434":{"trackType":0},"435":{"trackType":0},"436":{"trackType":0},"437":{"trackType":0},"438":{"trackType":0},"439":{"trackType":0},"440":{"trackType":0},"441":{"trackType":0},"442":{"trackType":0},"443":{"trackType":1},"444":{"trackType":1},"445":{"trackType":1},"446":{"trackType":1},"447":{"trackType":1},"448":{"trackType":0},"449":{"trackType":0},"450":{"trackType":0},"451":{"trackType":0},"452":{"trackType":0},"453":{"trackType":1},"454":{"trackType":0},"455":{"trackType":0},"456":{"trackType":0},"457":{"trackType":0},"458":{"trackType":0},"459":{"trackType":0},"460":{"trackType":0},"461":{"trackType":0},"462":{"trackType":0},"463":{"trackType":1},"464":{"trackType":1},"465":{"trackType":1},"466":{"trackType":1},"467":{"trackType":1},"468":{"trackType":0},"469":{"trackType":0},"470":{"trackType":0},"471":{"trackType":0},"472":{"trackType":0},"473":{"trackType":1},"474":{"trackType":0},"475":{"trackType":0},"476":{"trackType":0},"477":{"trackType":0},"478":{"trackType":0},"479":{"trackType":0},"480":{"trackType":0},"481":{"trackType":0},"482":{"trackType":0},"483":{"trackType":1},"484":{"trackType":1},"485":{"trackType":1},"486":{"trackType":1},"487":{"trackType":1},"488":{"trackType":0},"489":{"trackType":0},"490":{"trackType":0},"491":{"trackType":0},"492":{"trackType":0},"493":{"trackType":1},"494":{"trackType":0},"495":{"trackType":0},"496":{"trackType":0},"497":{"trackType":0},"498":{"trackType":0},"499":{"trackType":0},"500":{"trackType":0},"501":{"trackType":0},"502":{"trackType":0},"503":{"trackType":1},"504":{"trackType":1},"505":{"trackType":1},"506":{"trackType":1},"507":{"trackType":1},"508":{"trackType":0},"509":{"trackType":0},"510":{"trackType":0},"511":{"trackType":0},"512":{"trackType":0},"513":{"trackType":1},"514":{"trackType":0},"515":{"trackType":0},"516":{"trackType":0},"517":{"trackType":0},"518":{"trackType":0},"519":{"trackType":0},"520":{"trackType":0},"521":{"trackType":0},"522":{"trackType":0},"523":{"trackType":1},"524":{"trackType":1},"525":{"trackType":1},"526":{"trackType":1},"527":{"trackType":1},"528":{"trackType":0},"529":{"trackType":0},"530":{"trackType":0},"531":{"trackType":0},"532":{"trackType":0},"533":{"trackType":1},"534":{"trackType":0},"535":{"trackType":0},"536":{"trackType":0},"537":{"trackType":0},"538":{"trackType":0},"539":{"trackType":0},"540":{"trackType":0},"541":{"trackType":0},"542":{"trackType":0},"543":{"trackType":1},"544":{"trackType":1},"545":{"trackType":1},"546":{"trackType":1},"547":{"trackType":26},"548":{"trackType":0},"549":{"trackType":0},"550":{"trackType":0},"551":{"trackType":0},"552":{"trackType":0},"553":{"trackType":1},"554":{"trackType":0},"555":{"trackType":0},"556":{"trackType":0},"557":{"trackType":0},"558":{"trackType":0},"559":{"trackType":0},"560":{"trackType":0},"561":{"trackType":0},"562":{"trackType":0},"563":{"trackType":1},"564":{"trackType":1},"565":{"trackType":1},"566":{"trackType":18},"567":{"trackType":0},"568":{"trackType":0},"569":{"trackType":0},"570":{"trackType":0},"571":{"trackType":0},"572":{"trackType":0},"573":{"trackType":1},"574":{"trackType":0},"575":{"trackType":0},"576":{"trackType":0},"577":{"trackType":0},"578":{"trackType":0},"579":{"trackType":0},"580":{"trackType":0},"581":{"trackType":0},"582":{"trackType":0},"583":{"trackType":1},"584":{"trackType":1},"585":{"trackType":18},"586":{"trackType":0},"587":{"trackType":0},"588":{"trackType":0},"589":{"trackType":0},"590":{"trackType":0},"591":{"trackType":0},"592":{"trackType":0},"593":{"trackType":1},"594":{"trackType":0},"595":{"trackType":0},"596":{"trackType":0},"597":{"trackType":0},"598":{"trackType":0},"599":{"trackType":0},"600":{"trackType":0},"601":{"trackType":0},"602":{"trackType":0},"603":{"trackType":1},"604":{"trackType":18},"605":{"trackType":0},"606":{"trackType":0},"607":{"trackType":0},"608":{"trackType":0},"609":{"trackType":0},"610":{"trackType":0},"611":{"trackType":0},"612":{"trackType":0},"613":{"trackType":1},"614":{"trackType":0},"615":{"trackType":0},"616":{"trackType":0},"617":{"trackType":0},"618":{"trackType":0},"619":{"trackType":0},"620":{"trackType":0},"621":{"trackType":0},"622":{"trackType":0},"623":{"trackType":9},"624":{"trackType":0},"625":{"trackType":0},"626":{"trackType":0},"627":{"trackType":0},"628":{"trackType":0},"629":{"trackType":0},"630":{"trackType":0},"631":{"trackType":0},"632":{"trackType":0},"633":{"trackType":26},"634":{"trackType":0},"635":{"trackType":0},"636":{"trackType":0},"637":{"trackType":0},"638":{"trackType":0},"639":{"trackType":0},"640":{"trackType":0},"641":{"trackType":0},"642":{"trackType":0},"643":{"trackType":1},"644":{"trackType":0},"645":{"trackType":0},"646":{"trackType":0},"647":{"trackType":0},"648":{"trackType":0},"649":{"trackType":0},"650":{"trackType":0},"651":{"trackType":0},"652":{"trackType":4},"653":{"trackType":0},"654":{"trackType":0},"655":{"trackType":0},"656":{"trackType":0},"657":{"trackType":0},"658":{"trackType":0},"659":{"trackType":0},"660":{"trackType":0},"661":{"trackType":0},"662":{"trackType":0},"663":{"trackType":1},"664":{"trackType":0},"665":{"trackType":0},"666":{"trackType":0},"667":{"trackType":0},"668":{"trackType":0},"669":{"trackType":0},"670":{"trackType":0},"671":{"trackType":4},"672":{"trackType":0},"673":{"trackType":0},"674":{"trackType":0},"675":{"trackType":0},"676":{"trackType":0},"677":{"trackType":0},"678":{"trackType":0},"679":{"trackType":0},"680":{"trackType":0},"681":{"trackType":0},"682":{"trackType":0},"683":{"trackType":27},"684":{"trackType":0},"685":{"trackType":0},"686":{"trackType":0},"687":{"trackType":0},"688":{"trackType":0},"689":{"trackType":0},"690":{"trackType":4},"691":{"trackType":0},"692":{"trackType":0},"693":{"trackType":0},"694":{"trackType":0},"695":{"trackType":0},"696":{"trackType":0},"697":{"trackType":0},"698":{"trackType":0},"699":{"trackType":0},"700":{"trackType":0},"701":{"trackType":0},"702":{"trackType":0},"703":{"trackType":0},"704":{"trackType":24},"705":{"trackType":2},"706":{"trackType":2},"707":{"trackType":2},"708":{"trackType":2},"709":{"trackType":13},"710":{"trackType":2},"711":{"trackType":2},"712":{"trackType":23},"713":{"trackType":0},"714":{"trackType":0},"715":{"trackType":0},"716":{"trackType":0},"717":{"trackType":0},"718":{"trackType":0},"719":{"trackType":0},"720":{"trackType":0},"721":{"trackType":0},"722":{"trackType":0},"723":{"trackType":0},"724":{"trackType":0},"725":{"trackType":0},"726":{"trackType":0},"727":{"trackType":0},"728":{"trackType":0},"729":{"trackType":0},"730":{"trackType":0},"731":{"trackType":0},"732":{"trackType":0},"733":{"trackType":3},"734":{"trackType":0},"735":{"trackType":0},"736":{"trackType":0},"737":{"trackType":0},"738":{"trackType":0},"739":{"trackType":0},"740":{"trackType":0},"741":{"trackType":0},"742":{"trackType":0},"743":{"trackType":0},"744":{"trackType":0},"745":{"trackType":0},"746":{"trackType":0},"747":{"trackType":0},"748":{"trackType":0},"749":{"trackType":0},"750":{"trackType":0},"751":{"trackType":0},"752":{"trackType":0},"753":{"trackType":0},"754":{"trackType":3},"755":{"trackType":0},"756":{"trackType":0},"757":{"trackType":0},"758":{"trackType":0},"759":{"trackType":0},"760":{"trackType":0},"761":{"trackType":0},"762":{"trackType":0},"763":{"trackType":0},"764":{"trackType":0},"765":{"trackType":0},"766":{"trackType":0},"767":{"trackType":0},"768":{"trackType":0},"769":{"trackType":0},"770":{"trackType":0},"771":{"trackType":0},"772":{"trackType":0},"773":{"trackType":0},"774":{"trackType":0},"775":{"trackType":3},"776":{"trackType":0},"777":{"trackType":0},"778":{"trackType":0},"779":{"trackType":0},"780":{"trackType":0},"781":{"trackType":0},"782":{"trackType":0},"783":{"trackType":0},"784":{"trackType":0},"785":{"trackType":0},"786":{"trackType":0},"787":{"trackType":0},"788":{"trackType":0},"789":{"trackType":0},"790":{"trackType":0},"791":{"trackType":0},"792":{"trackType":0},"793":{"trackType":0},"794":{"trackType":0},"795":{"trackType":0},"796":{"trackType":3},"797":{"trackType":0},"798":{"trackType":0},"799":{"trackType":0},"800":{"trackType":0},"801":{"trackType":0},"802":{"trackType":0},"803":{"trackType":0},"804":{"trackType":0},"805":{"trackType":0},"806":{"trackType":0},"807":{"trackType":0},"808":{"trackType":0},"809":{"trackType":0},"810":{"trackType":0},"811":{"trackType":0},"812":{"trackType":0},"813":{"trackType":0},"814":{"trackType":0},"815":{"trackType":0},"816":{"trackType":0},"817":{"trackType":3},"818":{"trackType":0},"819":{"trackType":0},"820":{"trackType":0},"821":{"trackType":0},"822":{"trackType":0},"823":{"trackType":0},"824":{"trackType":0},"825":{"trackType":0},"826":{"trackType":0},"827":{"trackType":0},"828":{"trackType":0},"829":{"trackType":0},"830":{"trackType":0},"831":{"trackType":0},"832":{"trackType":0},"833":{"trackType":0},"834":{"trackType":0},"835":{"trackType":0},"836":{"trackType":0},"837":{"trackType":0},"838":{"trackType":3},"839":{"trackType":0},"840":{"trackType":0},"841":{"trackType":0},"842":{"trackType":0},"843":{"trackType":0},"844":{"trackType":0},"845":{"trackType":0},"846":{"trackType":0},"847":{"trackType":0},"848":{"trackType":0},"849":{"trackType":0},"850":{"trackType":0},"851":{"trackType":0},"852":{"trackType":0},"853":{"trackType":0},"854":{"trackType":0},"855":{"trackType":0},"856":{"trackType":0},"857":{"trackType":0},"858":{"trackType":0},"859":{"trackType":3},"860":{"trackType":0},"861":{"trackType":0},"862":{"trackType":0},"863":{"trackType":0},"864":{"trackType":0},"865":{"trackType":0},"866":{"trackType":0},"867":{"trackType":0},"868":{"trackType":0},"869":{"trackType":0},"870":{"trackType":0},"871":{"trackType":0},"872":{"trackType":0},"873":{"trackType":0},"874":{"trackType":0},"875":{"trackType":0},"876":{"trackType":0},"877":{"trackType":0},"878":{"trackType":0},"879":{"trackType":0},"880":{"trackType":0},"881":{"trackType":0},"882":{"trackType":0},"883":{"trackType":0},"884":{"trackType":0},"885":{"trackType":0},"886":{"trackType":0},"887":{"trackType":0},"888":{"trackType":0},"889":{"trackType":0},"890":{"trackType":0},"891":{"trackType":0},"892":{"trackType":0},"893":{"trackType":0},"894":{"trackType":0},"895":{"trackType":0},"896":{"trackType":0},"897":{"trackType":0},"898":{"trackType":0},"899":{"trackType":0},"900":{"trackType":0},"901":{"trackType":0},"902":{"trackType":0},"903":{"trackType":0},"904":{"trackType":0},"905":{"trackType":0},"906":{"trackType":0},"907":{"trackType":0},"908":{"trackType":0},"909":{"trackType":0},"910":{"trackType":0},"911":{"trackType":0},"912":{"trackType":0},"913":{"trackType":0},"914":{"trackType":0},"915":{"trackType":0},"916":{"trackType":0},"917":{"trackType":0},"918":{"trackType":0},"919":{"trackType":0},"920":{"trackType":0},"921":{"trackType":0},"922":{"trackType":0},"923":{"trackType":0},"924":{"trackType":0},"925":{"trackType":0},"926":{"trackType":0},"927":{"trackType":0},"928":{"trackType":0},"929":{"trackType":0},"930":{"trackType":0},"931":{"trackType":0},"932":{"trackType":0},"933":{"trackType":0},"934":{"trackType":0},"935":{"trackType":0},"936":{"trackType":0},"937":{"trackType":0},"938":{"trackType":0},"939":{"trackType":0},"940":{"trackType":0},"941":{"trackType":0},"942":{"trackType":0},"943":{"trackType":0},"944":{"trackType":0},"945":{"trackType":0},"946":{"trackType":0},"947":{"trackType":0},"948":{"trackType":0},"949":{"trackType":0},"950":{"trackType":0},"951":{"trackType":0},"952":{"trackType":0},"953":{"trackType":0},"954":{"trackType":0},"955":{"trackType":0},"956":{"trackType":0},"957":{"trackType":0},"958":{"trackType":0},"959":{"trackType":0},"960":{"trackType":0},"961":{"trackType":0},"962":{"trackType":0},"963":{"trackType":0},"964":{"trackType":0},"965":{"trackType":0},"966":{"trackType":0},"967":{"trackType":0},"968":{"trackType":0},"969":{"trackType":0},"970":{"trackType":0},"971":{"trackType":0},"972":{"trackType":0},"973":{"trackType":0},"974":{"trackType":0},"975":{"trackType":0},"976":{"trackType":0},"977":{"trackType":0},"978":{"trackType":0},"979":{"trackType":0},"980":{"trackType":0},"981":{"trackType":0},"982":{"trackType":0},"983":{"trackType":0},"984":{"trackType":0},"985":{"trackType":0},"986":{"trackType":0},"987":{"trackType":0},"988":{"trackType":0},"989":{"trackType":0},"990":{"trackType":0},"991":{"trackType":0},"992":{"trackType":0},"993":{"trackType":0},"994":{"trackType":0},"995":{"trackType":0},"996":{"trackType":0},"997":{"trackType":0},"998":{"trackType":0},"999":{"trackType":0},"1000":{"trackType":0},"1001":{"trackType":0},"1002":{"trackType":0},"1003":{"trackType":0},"1004":{"trackType":0},"1005":{"trackType":0},"1006":{"trackType":0},"1007":{"trackType":0},"1008":{"trackType":0},"1009":{"trackType":0},"1010":{"trackType":0},"1011":{"trackType":0},"1012":{"trackType":0},"1013":{"trackType":0},"1014":{"trackType":0},"1015":{"trackType":0},"1016":{"trackType":0},"1017":{"trackType":0},"1018":{"trackType":0},"1019":{"trackType":0},"1020":{"trackType":0},"1021":{"trackType":0},"1022":{"trackType":0},"1023":{"trackType":0},"1024":{"trackType":0},"1025":{"trackType":0},"1026":{"trackType":0},"1027":{"trackType":0},"1028":{"trackType":0},"1029":{"trackType":0},"1030":{"trackType":0},"1031":{"trackType":0},"1032":{"trackType":0},"1033":{"trackType":0},"1034":{"trackType":0},"1035":{"trackType":0},"1036":{"trackType":0},"1037":{"trackType":0},"1038":{"trackType":0},"1039":{"trackType":0},"1040":{"trackType":0},"1041":{"trackType":0},"1042":{"trackType":0},"1043":{"trackType":0},"1044":{"trackType":0},"1045":{"trackType":0},"1046":{"trackType":0},"1047":{"trackType":0},"1048":{"trackType":0},"1049":{"trackType":0},"1050":{"trackType":0},"1051":{"trackType":0},"1052":{"trackType":0},"1053":{"trackType":0},"1054":{"trackType":0},"1055":{"trackType":0},"1056":{"trackType":0},"1057":{"trackType":0},"1058":{"trackType":0},"1059":{"trackType":0},"1060":{"trackType":0},"1061":{"trackType":0},"1062":{"trackType":0},"1063":{"trackType":0},"1064":{"trackType":0},"1065":{"trackType":0},"1066":{"trackType":0},"1067":{"trackType":0},"1068":{"trackType":0},"1069":{"trackType":0},"1070":{"trackType":0},"1071":{"trackType":0},"1072":{"trackType":0},"1073":{"trackType":0},"1074":{"trackType":0},"1075":{"trackType":0},"1076":{"trackType":0},"1077":{"trackType":0},"1078":{"trackType":0},"1079":{"trackType":0},"1080":{"trackType":0},"1081":{"trackType":0},"1082":{"trackType":0},"1083":{"trackType":0},"1084":{"trackType":0},"1085":{"trackType":0},"1086":{"trackType":0},"1087":{"trackType":0},"1088":{"trackType":0},"1089":{"trackType":0},"1090":{"trackType":0},"1091":{"trackType":0},"1092":{"trackType":0},"1093":{"trackType":0},"1094":{"trackType":0},"1095":{"trackType":0},"1096":{"trackType":0},"1097":{"trackType":0},"1098":{"trackType":0},"1099":{"trackType":0},"1100":{"trackType":0},"1101":{"trackType":0},"1102":{"trackType":0},"1103":{"trackType":0},"1104":{"trackType":0},"1105":{"trackType":0},"1106":{"trackType":0},"1107":{"trackType":0},"1108":{"trackType":0},"1109":{"trackType":0},"1110":{"trackType":0},"1111":{"trackType":0},"1112":{"trackType":0},"1113":{"trackType":0},"1114":{"trackType":0},"1115":{"trackType":0},"1116":{"trackType":0},"1117":{"trackType":0},"1118":{"trackType":0},"1119":{"trackType":0},"1120":{"trackType":0},"1121":{"trackType":0},"1122":{"trackType":0},"1123":{"trackType":0},"1124":{"trackType":0},"1125":{"trackType":0},"1126":{"trackType":0},"1127":{"trackType":0},"1128":{"trackType":0},"1129":{"trackType":0},"1130":{"trackType":0},"1131":{"trackType":0},"1132":{"trackType":0},"1133":{"trackType":0},"1134":{"trackType":0},"1135":{"trackType":0},"1136":{"trackType":0},"1137":{"trackType":0},"1138":{"trackType":0},"1139":{"trackType":0},"1140":{"trackType":0},"1141":{"trackType":0},"1142":{"trackType":0},"1143":{"trackType":0},"1144":{"trackType":0},"1145":{"trackType":0},"1146":{"trackType":0},"1147":{"trackType":0},"1148":{"trackType":0},"1149":{"trackType":0},"1150":{"trackType":0},"1151":{"trackType":0},"1152":{"trackType":0},"1153":{"trackType":0},"1154":{"trackType":0},"1155":{"trackType":0},"1156":{"trackType":0},"1157":{"trackType":0},"1158":{"trackType":0},"1159":{"trackType":0},"1160":{"trackType":0},"1161":{"trackType":0},"1162":{"trackType":0},"1163":{"trackType":0},"1164":{"trackType":0},"1165":{"trackType":0},"1166":{"trackType":0},"1167":{"trackType":0},"1168":{"trackType":0},"1169":{"trackType":0},"1170":{"trackType":0},"1171":{"trackType":0},"1172":{"trackType":0},"1173":{"trackType":0},"1174":{"trackType":0},"1175":{"trackType":0},"1176":{"trackType":0},"1177":{"trackType":0},"1178":{"trackType":0},"1179":{"trackType":0},"1180":{"trackType":0},"1181":{"trackType":0},"1182":{"trackType":0},"1183":{"trackType":0},"1184":{"trackType":0},"1185":{"trackType":0},"1186":{"trackType":0},"1187":{"trackType":0},"1188":{"trackType":0},"1189":{"trackType":0},"1190":{"trackType":0},"1191":{"trackType":0},"1192":{"trackType":0},"1193":{"trackType":0},"1194":{"trackType":0},"1195":{"trackType":0},"1196":{"trackType":0},"1197":{"trackType":0},"1198":{"trackType":0},"1199":{"trackType":0}}