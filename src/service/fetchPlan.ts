import { API_BASE_URL, ApiResponse, SqlPlanResponse } from './serviceTypes';

export const fetchPlan = async (
    sql: string,
): Promise<ApiResponse<SqlPlanResponse>> => {
    const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, planOnly: true }),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};
