import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [sql, setSql] = useState('');
  const [plan, setPlan] = useState('');
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<any[][]>([]);

  const handleSqlChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSql(event.target.value);
  };

  const handlePlan = async () => {
    const response = await fetch('http://localhost:8080/v1/sql/plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql }),
    });
    const result = await response.json();
    setData([]);
    setPlan(result.plan);
  };

  const handleGo = async () => {
    const response = await fetch('http://localhost:8080/v1/sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql }),
    });
    const result = await response.json();
    setColumns(result.columns);
    setPlan('');
    setData(result.data);
  };

  return (
    <div className="App">
      <textarea value={sql} onChange={handleSqlChange} rows={10} cols={50} />
      <div>
        <button onClick={handlePlan}>Plan</button>
        <button onClick={handleGo}>Go</button>
      </div>
      {plan && (
        <pre>{plan}</pre>
      )}
      {data.length > 0 && (
        <table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;