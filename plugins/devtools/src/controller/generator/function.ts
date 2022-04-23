import { IFunction, IProperty } from "@rrox/api";
import { GeneratorDefinitionLinks } from ".";
import { getPropertyDecoratorArgs, getPropertyDocShort, getPropertyName, getPropertyType, wrapArrayArg } from "./property";

export function getFunctionName( func: IFunction ) {
    return func.cppName;
}

export async function getFunctionParameterType( param: IProperty, definitions: GeneratorDefinitionLinks, ignoreOut = false ) {
    const type = await getPropertyType( param, definitions );

    if( param.arraySize > 1 )
        return `Array<${type}>`;
    if( !ignoreOut && param.isFunctionOutParameter() )
        return `InOutParam<${type}>`;
    return type;
}

export async function getFunctionType( func: IFunction, definitions: GeneratorDefinitionLinks ) {
    let params: string[] = [];
    let returnType = 'void';

    for( let param of func.params ) {
        if( param.isFunctionReturnParameter() )
            returnType = await getFunctionParameterType( param, definitions, true );
        else if( param.isFunctionParameter() )
            params.push( getPropertyName( param ) + ': ' + await getFunctionParameterType( param, definitions ) );
    }

    let paramsString = params.join( ', ' );
    if( paramsString.length > 0 )
        paramsString = ` ${paramsString} `;

    return `(${paramsString}) => Promise<${returnType}>`;
}

export async function getFunctionDoc( func: IFunction ): Promise<string> {
    let paramsDoc: string[] = [];
    let returnDoc: string | undefined;
    let flags = func.getFlags();

    for( let param of func.params ) {
        if( param.isFunctionReturnParameter() )
            returnDoc = ` * @return ${await getPropertyDocShort( param )}`
        else if( param.isFunctionParameter() )
            paramsDoc.push( ` * @param ${getPropertyName( param )} ${await getPropertyDocShort( param )}` );
    }

    if( paramsDoc.length === 0 && !returnDoc && flags.length === 0 )
        return '';

    return `/**\n${paramsDoc.length > 0? `${paramsDoc.join( '\n' )}\n` : ''}${returnDoc ? `${returnDoc}\n` : ''}${flags.length > 0 ? ` * @flags ${flags}\n` : ''} */`;
}

export async function getFunctionDecoratorArgs( func: IFunction ): Promise<string[]> {
    const params: string[] = [];

    for( let param of func.params ) {
        if( !param.isFunctionParameter() && !param.isFunctionReturnParameter() )
            continue;
        params.push( wrapArrayArg( await getPropertyDecoratorArgs( param ) ) );
    }
    
    return params;
}

export async function generateFunction( func: IFunction, definitions: GeneratorDefinitionLinks ) {
    let decoratorArgs: string | string[] = await getFunctionDecoratorArgs( func );
    if( decoratorArgs.length > 0 )
        decoratorArgs = ', ' + wrapArrayArg( decoratorArgs );

    let definition = `@Property.Function( ${JSON.stringify( func.fullName )}${decoratorArgs} )`
        + '\n' + `public ${getFunctionName( func )}: ${await getFunctionType( func, definitions )};\n`;

    let doc = await getFunctionDoc( func );
    if( doc.length > 0 )
        definition = doc + '\n' + definition;

    return definition;
}