import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Task, Column } from "../types"; // Assuming your Task and Column types are here
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/LocalStorage";

function TaskDetails() {
  const { taskId } = useParams(); // Get taskId from URL
  const [task, setTask] = useState<Task | null>(null);
  const [columns, setColumns] = useState<Column[]>([]); // Add state for columns
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the task and columns data from localStorage or other state
    const { columns, tasks } = loadFromLocalStorage();
    const foundTask = tasks.find((task) => task.id === taskId);
    if (foundTask) {
      setTask(foundTask);

      // Find the current column by columnId and set it as the default status
      const currentColumn = columns.find((column) => column.id === foundTask.columnId);
      if (currentColumn) {
        setTask((prevTask) => prevTask ? { ...prevTask, status: currentColumn.title } : prevTask);
      }
    }
    setColumns(columns); // Set columns state
  }, [taskId]);

  const handleDelete = () => {
    if (task) {
      // Remove task from localStorage or state
      const { columns, tasks } = loadFromLocalStorage();
      const updatedTasks = tasks.filter((t) => t.id !== task.id);
      saveToLocalStorage(columns, updatedTasks); // Assuming saveToLocalStorage handles both columns and tasks
      navigate("/"); // Navigate back to the Kanban board
    }
  };

  const handleSave = () => {
    if (task) {
      // Save the updated task back to localStorage or state
      const { columns, tasks } = loadFromLocalStorage();
    //   const updatedTasks = tasks.map((t) =>
    //     t.id === task.id ? { ...task } : t
    //   );

      // Find the column that corresponds to the selected status (column title)
      const selectedColumn = columns.find(
        (col) => col.title === task.status
      );

      if (selectedColumn) {
        // Update the columnId of the task to the columnId of the selected column
        const updatedTask = { ...task, columnId: selectedColumn.id };
        const updatedTasksWithColumn = tasks.map((t) =>
          t.id === task.id ? updatedTask : t
        );

        // Save the updated task and columns to localStorage
        saveToLocalStorage(columns, updatedTasksWithColumn);
      }

      navigate("/"); // Navigate back to the Kanban board
    }
  };

  if (!task || !columns) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        p: 3,
        boxShadow: 3,
        backgroundColor: "background.default",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Task Details
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Title"
          variant="outlined"
          value={task.content}
          onChange={(e) => setTask({ ...task, content: e.target.value })}
          fullWidth
        />
        <TextField
          label="Description"
          variant="outlined"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          fullWidth
          multiline
          rows={4}
        />
        <FormControl fullWidth sx={{ textAlign: 'left', marginBottom: 2 }}>
  <InputLabel></InputLabel>
  <Select
    value={task.status || ""} // Default to an empty string if no status
    onChange={(e) => setTask({ ...task, status: e.target.value })}
    displayEmpty
  >
    {columns.map((column) => (
      <MenuItem key={column.id} value={column.title}>
        {column.title}
      </MenuItem>
    ))}
  </Select>
</FormControl>

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ flex: 1, mr: 1 }}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDelete}
            sx={{ flex: 1, ml: 1 }}
          >
            Delete Task
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default TaskDetails;
