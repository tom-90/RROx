import React, {useEffect, useState} from "react";

export enum TrackTypes{
    none,
    track_horizontal,
    track_vertical,
    track_diagonal_left,
    track_diagonal_right,
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

export function TrackPieces({ key, type, x, y, width, height, switchState }: {
    key: number,
    type: TrackTypes,
    x : number,
    y : number,
    width : number,
    height : number
    switchState?: boolean
}){
    switch (type){
        case TrackTypes.track_horizontal:
            return (<g key={'layout-square-content-'+key}>
                <line x1={x} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke="black" />
            </g>);
        case TrackTypes.track_vertical:
            return (<g key={'layout-square-content-'+key}>
                <line x1={x + (width/2)} y1={y} x2={x + (width/2)} y2={y + height} stroke="black" />
            </g>);
        case TrackTypes.track_diagonal_left:
            return (<g key={'layout-square-content-'+key}>
                    <line x1={x} y1={y} x2={x + width} y2={y + height} stroke="black" />
            </g>);
        case TrackTypes.track_diagonal_right:
            return (<g key={'layout-square-content-'+key}>
                    <line x1={x + width} y1={y} x2={x} y2={y + height} stroke="black" />
            </g>);
        case TrackTypes.switch_horizontal_bottom_left:
            return (<g key={'layout-square-content-'+key} >
                    <line x1={x} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke="black" />
                    <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y + height} stroke="black" />
                </g>);
        case TrackTypes.switch_horizontal_bottom_right:
            return (<g key={'layout-square-content-'+key} >
                <line x1={x} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke="black" />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x} y2={y + height} stroke="black" />
            </g>);
        case TrackTypes.switch_horizontal_top_left:
            return (<g key={'layout-square-content-'+key} >
                <line x1={x} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke="black" />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y} stroke="black" />
            </g>);
        case TrackTypes.switch_horizontal_top_right:
            return (<g key={'layout-square-content-'+key} >
                <line x1={x} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke="black" />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x} y2={y} stroke="black" />
            </g>);
        case TrackTypes.switch_vertical_bottom_left:
            return (<g key={'layout-square-content-'+key} >
                <line x1={x + (width/2)} y1={y} x2={x + (width/2)} y2={y + height} stroke="black" />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y + height} stroke="black" />
            </g>);
        case TrackTypes.switch_vertical_bottom_right:
            return (<g key={'layout-square-content-'+key} >
                <line x1={x + (width/2)} y1={y} x2={x + (width/2)} y2={y + height} stroke="black" />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x} y2={y + height} stroke="black" />
            </g>);
        case TrackTypes.switch_vertical_top_left:
            return (<g key={'layout-square-content-'+key} >
                <line x1={x + (width/2)} y1={y} x2={x + (width/2)} y2={y + height} stroke="black" />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y} stroke="black" />
            </g>);
        case TrackTypes.switch_vertical_top_right:
            return (<g key={'layout-square-content-'+key} >
                <line x1={x + (width/2)} y1={y} x2={x + (width/2)} y2={y + height} stroke="black" />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x} y2={y} stroke="black" />
            </g>);
        case TrackTypes.switch_diagonal_left_left:
            return (<g key={'layout-square-content-'+key} >
                <line key={'layout-square-content-'+key} x1={x} y1={y} x2={x + width} y2={y + height} stroke="black" />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke="black" />
            </g>);
        case TrackTypes.switch_diagonal_left_right:
            return (<g key={'layout-square-content-'+key} >
                <line key={'layout-square-content-'+key} x1={x} y1={y} x2={x + width} y2={y + height} stroke="black" />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x} y2={y + (height/2)} stroke="black" />
            </g>);
        case TrackTypes.switch_diagonal_left_top:
            return (<g key={'layout-square-content-'+key} >
                <line key={'layout-square-content-'+key} x1={x} y1={y} x2={x + width} y2={y + height} stroke="black" />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + (width/2)} y2={y} stroke="black" />
            </g>);
        case TrackTypes.switch_diagonal_left_bottom:
            return (<g key={'layout-square-content-'+key} >
                <line key={'layout-square-content-'+key} x1={x} y1={y} x2={x + width} y2={y + height} stroke="black" />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + (width/2)} y2={y + height} stroke="black" />
            </g>);
        case TrackTypes.switch_diagonal_right_left:
            return (<g key={'layout-square-content-'+key} >
                <line key={'layout-square-content-'+key} x1={x + width} y1={y} x2={x} y2={y + height} stroke="black" />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y + (height/2)} stroke="black" />
            </g>);
        case TrackTypes.switch_diagonal_right_right:
            return (<g key={'layout-square-content-'+key} >
                <line key={'layout-square-content-'+key} x1={x + width} y1={y} x2={x} y2={y + height} stroke="black" />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x} y2={y + (height/2)} stroke="black" />
            </g>);
        case TrackTypes.switch_diagonal_right_top:
            return (<g key={'layout-square-content-'+key} >
                <line key={'layout-square-content-'+key} x1={x + width} y1={y} x2={x} y2={y + height} stroke="black" />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + (width/2)} y2={y} stroke="black" />
            </g>);
        case TrackTypes.switch_diagonal_right_bottom:
            return (<g key={'layout-square-content-'+key} >
                <line key={'layout-square-content-'+key} x1={x + width} y1={y} x2={x} y2={y + height} stroke="black" />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + (width/2)} y2={y + height} stroke="black" />
            </g>);
        case TrackTypes.corner_top_bottom_left:
            return (<g key={'layout-square-content-'+key} >
                <line x1={x + (width/2)} y1={y} x2={x + (width/2)} y2={y + (height/2)} stroke="black" />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x + width} y2={y + height} stroke="black" />
            </g>);
        case TrackTypes.corner_top_bottom_right:
            return (<g key={'layout-square-content-'+key} >
                <line x1={x + (width/2)} y1={y} x2={x + (width/2)} y2={y + (height/2)} stroke="black" />
                <line x1={x + (width/2)} y1={y + (height/2)} x2={x} y2={y + height} stroke="black" />
            </g>);
        case TrackTypes.corner_bottom_top_left:
            return (<g key={'layout-square-content-'+key} >
                <line x1={x + (width/2)} y1={y + height} x2={x + (width/2)} y2={y + (height/2)} stroke="black" />
                <line x1={x} y1={y} x2={x + (width/2)} y2={y + (height/2)} stroke="black" />
            </g>);
        case TrackTypes.corner_bottom_top_right:
            return (<g key={'layout-square-content-'+key} >
                <line x1={x + (width/2)} y1={y + height} x2={x + (width/2)} y2={y + (height/2)} stroke="black" />
                <line x1={x + width} y1={y} x2={x + (width/2)} y2={y + (height/2)} stroke="black" />
            </g>);
        case TrackTypes.corner_left_top_right:
            return (<g key={'layout-square-content-'+key} >
                <line x1={x} y1={y + (height/2)} x2={x + (width/2)} y2={y + (height/2)} stroke="black" />
                <line x1={x + width} y1={y} x2={x + (width/2)} y2={y + (height/2)} stroke="black" />
            </g>);
        case TrackTypes.corner_left_bottom_right:
            return (<g key={'layout-square-content-'+key} >
                <line x1={x} y1={y + (height/2)} x2={x + (width/2)} y2={y + (height/2)} stroke="black" />
                <line x1={x + width} y1={y + height} x2={x + (width/2)} y2={y + (height/2)} stroke="black" />
            </g>);
        case TrackTypes.corner_right_top_left:
            return (<g key={'layout-square-content-'+key} >
                <line x1={x + width} y1={y + (height/2)} x2={x + (width/2)} y2={y + (height/2)} stroke="black" />
                <line x1={x} y1={y} x2={x + (width/2)} y2={y + (height/2)} stroke="black" />
            </g>);
        case TrackTypes.corner_right_bottom_left:
            return (<g key={'layout-square-content-'+key} >
                <line x1={x + width} y1={y + (height/2)} x2={x + (width/2)} y2={y + (height/2)} stroke="black" />
                <line x1={x} y1={y + height} x2={x + (width/2)} y2={y + (height/2)} stroke="black" />
            </g>);
        default:
            return (<g key={'layout-square-content-' + key}/>);
    }
}