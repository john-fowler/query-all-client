import { ColumnTypes } from './enums';

export const PK_INDEX_NAME = '-~pk~-';
export const SCAN_INDEX_NAME = '-~scan~-';

export type ColumnType = string | number | boolean | null;
export type IndexableColumnType = string | number;
export type Row = ColumnType[];
export type RowObject = { [key: string]: ColumnType };

export type ColumnMetadata = {
    name: string;
    type: ColumnTypes;
    isHashKey?: boolean;
    nullable: boolean;
};

export type IndexMetadata = {
    name: string;
    fieldNames: string[];
};

export type TableMetadata = {
    name: string;
    catalog: string;
    columns: ColumnMetadata[];
    indexes: IndexMetadata[];
    primaryKey?: ColumnMetadata[];
    itemCount?: number;
};

// export type HashKeyAndSortIndexMetadata = IndexMetadata & {
//     hashKeyName: string;
//     sortKeyName?: string;
//     supportsGet: boolean;
// };

// export type ScanNoIndexMetadata = IndexMetadata & {
//     rowCount: number;
// };
