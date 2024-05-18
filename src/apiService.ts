const API_BASE_URL = 'http://localhost:8080/v1/sql';

export const fetchPlan = async (sql: string) => {
  const response = await fetch(`${API_BASE_URL}/plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const executeSql = async (sql: string, maxRows: number = 100, resumeIdx: number = 0) => {
  const response = await fetch(API_BASE_URL, {
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