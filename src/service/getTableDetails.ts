import { PK_INDEX_NAME, TableMetadata } from "../types";
import { ApiResponse, API_BASE_URL } from "./serviceTypes";


export const getTableDetails = async (tableName: string): Promise<ApiResponse<TableMetadata>> => {
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

function extendTableMetadata(table: TableMetadata): TableMetadata {
  const pkIndex = table.indexes.find((index) => index.name === PK_INDEX_NAME);
  if (pkIndex) {
    const pkColumns = pkIndex.fieldNames.map((fieldName) => table.columns.find((column) => column.name === fieldName)!);
    table.primaryKey = pkColumns;
  }
  table.columns.sort((a, b) => a.name.localeCompare(b.name));
  table.columns.forEach((column) => {
    column.isHashKey = table.indexes.some((index) => index.fieldNames[0] === column.name);
  });
  return table;
}