
export const API_BASE_URL = 'http://localhost:8080/v1';

export type ApiResponse<T> = {
    success: boolean,
    data?: T,
    error?: string,
    detailedError?: string,
};

export type SqlPlanResponse = {
  sql: string,
  weight: number,
  plan: string,
  planTime: number,
};

export type SqlResponse = {
    columns: string[],
    data: any[][],
    firstRowIdx: number,
    resumeIdx?: number,
    planTime: number,
    execTime: number,
};
