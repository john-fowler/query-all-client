import { TableMetadata } from "../types";
import { ApiResponse, API_BASE_URL } from "./serviceTypes";


export const getTableDetails = async (tableName: string): Promise<ApiResponse<TableMetadata>> => {
  const response = await fetch(`${API_BASE_URL}/tables/${tableName}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
