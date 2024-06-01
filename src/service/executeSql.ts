import { API_BASE_URL, ApiResponse, SqlResponse } from './serviceTypes';

let controller: AbortController | null = null;

export const executeSql = async (
    sql: string,
    maxRows: number = 100,
    resumeIdx: number = 0,
): Promise<ApiResponse<SqlResponse>> => {
    if (controller) {
        controller.abort();
    }
    controller = new AbortController();
    const { signal } = controller;
    try {
        const response = await fetch(`${API_BASE_URL}/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sql, maxRows, resumeIdx }),
            signal,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: Error | any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (error.name === 'AbortError') {
            // eslint-disable-next-line no-console
            console.log('Execution cancelled');
            return { success: false, error: 'Execution Cancelled' };
        }
        // eslint-disable-next-line no-console
        console.error('Error executing SQL:', error);
        return { success: false, error: error.message };
    }
};

export const cancelExecution = () => {
    if (controller) {
        // eslint-disable-next-line no-console
        console.log('Cancelling execution');
        controller.abort();
        controller = null;
    }
};
