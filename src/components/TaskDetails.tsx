import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Task, Column } from "../types";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/LocalStorage";
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

function TaskDetails() {
  const { taskId } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const { columns, tasks } = loadFromLocalStorage();
    const foundTask = tasks.find((task) => task.id === taskId);
    if (foundTask) {
      setTask(foundTask);

      const currentColumn = columns.find(
        (column) => column.id === foundTask.columnId
      );
      if (currentColumn) {
        setTask((prevTask) =>
          prevTask ? { ...prevTask, status: currentColumn.title } : prevTask
        );
      }
    }
    setColumns(columns);
  }, [taskId]);

  const handleDelete = () => {
    if (task) {
      // Remove task from localStorage
      const { columns, tasks } = loadFromLocalStorage();
      const updatedTasks = tasks.filter((t) => t.id !== task.id);
      saveToLocalStorage(columns, updatedTasks);
      navigate("/"); // Navigate back to the Kanban board after deleting the task.
    }
  };

  const handleSave = () => {
    if (task) {
      // Save the updated task back to localStorage
      const { columns, tasks } = loadFromLocalStorage();

      // Find the column of the selected status using column title
      const selectedColumn = columns.find((col) => col.title === task.status);

      if (selectedColumn) {
        // Update the columnId
        const updatedTask = { ...task, columnId: selectedColumn.id };
        const updatedTasksWithColumn = tasks.map((t) =>
          t.id === task.id ? updatedTask : t
        );

        // Save the updated task and columns to localStorage
        saveToLocalStorage(columns, updatedTasksWithColumn);
      }

      navigate("/"); // Navigate back to the Kanban board after saving the task.
    }
  };

  if (!task || !columns) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
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
        <FormControl fullWidth sx={{ textAlign: "left", marginBottom: 2 }}>
          <InputLabel></InputLabel>
          <Select
            value={task.status}
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
