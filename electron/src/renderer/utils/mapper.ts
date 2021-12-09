export class Mapper {

    public static readonly svgNS = "http://www.w3.org/2000/svg";

    public svgTag?: SVGElement;
    public shapes: any[] = [];
    public json: any;

    public imageWidth = 8000;
    public minX = -200000;
    public maxX = 200000;
    public minY = -200000;
    public maxY = 200000;
    public x = this.maxX - this.minX;
    public y = this.maxY - this.minY;
    public max = Math.max( this.x, this.y );
    public scale = ( this.imageWidth * 100 / this.max );
    public switchRadius = 80;
    public engineRadius = 6 * this.scale;
    public turnTableRadius = ( 10 / 2.2107077 ) * this.scale;
    public imx = this.x / 100 * this.scale;
    public imy = this.y / 100 * this.scale;
    public allLabels = [ [ 0, 0 ] ];
    public allCurveLabels = [ [ [ 0, 0 ] ], [ [ 0, 0 ] ], [ [ 0, 0 ] ], [ [ 0, 0 ] ] ];
    public initialTreesDown = 1750;

    public config = {
        labelPrefix: '..'
    }

    constructor( json: any ) {
        this.json = json;
    }

    private deg2rad( degrees: number ) {
        const pi = Math.PI;
        return degrees * ( pi / 180 );
    }

    private thingy( angle: number, x: number, y: number ) {
        x += Math.cos( this.deg2rad( angle ) ) * 2;
        y += Math.sin( this.deg2rad( angle ) ) * 2;

        return [ x, y ];
    }

    drawSVG( htmlElement: string ) {
        this.svgTag = document.getElementById( htmlElement ) as any as SVGElement;
        // this.getReplantableTrees();
        this.getTracksAndBeds();
        this.getSwitches();
        this.getTurntables();
        // this.getIndustries();
        this.getRollingStock();
        // this.getWaterTowers();

        for ( const shape of this.shapes ) {
            this.svgTag.appendChild( shape );
        }
    }

    createSVGElement( type: string, attrs: { [ key: string ]: any } ) {
        const element = document.createElementNS( Mapper.svgNS, type );
        for ( const attr in attrs ) {
            element.setAttribute( attr, attrs[ attr ].toString() );
        }
        return element;
    }

    getTracksAndBeds() {
        // const tracksAndBedsGroup = document.createElementNS(Mapper.svgNS, "g");
        const tracksGroup = document.createElementNS( Mapper.svgNS, "g" );
        const bedsGroup = document.createElementNS( Mapper.svgNS, "g" );
        const ironBridgeGroup = document.createElementNS( Mapper.svgNS, "g" );
        tracksGroup.setAttribute( "class", "tracks" );
        bedsGroup.setAttribute( "class", "beds" );
        ironBridgeGroup.setAttribute( "class", "ironOverWood" );

        const drawOrder: { [ key: number ]: any[] } = {}; // [type, stroke-width, stroke]
        drawOrder[ 1 ] = [ 1, 15, 'darkkhaki' ]; // variable bank
        drawOrder[ 2 ] = [ 2, 15, 'darkkhaki' ]; // constant bank
        drawOrder[ 5 ] = [ 5, 15, 'darkgrey' ];  // variable wall
        drawOrder[ 6 ] = [ 6, 15, 'darkgrey' ];  // constant wall
        drawOrder[ 3 ] = [ 3, 15, 'orange' ];    // wooden bridge
        drawOrder[ 7 ] = [ 7, 15, 'lightblue' ]; // iron bridge
        drawOrder[ 4 ] = [ 4, 3, 'black' ];      // trendle track
        drawOrder[ 0 ] = [ 0, 3, 'black' ];      // track        darkkhaki, darkgrey, orange, blue, black

        if ( 'Splines' in this.json ) {
            let splineIndex = -1;
            for ( const spline of this.json[ 'Splines' ] ) {
                splineIndex++;
                let type = spline[ 'Type' ];
                let entry = drawOrder[ type ];
                const [ , strokeWidth, stroke ] = entry;

                let segments = spline[ 'Segments' ];
                if ( [ 1, 2, 5, 6, 3, 7 ].indexOf( type ) > -1 ) {
                    const bedSegment = document.createElementNS( Mapper.svgNS, 'path' );
                    let path = '';
                    let tool = '';
                    for ( const segment of segments ) {
                        //'<path d="M 100 100 L 300 100 L 200 300 z" fill="red" stroke="blue" stroke-width="3" />'
                        if ( segment[ 'Visible' ] !== true ) {
                            tool = 'M';
                        } else {
                            tool = 'L';
                        }
                        let xStart = ( this.imx - ( ( segment[ 'LocationStart' ][ 0 ] - this.minX ) / 100 * this.scale ) );
                        let yStart = ( this.imy - ( ( segment[ 'LocationStart' ][ 1 ] - this.minY ) / 100 * this.scale ) );
                        let xEnd = ( this.imx - ( ( segment[ 'LocationEnd' ][ 0 ] - this.minX ) / 100 * this.scale ) );
                        let yEnd = ( this.imy - ( ( segment[ 'LocationEnd' ][ 1 ] - this.minY ) / 100 * this.scale ) );
                        if ( path === '' ) {
                            path = 'M ' + xStart + ',' + yStart + ' ';
                            path += tool + ' ' + xEnd + ',' + yEnd + ' ';
                        } else {
                            path += tool + ' ' + xEnd + ',' + yEnd + ' ';
                        }
                    }
                    bedSegment.setAttribute( "d", path );
                    bedSegment.setAttribute( "fill", 'none' );
                    bedSegment.setAttribute( "stroke", stroke );
                    bedSegment.setAttribute( "stroke-width", strokeWidth.toString() );
                    bedsGroup.appendChild( bedSegment );
                    if ( type === 7 ) {
                        ironBridgeGroup.appendChild( bedSegment.cloneNode( true ) );
                    }
                } else {
                    // tracks..
                    let segmentIndex = -1;
                    for ( const segment of segments ) {
                        segmentIndex++;
                        if ( segment[ 'Visible' ] !== true ) {
                            continue
                        }

                        let xStart = ( this.imx - ( ( segment[ 'LocationStart' ][ 0 ] - this.minX ) / 100 * this.scale ) );
                        let yStart = ( this.imy - ( ( segment[ 'LocationStart' ][ 1 ] - this.minY ) / 100 * this.scale ) );
                        let xEnd = ( this.imx - ( ( segment[ 'LocationEnd' ][ 0 ] - this.minX ) / 100 * this.scale ) );
                        let yEnd = ( this.imy - ( ( segment[ 'LocationEnd' ][ 1 ] - this.minY ) / 100 * this.scale ) );

                        const trackSegment = document.createElementNS( Mapper.svgNS, 'line' );
                        trackSegment.setAttribute( "x1", xStart.toString() );
                        trackSegment.setAttribute( "y1", yStart.toString() );
                        trackSegment.setAttribute( "x2", xEnd.toString() );
                        trackSegment.setAttribute( "y2", yEnd.toString() );
                        trackSegment.setAttribute( "sp", splineIndex.toString() );
                        trackSegment.setAttribute( "se", segmentIndex.toString() );
                        trackSegment.setAttribute( "stroke", stroke );
                        trackSegment.setAttribute( "stroke-width", strokeWidth.toString() );
                        tracksGroup.appendChild( trackSegment );
                    }
                }
            }
        }

        this.shapes.push( bedsGroup );
        this.shapes.push( ironBridgeGroup );
        this.shapes.push( tracksGroup );
    }

    getSwitches() {
        if ( !( 'Switches' in this.json ) ) {
            return
        }

        const switchesGroup = document.createElementNS( Mapper.svgNS, "g" );
        switchesGroup.setAttribute( "class", "switches" );

        for ( const swtch of this.json[ 'Switches' ] ) { // can't use 'switch' as variable name
            let dir = 0;
            const type = swtch[ 'Type' ];

            /**
             * 0 = SwitchLeft           = lever left switch going left
             * 1 = SwitchRight          = lever right switch going right
             * 2 =                      = Y
             * 3 =                      = Y mirror
             * 4 = SwitchRightMirror    = lever left switch going right
             * 5 = SwitchLeftMirror     = lever right switch going left
             * 6 = SwitchCross90        = cross
             */
            let state = swtch[ 'Side' ];
            switch (type) {
                case 0:
                    dir = -6;
                    state = !state;
                    break;
                case 1:
                case 3:
                case 4:
                    dir = 6;
                    break;
                case 2:
                    dir = -6;
                    break;
                case 5:
                    state = !state;
                    dir = -6;
                    break;
                case 6:
                    dir = 99;
                    break;
                default:
                    dir = 1;
            }

            if ( dir === 0 ) {
                console.log( "Switch error in switch " + JSON.stringify( swtch ) );
            }

            const rotation = this._deg2rad( swtch[ 'Rotation' ][ 1 ] - 90 );
            const rotSide = this._deg2rad( swtch[ 'Rotation' ][ 1 ] - 90 + dir );
            const rotCross = this._deg2rad( swtch[ 'Rotation' ][ 1 ] + 180 );

            const x = ( this.imx - ( ( swtch[ 'Location' ][ 0 ] - this.minX ) / 100 * this.scale ) );
            const y = ( this.imy - ( ( swtch[ 'Location' ][ 1 ] - this.minY ) / 100 * this.scale ) );

            if ( dir === 99 ) { // Cross
                const crosslength = this.switchRadius / 10;
                const x2 = ( this.imx - ( ( swtch[ 'Location' ][ 0 ] - this.minX ) / 100 * this.scale ) + ( Math.cos( rotCross ) * crosslength ) );
                const y2 = ( this.imy - ( ( swtch[ 'Location' ][ 1 ] - this.minY ) / 100 * this.scale ) + ( Math.sin( rotCross ) * crosslength ) );
                const cx = x + ( x2 - x ) / 2;
                const cy = y + ( y2 - y ) / 2;

                switchesGroup.appendChild( this.createSVGElement( "line", {
                    x1: x,
                    y1: y,
                    x2: x2,
                    y2: y2,
                    stroke: "black",
                    'stroke-width': "3"
                } ) );

                switchesGroup.appendChild( this.createSVGElement( "line", {
                    x1: ( cx - ( Math.cos( rotation ) * crosslength ) ),
                    y1: ( cy - ( Math.sin( rotation ) * crosslength ) ),
                    x2: ( cx + ( Math.cos( rotation ) * crosslength ) ),
                    y2: ( cy + ( Math.sin( rotation ) * crosslength ) ),
                    stroke: "black",
                    'stroke-width': "3"
                } ) );
            } else {
                const xStraight = ( this.imx - ( ( swtch[ 'Location' ][ 0 ] - this.minX ) / 100 * this.scale ) + ( Math.cos( rotation ) * this.switchRadius / 2 ) );
                const yStraight = ( this.imy - ( ( swtch[ 'Location' ][ 1 ] - this.minY ) / 100 * this.scale ) + ( Math.sin( rotation ) * this.switchRadius / 2 ) );
                const xSide = ( this.imx - ( ( swtch[ 'Location' ][ 0 ] - this.minX ) / 100 * this.scale ) + ( Math.cos( rotSide ) * this.switchRadius / 2 ) );
                const ySide = ( this.imy - ( ( swtch[ 'Location' ][ 1 ] - this.minY ) / 100 * this.scale ) + ( Math.sin( rotSide ) * this.switchRadius / 2 ) );

                if ( state ) {
                    switchesGroup.appendChild( this.createSVGElement( "line", {
                        x1: x,
                        y1: y,
                        x2: xStraight,
                        y2: yStraight,
                        stroke: "red",
                        'stroke-width': "3"
                    } ) );

                    switchesGroup.appendChild( this.createSVGElement( "line", {
                        x1: x,
                        y1: y,
                        x2: xSide,
                        y2: ySide,
                        stroke: "black",
                        'stroke-width': "3"
                    } ) );
                } else {
                    switchesGroup.appendChild( this.createSVGElement( "line", {
                        x1: x,
                        y1: y,
                        x2: xSide,
                        y2: ySide,
                        stroke: "red",
                        'stroke-width': "3"
                    } ) );

                    switchesGroup.appendChild( this.createSVGElement( "line", {
                        x1: x,
                        y1: y,
                        x2: xStraight,
                        y2: yStraight,
                        stroke: "black",
                        'stroke-width': "3"
                    } ) );
                }
            }
        }
        this.shapes.push( switchesGroup );
    }

    getTurntables() {
        if ( !( 'Turntables' in this.json ) ) {
            return
        }

        const turntablesGroup = document.createElementNS( Mapper.svgNS, "g" );
        turntablesGroup.setAttribute( "class", "turntables" );

        for ( const turntable of this.json[ 'Turntables' ] ) {
            /**
             * 0 = regular
             * 1 = light and nice
             */
            const rotation = this._deg2rad( turntable[ 'Rotation' ][ 1 ] + 90 );
            const rotation2 = this._deg2rad( turntable[ 'Rotation' ][ 1 ] + 90 + turntable[ 'Deck' ][ 1 ] );
            this.turnTableRadius = 25;

            const x = ( this.imx - ( ( turntable[ 'Location' ][ 0 ] - this.minX ) / 100 * this.scale ) );
            const y = ( this.imx - ( ( turntable[ 'Location' ][ 1 ] - this.minX ) / 100 * this.scale ) );
            const x2 = ( this.imx - ( ( turntable[ 'Location' ][ 0 ] - this.minX ) / 100 * this.scale ) + ( Math.cos( rotation ) * this.turnTableRadius ) );
            const y2 = ( this.imy - ( ( turntable[ 'Location' ][ 1 ] - this.minY ) / 100 * this.scale ) + ( Math.sin( rotation ) * this.turnTableRadius ) );
            const cx = x + ( x2 - x ) / 2;
            const cy = y + ( y2 - y ) / 2;

            const turntableCircle = document.createElementNS( Mapper.svgNS, "circle" );
            turntableCircle.setAttribute( "cx", cx.toString() );
            turntableCircle.setAttribute( "cy", cy.toString() );
            turntableCircle.setAttribute( "r", ( this.turnTableRadius / 2 ).toString() );
            turntableCircle.setAttribute( "stroke", "black" );
            turntableCircle.setAttribute( "stroke-width", "1" );
            turntableCircle.setAttribute( "fill", "lightyellow" );
            turntablesGroup.appendChild( turntableCircle );

            const turntableLine = document.createElementNS( Mapper.svgNS, "line" );
            turntableLine.setAttribute( "x1", ( cx - ( Math.cos( rotation2 ) * this.turnTableRadius / 2 ) ).toString() );
            turntableLine.setAttribute( "y1", ( cy - ( Math.sin( rotation2 ) * this.turnTableRadius / 2 ) ).toString() );
            turntableLine.setAttribute( "x2", ( cx + ( Math.cos( rotation2 ) * this.turnTableRadius / 2 ) ).toString() );
            turntableLine.setAttribute( "y2", ( cy + ( Math.sin( rotation2 ) * this.turnTableRadius / 2 ) ).toString() );
            turntableLine.setAttribute( "stroke", "black" );
            turntableLine.setAttribute( "stroke-width", "3" );
            turntablesGroup.appendChild( turntableLine );
        }
        this.shapes.push( turntablesGroup );
    }

    getRollingStock() {
        if ( !( 'Frames' in this.json ) ) {
            return
        }

        const rollingStockGroup = document.createElementNS( Mapper.svgNS, "g" );
        rollingStockGroup.setAttribute( "class", "rollingstock" );

        const cartOptions: { [ vehicle: string ]: [ number, string ] | [ number, string, string ] } = {
            'handcar': [ this.engineRadius, 'white' ],
            'porter_040': [ this.engineRadius, 'black' ],
            'porter_042': [ this.engineRadius, 'black' ],
            'eureka': [ this.engineRadius, 'black' ],
            'eureka_tender': [ this.engineRadius, 'black' ],
            'climax': [ this.engineRadius, 'black' ],
            'heisler': [ this.engineRadius, 'black' ],
            'class70': [ this.engineRadius, 'black' ],
            'class70_tender': [ this.engineRadius, 'black' ],
            'cooke260': [ this.engineRadius, 'black' ],
            'cooke260_tender': [ this.engineRadius, 'black' ],
            'flatcar_logs': [ this.engineRadius / 3, 'indianred', 'red' ],
            'flatcar_cordwood': [ this.engineRadius / 3 * 2, 'orange', 'orangered' ],
            'flatcar_stakes': [ this.engineRadius / 3 * 2, 'greenyellow', 'green' ],
            'flatcar_hopper': [ this.engineRadius / 3 * 2, 'rosybrown', 'brown' ],
            'boxcar': [ this.engineRadius / 3 * 2, 'mediumpurple', 'purple' ],
            'flatcar_tanker': [ this.engineRadius / 3 * 2, 'lightgray', 'dimgray' ],
        }

        for ( const vehicle of this.json[ 'Frames' ] ) {
            const x = ( this.imx - ( ( vehicle[ 'Location' ][ 0 ] - this.minX ) / 100 * this.scale ) );
            const y = ( this.imy - ( ( vehicle[ 'Location' ][ 1 ] - this.minY ) / 100 * this.scale ) );
            if ( [ 'porter_040', 'porter_042', /*'handcar', */'eureka', 'climax', 'heisler', 'class70', 'cooke260' ].indexOf( vehicle[ 'Type' ] ) >= 0 ) {
                const yl = ( this.engineRadius / 3 ) * 2;
                const xl = ( this.engineRadius / 2 ) * 2;
                const path = document.createElementNS( Mapper.svgNS, "path" );
                path.setAttribute( "transform", "rotate(" + Math.round( vehicle[ 'Rotation' ][ 1 ] ) + ", " + x + ", " + y + ")" );
                path.setAttribute( "d", "M" + ( x - ( this.engineRadius / 2 ) ) + "," + y + " l " + ( xl / 3 ) + "," + ( yl / 2 ) + " l " + ( xl / 3 * 2 ) + ",0 l 0,-" + yl + " l -" + ( xl / 3 * 2 ) + ",0 z" );
                path.setAttribute( "fill", "purple" );
                path.setAttribute( "stroke", "black" );
                path.setAttribute( "stroke-width", "2" );
                rollingStockGroup.appendChild( path );
            } else {
                const yl = ( this.engineRadius / 3 ) * 2;
                let xl = this.engineRadius;

                if ( vehicle[ 'Type' ].toLowerCase().indexOf( 'tender' ) !== -1 ) {
                    xl = xl / 3 * 2;
                }
                const path = document.createElementNS( Mapper.svgNS, "path" );
                let fillColor = cartOptions[ vehicle[ 'Type' ] ][ 1 ];
                path.setAttribute( "class", 'ce_' + vehicle[ 'Type' ] );
                if (
                    typeof vehicle[ 'Freight' ] !== 'undefined' &&
                    typeof vehicle[ 'Freight' ][ 'Amount' ] !== 'undefined' &&
                    vehicle[ 'Freight' ][ 'Amount' ] > 0 &&
                    cartOptions[ vehicle[ 'Type' ] ][ 2 ] !== undefined
                ) {
                    path.setAttribute( "class", 'cf_' + vehicle[ 'Type' ] );
                    fillColor = cartOptions[ vehicle[ 'Type' ] ][ 2 ]!;
                }
                const title = document.createElementNS( Mapper.svgNS, "title" );
                title.textContent = vehicle[ 'Name' ].replace( /<\/?[^>]+(>|$)/g, "" ) + " " + vehicle[ 'Number' ].replace( /<\/?[^>]+(>|$)/g, "" );
                if (
                    typeof vehicle[ 'Freight' ] !== 'undefined' &&
                    typeof vehicle[ 'Freight' ][ 'Amount' ] !== 'undefined' &&
                    vehicle[ 'Freight' ][ 'Amount' ] === 0 ) {
                    title.textContent += " (empty)";
                } else {
                    if ( typeof vehicle[ 'Freight' ] !== 'undefined' &&
                        typeof vehicle[ 'Freight' ][ 'Type' ] !== 'undefined'
                    ) {
                        title.textContent += " (" + vehicle[ 'Freight' ][ 'Type' ] + " x" + vehicle[ 'Freight' ][ 'Amount' ] + ")";
                    }
                }
                let cc, cx, cy;
                cc = this.thingy( vehicle[ 'Rotation' ][ 1 ], x, y );
                cx = cc[ 0 ];
                cy = cc[ 1 ];
                path.setAttribute( "d", "M" + Math.round( x ) + "," + Math.round( y ) + " m-" + ( xl / 2 ) + ",-" + ( yl / 2 ) + " h" + ( xl - 4 ) + " a2,2 0 0 1 2,2 v" + ( yl - 4 ) + " a2,2 0 0 1 -2,2 h-" + ( xl - 4 ) + " a2,2 0 0 1 -2,-2 v-" + ( yl - 4 ) + " a2,2 0 0 1 2,-2 z" );
                path.setAttribute( "fill", fillColor );
                path.setAttribute( "stroke", "black" );
                path.setAttribute( "stroke-width", "1" );
                path.setAttribute( "transform", "rotate(" + Math.round( vehicle[ 'Rotation' ][ 1 ] ) + ", " + Math.round( cx ) + ", " + Math.round( cy ) + ")" );
                path.appendChild( title );
                rollingStockGroup.appendChild( path );
            }

            if ( [ 'porter_040', 'porter_042', /*'handcar', */'eureka', 'climax', 'heisler', 'class70', 'cooke260' ].indexOf( vehicle[ 'Type' ] ) >= 0 ) {
                let name = vehicle[ 'Name' ].replace( /(<([^>]+)>)/gi, "" ).toUpperCase();
                if ( !name ) {
                    name = this._capitalize( vehicle[ 'Type' ] );
                }

                let textRotation = vehicle[ 'Rotation' ][ 1 ];
                if ( textRotation < 0 ) {
                    textRotation += 90;
                } else {
                    textRotation -= 90;
                }
                this.allLabels.push( [ x, y ] );

                const vehicleLabel = document.createElementNS( Mapper.svgNS, "text" );
                const textNode = document.createTextNode( this.config.labelPrefix + name );
                vehicleLabel.setAttribute( "stroke", "black" );
                vehicleLabel.setAttribute( "fill", "white" );
                vehicleLabel.setAttribute( "font-size", "1em" );
                vehicleLabel.setAttribute( "x", x.toString() );
                vehicleLabel.setAttribute( "y", y.toString() );
                vehicleLabel.setAttribute( "transform", "rotate(" + textRotation + ", " + x + ", " + y + ")" )
                vehicleLabel.appendChild( textNode );
                rollingStockGroup.appendChild( vehicleLabel );
            }
        }
        this.shapes.push( rollingStockGroup );
    }

    getWaterTowers() {
        if ( !( 'Watertowers' in this.json ) ) {
            return
        }

        for ( const tower of this.json[ 'Watertowers' ] ) {
            const x = this.imx - ( ( tower[ 'Location' ][ 0 ] - this.minX ) / 100 * this.scale );
            const y = this.imy - ( ( tower[ 'Location' ][ 1 ] - this.minY ) / 100 * this.scale );

            const waterTower = document.createElementNS( Mapper.svgNS, "path" );
            waterTower.setAttribute( "transform", "rotate(" + Math.round( tower[ 'Rotation' ][ 1 ] ) + ", " + x + ", " + y + ")" );
            waterTower.setAttribute( "d", "M" + x + "," + y + " m -5,-5 l10,0 l0,3 l3,0 l0,4 l-3,0 l0,3 l-10,0 z" );
            waterTower.setAttribute( "fill", "lightblue" );
            waterTower.setAttribute( "stroke", "black" );
            waterTower.setAttribute( "stroke-width", "1" );
            this.shapes.push( waterTower );

            const waterTowerCircle = document.createElementNS( Mapper.svgNS, "circle" );
            waterTowerCircle.setAttribute( "cx", x.toString() );
            waterTowerCircle.setAttribute( "cy", y.toString() );
            waterTowerCircle.setAttribute( "r", "3" );
            waterTowerCircle.setAttribute( "fill", "blue" );
            this.shapes.push( waterTowerCircle );
        }
    }

    private _deg2rad( degrees: number ) {
        return degrees * ( Math.PI / 180 );
    }

    private _capitalize( string: string ) {
        return String( string ).charAt( 0 ).toUpperCase() + string.slice( 1 ).toLowerCase();
    }
}