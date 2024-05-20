
export const PK_INDEX_NAME = '-~pk~-';
export const SCAN_INDEX_NAME = '-~scan~-';

export type TableMetadata = {
    name: string,
    catalog: string,
    columns: ColumnMetadata[],
    indexes: IndexMetadata[],
    itemCount?: number,
}

export type ColumnMetadata = {
    name: string,
    type: ColumnTypes,
    nullable: boolean,
}

export type IndexMetadata = {
    name: string,
    fieldNames: string[],
}

export type HashKeyAndSortIndexMetadata = IndexMetadata & {
    hashKeyName: string,
    sortKeyName?: string,
    supportsGet: boolean,
}

export type ScanNoIndexMetadata = IndexMetadata & {
    rowCount: number,
}

export enum ColumnTypes {
    STRING = 'string',
    NUMBER = 'number',
    BINARY = 'binary',
    BOOLEAN = 'boolean',
    DATE = 'date',
    OBJECT = 'object',
    ARRAY = 'array',
    NULL = 'null',
    STRING_SET = 'string_set',
    NUMBER_SET = 'number_set',
    BINARY_SET = 'binary_set',
}

