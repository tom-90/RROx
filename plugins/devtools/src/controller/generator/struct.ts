import { IStruct } from "@rrox/api";
import { GeneratorDefinitionLinks, indentString } from ".";
import { generateFunction } from "./function";
import { generateProperty } from "./property";

const IMPORTS = [
    'InOutParam',
    'NameRef',
    'Property',
    'PropertyType',
    'Struct',
    'StructInfo'
].sort();

export function getStructName( struct: IStruct ) {
    return struct.cppName;
}

export function getImports( definition: string ) {
    const usedImports = IMPORTS.filter( ( imp ) => definition.includes( imp ) ).join( ', ' );;

    return `\
import { ${usedImports} } from "@rrox/api";

`;
}

export function generateStructConstructor( struct: IStruct, hasSuper: boolean ) {
    let str = `constructor( struct: StructInfo<${getStructName( struct )}> ) {\n`;

    if( hasSuper )
        str += '    super( struct );\n';

    str += '    struct.apply( this );\n}';

    return str;
}

export async function generateStruct( struct: IStruct, definitions: GeneratorDefinitionLinks ) {
    let definition = `@Struct( ${JSON.stringify( struct.fullName )} )`+ '\n' + `export class ${getStructName( struct )}`;

    const superClass = await struct.getSuper();
    if( superClass ) {
        definition += ` extends ${getStructName( superClass )} {\n\n`;
        definitions[ getStructName( superClass ) ] = superClass.fullName;
    } else
        definition += ' {\n\n';

    definition += indentString( generateStructConstructor( struct, superClass != null ), 4 ) + '\n\n' ;

    for( let property of struct.properties )
        definition += indentString( await generateProperty( property, definitions ), 4 ) + '\n';

    if( struct.properties.length > 0 && struct.functions.length > 0 )
        definition += '\n';

    for( let func of struct.functions )
        definition += indentString( await generateFunction( func, definitions ), 4 ) + '\n';

    definition += '}';

    return getImports( definition ) + definition;
}