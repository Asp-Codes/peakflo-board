import { useMemo, useState } from "react";
import { Box, IconButton, Typography, Button } from "@mui/material";
import { Add, DeleteOutline } from "@mui/icons-material";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column, Id, Task } from "../types";
import TaskCard from "./TaskCard";
import { colors } from "../theme/colors";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  tasks: Task[];
  deleteTask: (id: Id) => void;
}

function ColumnContainer(props: Props) {
  const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask } =
    props;
  const [editMode, setEditMode] = useState(false);

  // Memoize task count for the current column
  const taskCount = useMemo(
    () => tasks.filter((task) => task.columnId === column.id).length,
    [tasks, column.id]
  );

  const taskids = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <Box
        ref={setNodeRef}
        style={style}
        sx={{
          backgroundColor: colors.columnBackground,
          width: "350px",
          height: "500px",
          opacity: 0.4,
          // border: '4px solid gray',
          maxHeight: "500px",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
        }}
      ></Box>
    );
  }

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        width: "350px",
        height: "500px",
        maxHeight: "500px",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        sx={{
          backgroundColor: "background.default",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          paddingBlock: "0.9rem",
          fontWeight: "bold",
          border: "5px solid",
          borderColor: colors.columnBackground,
          borderBottom: "none",
          borderRadius: "8px 8px 0 0",
          cursor: "pointer",
        }}
      >
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Typography variant="body1">
            {!editMode && column.title}
            {editMode && (
              <input
                autoFocus
                value={column.title}
                onChange={(e) => updateColumn(column.id, e.target.value)}
                style={{
                  color: "white",
                  border: "1px solid white",
                  backgroundColor: colors.columnBackground,
                  borderRadius: "4px",
                  padding: "4px 4px",
                  height: "24px",
                  outline: "none",
                  width: "fit-content",
                }}
                onBlur={() => setEditMode(false)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  setEditMode(false);
                }}
              />
            )}
          </Typography>
          <Box
            sx={{
              color: "white",
              // padding: '6px',
              width: "fit-content",
              height: "fit-content",
              padding: "0.45rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.875rem",
              borderRadius: "8px",
              backgroundColor: colors.columnBackground,
            }}
          >
            {taskCount}
          </Box>
        </Box>

        <IconButton
          sx={{
            color: "gray",
            "&:hover": {
              backgroundColor: colors.columnBackground,
              color: "#f50057",
            },
          }}
          onClick={() => {
            deleteColumn(column.id);
          }}
        >
          <DeleteOutline
            sx={{
              color: "white-400",
            }}
          />
        </IconButton>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "16px",
          overflowX: "hidden",
          overflowY: "auto",
          alignItems: "center",
          justifyContent: "",
          backgroundColor: colors.columnBackground,
          borderRadius: "0 0 8px 8px",
        }}
      >
        <SortableContext items={taskids}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} deleteTask={deleteTask} />
          ))}
        </SortableContext>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          padding: "8px",
          backgroundColor: "transparent",
        }}
      >
        <Button
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            backgroundColor: "transparent",
            color: "white",
            "&:hover": {
              backgroundColor: "lightgray",
              color: "black",
            },
            textTransform: "none",
            padding: "8px 16px",
          }}
          startIcon={<Add />}
          onClick={() => {
            createTask(column.id);
          }}
        >
          <Typography variant="body2">Add Task</Typography>
        </Button>
      </Box>
    </Box>
  );
}

export default ColumnContainer;
