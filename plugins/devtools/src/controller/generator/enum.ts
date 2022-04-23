import { IEnum } from "@rrox/api";
import { indentString } from ".";

export function getEnumName( enumData: IEnum ) {
    return enumData.cppName;
}

export async function generateEnum( enumData: IEnum ) {
    let definition = `export enum ${getEnumName( enumData )} {\n`;

    for( let [ key, value ] of enumData.members )
        definition += indentString( key, 4 ) + ' = ' + value + ',\n';

    definition += '}';

    return definition;
}