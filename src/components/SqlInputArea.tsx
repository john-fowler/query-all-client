import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { setSql, setMaxRows } from "../redux/sqlSlice";
import "./SqlInputArea.css";

interface SqlInputAreaProps {
  handleGo: () => void;
  handlePlan: () => void;
}

const SqlInputArea: React.FC<SqlInputAreaProps> = ({
  handleGo,
  handlePlan,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { sql, maxRows } = useSelector((state: RootState) => state.sql);
  const handleSqlChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newSql = event.target.value;
      dispatch(setSql(newSql));
      localStorage.setItem("sql", newSql); // Save to local storage
    },
    [dispatch]
  );

  const handleMaxRowsChange = useCallback(
    (event: SelectChangeEvent<number>) => {
      dispatch(setMaxRows(Number(event.target.value)));
    },
    [dispatch]
  );

  useEffect(() => {
    const savedSql = localStorage.getItem("sql");
    if (savedSql) {
      dispatch(setSql(savedSql));
    }
  }, [dispatch]);

  return (
    <Box className="sql-input-container">
      <Box className="flex-item">
        <TextField
          variant="outlined"
          multiline
          fullWidth
          placeholder="SELECT * FROM ..."
          value={sql}
          onChange={handleSqlChange}
          InputProps={{
            style: {
              height: "100%",
              alignItems: "flex-start",
              fontFamily: "Courier New, Courier, monospace", // Apply monospace font directly
            },
          }}
          className="sql-textarea"
        />
      </Box>
      <Box className="buttons-dropdown-container">
        <Box className="buttons-container">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGo}
            className="button"
          >
            Go
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePlan}
            className="button"
          >
            Plan
          </Button>
        </Box>
        <Box className="dropdown-container">
          <FormControl variant="outlined" className="dropdown">
            <InputLabel>Rows per page</InputLabel>
            <Select
              value={maxRows}
              onChange={handleMaxRowsChange}
              label="Rows per page"
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={250}>250</MenuItem>
              <MenuItem value={500}>500</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default SqlInputArea;
