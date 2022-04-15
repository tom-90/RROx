/**
 * A `int8` number property (range `-128` to `+127`)
 */
declare type int8 = number;

/**
 * A `int16` number property (range `-32768` to `+32767`)
 */
declare type int16 = number;

/**
 * A `int32` number property (range `-2147483648` to `+2147483647`)
 */
declare type int32 = number;

/**
 * A `int64` number property (range `-9223372036854775808` to `+9223372036854775807`).
 * This is larger than the supported range of numbers of the JavaScript `number` type.
 * Therefore, the JavaScript `bigint` type is used.
 */
declare type int64 = bigint;

/**
 * A `uint8` number property, containing only positive numbers
 * (range `0` to `255`)
 */
declare type uint8 = number;

/**
 * A `uint16` number property, containing only positive numbers
 * (range `0` to `+65535`)
 */
declare type uint16 = number;

/**
 * A `uint32` number property, containing only positive numbers
 * (range `0` to `+4294967295`)
 */
declare type uint32 = number;

/**
 * A `uint64` number property (range `0` to `+18446744073709551615`).
 * This is larger than the supported range of numbers of the JavaScript `number` type.
 * Therefore, the JavaScript `bigint` type is used.
 */
declare type uint64 = bigint;

/**
 * A `float` number property, containing decimals.
 */
declare type float = number;

/**
 * A `double` number property, containing decimals.
 */
declare type double = number;

/**
 * Global plugin info interface
 */
declare interface PluginInfo {
    /**
     * Name of the currently loaded plugin
     */
    name: string;
}

declare const PluginInfo: PluginInfo;