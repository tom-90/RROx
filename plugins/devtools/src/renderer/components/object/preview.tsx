import { REPLObject } from "../../replObject";
import React from 'react';
import { ObjectName, ObjectValue } from "react-inspector";

/* intersperse arr with separator */
function intersperse( arr: any[], sep: any ) {
    if ( arr.length === 0 ) {
        return [];
    }

    return arr.slice( 1 ).reduce( ( xs, x ) => xs.concat( [ sep, x ] ), [ arr[ 0 ] ] );
}

export function getPropertyValue( object: any, propertyName: string ) {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(object, propertyName);
    if( propertyDescriptor?.get ) {
        try {
            return propertyDescriptor.get()
        } catch {
            return propertyDescriptor.get
        }
    }

    return object[ propertyName ];
}

export function ObjectPreview( { data }: { data: any } ) {
    const object = data;

    if (
        typeof object !== 'object' ||
        object === null ||
        object instanceof Date ||
        object instanceof RegExp
    ) {
        return <ObjectValue object={object} />;
    }

    if ( Array.isArray( object ) ) {
        const maxProperties = 10;
        const previewArray = object
            .slice( 0, maxProperties )
            .map( ( element, index ) => <ObjectValue key={index} object={element} /> );
        if ( object.length > maxProperties ) {
            previewArray.push( <span key="ellipsis">…</span> );
        }
        const arrayLength = object.length;
        return (
            <React.Fragment>
                <span style={{ fontStyle: 'italic' }}>
                    {arrayLength === 0 ? `` : `(${arrayLength})\xa0`}
                </span>
                <span style={{ fontStyle: 'italic' }}>[{intersperse( previewArray, ', ' )}]</span>
            </React.Fragment>
        );
    } else {
        const maxProperties = 5;
        let propertyNodes = [];
        for ( const propertyName in object ) {
            if ( object.hasOwnProperty( propertyName ) ) {
                let ellipsis;
                if (
                    propertyNodes.length === maxProperties - 1 &&
                    Object.keys( object ).length > maxProperties
                ) {
                    ellipsis = <span key={'ellipsis'}>…</span>;
                }

                const propertyValue = getPropertyValue( object, propertyName );
                propertyNodes.push(
                    <span key={propertyName}>
                        <ObjectName name={propertyName || `""`} />
                        :&nbsp;
                        <ObjectValue object={propertyValue} />
                        {ellipsis}
                    </span>
                );
                if ( ellipsis ) break;
            }
        }

        const objectConstructorName = object.constructor ? object.constructor.name : 'Object';

        return (
            <React.Fragment>
                <span style={{ fontStyle: 'italic' }}>
                    {objectConstructorName === 'Object' ? '' : `${objectConstructorName} `}
                </span>
                <span style={{ fontStyle: 'italic' }}>
                    {'{'}
                    {intersperse( propertyNodes, ', ' )}
                    {'}'}
                </span>
            </React.Fragment>
        );
    }
};

export default ObjectPreview;