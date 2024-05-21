import { API_BASE_URL, ApiResponse, SqlResponse } from './serviceTypes';

export const executeSql = async (
    sql: string,
    maxRows: number = 100,
    resumeIdx: number = 0,
): Promise<ApiResponse<SqlResponse>> => {
    const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, maxRows, resumeIdx }),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};
