import { PK_INDEX_NAME, TableMetadata } from '../types';
import { ApiResponse, API_BASE_URL } from './serviceTypes';

function extendTableMetadata(table: TableMetadata): TableMetadata {
    const tab: TableMetadata = { ...table };
    const pkIndex = tab.indexes.find((index) => index.name === PK_INDEX_NAME);
    if (pkIndex) {
        const pkColumns = pkIndex.fieldNames.map(
            (fieldName) =>
                tab.columns.find((column) => column.name === fieldName)!,
        );
        tab.primaryKey = pkColumns;
        //  Let's remove the pkColumns from the list of columns.
        tab.columns = tab.columns.filter(
            (column) => !pkColumns.includes(column),
        );
    }
    tab.columns.sort((a, b) => a.name.localeCompare(b.name));
    tab.columns = tab.columns.map((column) => ({
        ...column,
        isHashKey: tab.indexes.some(
            (index) => index.fieldNames[0] === column.name,
        ),
    }));
    return tab;
}

export const getTableDetails = async (
    tableName: string,
): Promise<ApiResponse<TableMetadata>> => {
    const response = await fetch(`${API_BASE_URL}/tables/${tableName}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const resp: ApiResponse<TableMetadata> = await response.json();
    if (resp.success) {
        resp.data = extendTableMetadata(resp.data!);
    }
    return resp;
};
