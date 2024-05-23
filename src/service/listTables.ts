import { TableMetadata } from '../db-types';
import { ApiResponse, API_BASE_URL } from './serviceTypes';

export const listTables = async (): Promise<ApiResponse<TableMetadata[]>> => {
    const response = await fetch(`${API_BASE_URL}/tables`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};
