// External Libraries
import { useMemo, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { createPortal } from "react-dom";
import { Button, Box, IconButton, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import ColumnContainer from "./ColumnContainer";
import TaskCard from "./TaskCard";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
} from "../utils/LocalStorage";
import { colors } from "../theme/colors";
import { Column, Task, Id } from "../types";

function Kanban() {
  const { columns: initialColumns, tasks: initialTasks } =
    loadFromLocalStorage();

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  console.log(columns);
  const columnsId = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );

  useEffect(() => {
    saveToLocalStorage(columns, tasks);
  }, [columns, tasks]);

  const createNewColumn = () => {
    const newColumn: Column = {
      id: uuidv4(),
      title: "Status",
    };
    const updatedColumns = [...columns, newColumn];
    setColumns(updatedColumns);
    saveToLocalStorage(updatedColumns, tasks);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    })
  );

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const deleteColumn = (id: string) => {
    setColumns((prevColumns) => {
      const updatedColumns = prevColumns.filter((column) => column.id !== id);
      saveToLocalStorage(updatedColumns, tasks);
      return updatedColumns;
    });

    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.filter((task) => task.columnId !== id);
      saveToLocalStorage(columns, updatedTasks);
      return updatedTasks;
    });
  };

  const updateColumn = (id: string, title: string) => {
    setColumns((prevColumns) => {
      const updatedColumns = prevColumns.map((column) =>
        column.id === id ? { ...column, title } : column
      );
      saveToLocalStorage(updatedColumns, tasks);
      return updatedColumns;
    });
  };

  const createTask = (columnId: Id) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column) {
      console.error("Column not found!");
      return;
    }
    const newTask: Task = {
      id: uuidv4(),
      columnId,
      content: `Card ${tasks.length + 1}`,
      description: "",
      status: column.title,
    };

    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks, newTask];
      saveToLocalStorage(columns, updatedTasks);
      return updatedTasks;
    });
  };

  const deleteTask = (id: Id) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.filter((task) => task.id !== id);
      saveToLocalStorage(columns, updatedTasks);
      return updatedTasks;
    });
  };

  function onDragStart(event: DragStartEvent) {
    console.log(event);
    if (event.active.data.current?.type === "column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    setActiveColumn(null);

    const { active, over } = event;
    if (!active || !over) {
      return;
    }
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) {
      return;
    }

    setColumns((columns) => {
      const activeIndex = columns.findIndex((column) => column.id === activeId);
      const overIndex = columns.findIndex((column) => column.id === overId);

      return arrayMove(columns, activeIndex, overIndex);
    });
  }

  function onDragEvent(event: DragOverEvent) {
    const { active, over } = event;
    if (!active || !over) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) {
      return;
    }

    const isActiveTask = active.data.current?.type === "task";
    const isOverTask = over.data.current?.type === "task";
    const isOverColumn = over.data.current?.type === "column";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((prevTasks) => {
        const activeIndex = prevTasks.findIndex((task) => task.id === activeId);
        const overIndex = prevTasks.findIndex((task) => task.id === overId);

        const updatedTasks = [...prevTasks];
        updatedTasks[activeIndex].columnId = prevTasks[overIndex].columnId;

        return arrayMove(updatedTasks, activeIndex, overIndex);
      });
    }

    if (isActiveTask && isOverColumn) {
      setTasks((prevTasks) => {
        const activeIndex = prevTasks.findIndex((task) => task.id === activeId);
        const updatedTasks = [...prevTasks];
        updatedTasks[activeIndex].columnId = overId.toString();

        return updatedTasks;
      });
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        overflowX: "hidden",
        overflowY: "scroll",
        width: "99.5vw",
        backgroundColor: "black",
      }}
    >
      <DndContext
        onDragStart={onDragStart}
        sensors={sensors}
        onDragEnd={onDragEnd}
        onDragOver={onDragEvent}
      >
        <Box
          sx={{
            display: "flex",
            gap: 4,
            justifyContent: "center",
            alignItems: "center",
            paddingInline: "2rem",
            height: "fit-content",
            OverflowY: "auto" /*border:'2px solid white'*/,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              cursor: "grab",
              paddingBlock: "2rem",
              alignItems: "start",
              justifyContent: "space-evenly" /*border:'2px solid white' */,
            }}
          >
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnContainer
                  key={column.id}
                  column={column}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  /*updateTask={updateTask}*/ deleteTask={deleteTask}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                />
              ))}
            </SortableContext>
            <Button
              variant="contained"
              onClick={createNewColumn}
              sx={{
                height: "4rem",
                width: "350px",
                minWidth: "15rem",
                borderRadius: "0.6rem",
                backgroundColor: "background.default",
                border: "0.125rem solid",
                borderColor: colors.columnBackground,
                padding: "1rem",
                "&:hover": {
                  borderColor: "#f50057",
                },
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: "0.2rem",
              }}
            >
              <IconButton sx={{ fontSize: "2.5rem", color: "white" }}>
                <Add />
              </IconButton>
              <Typography variant="button" sx={{ color: "white" }}>
                New status
              </Typography>
            </Button>
          </Box>
        </Box>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard task={activeTask} deleteTask={deleteTask} />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </Box>
  );
}

export default Kanban;
