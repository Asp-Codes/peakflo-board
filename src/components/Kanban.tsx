import { Button, Box, IconButton, Typography } from "@mui/material";
import { Add} from '@mui/icons-material';  
import { useMemo, useState,useEffect } from "react";
import { Column,Task,Id } from "../types";  // Assuming the Column type is already defined
import ColumnContainer from "./ColumnContainer";
import {DndContext, DragOverlay, DragStartEvent,DragEndEvent, useSensor, useSensors, PointerSensor, DragOverEvent} from '@dnd-kit/core';
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/LocalStorage";
import { v4 as uuidv4 } from 'uuid';
import { colors } from "../theme/colors";

function Kanban() {
  const { columns: initialColumns, tasks: initialTasks } = loadFromLocalStorage();
  
  
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  console.log(columns);
  const columnsId =useMemo(() => columns.map((column) => column.id), [columns]);
  

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
        distance: 2, // Minimum distance in pixels before activation
      },
    })
  );
  
  
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);



  const deleteColumn = (id: string) => {
    setColumns(prevColumns => {
      const updatedColumns = prevColumns.filter(column => column.id !== id);
      saveToLocalStorage(updatedColumns, tasks);  // Save to localStorage after update
      return updatedColumns;
    });
    
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(task => task.columnId !== id);
      saveToLocalStorage(columns, updatedTasks);  // Save to localStorage after update
      return updatedTasks;
    });    
  }

    const updateColumn = (id: string, title: string) => {
      setColumns(prevColumns => {
        const updatedColumns = prevColumns.map(column => column.id === id ? { ...column, title } : column);
        saveToLocalStorage(updatedColumns, tasks);  // Save to localStorage after update
        return updatedColumns;
      });
    }

    const createTask = (columnId: Id) => {
      // Find the column title based on the columnId
      const column = columns.find((col) => col.id === columnId);
    
      if (!column) {
        // Handle the case when the columnId does not exist (optional)
        console.error("Column not found!");
        return;
      }
    
      // Create a new task with the appropriate column title as status
      const newTask: Task = {
        id: uuidv4(),
        columnId,
        content: `Card ${tasks.length + 1}`,
        description: "",
        status: column.title, // Set status as the column title
      };
    
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, newTask];
        saveToLocalStorage(columns, updatedTasks); // Save to localStorage after update
        return updatedTasks;
      });
    };
    

    const deleteTask = (id: Id) => {
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.filter(task => task.id !== id);
        saveToLocalStorage(columns, updatedTasks);  // Save to localStorage after update
        return updatedTasks;
      });      
    }

    // const updateTask = (id: Id, content: string) => {
    //   setTasks(prevTasks => {
    //     const updatedTasks = prevTasks.map(task => task.id === id ? { ...task, content } : task);
    //     saveToLocalStorage(columns, updatedTasks);  // Save to localStorage after update
    //     return updatedTasks;
    //   });      
    // }

    function onDragStart(event: DragStartEvent) {
        console.log(event);
        if(event.active.data.current?.type === "column"){
            setActiveColumn(event.active.data.current.column);
            return; 
        }

        if(event.active.data.current?.type === "task"){
            setActiveTask(event.active.data.current.task);
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveTask(null);
        setActiveColumn(null);

        const {active,over}=event;
        if(!active || !over){
            return;
        }
        const activeId=active.id;
        const overId=over.id;

        if(activeId === overId){
            return;
        }

        setColumns((columns) => {

            const activeIndex=columns.findIndex((column) => column.id === activeId);
            const overIndex=columns.findIndex((column) => column.id === overId);
            
            return arrayMove(columns,activeIndex,overIndex);  //swaaping the coumns
        });

      //   setTasks((tasks) => {

      //     const activeIndex=tasks.findIndex((task) => task.id === activeId);
      //     const overIndex=tasks.findIndex((task) => task.id === overId);
          
      //     return arrayMove(tasks,activeIndex,overIndex);  //swaaping the coumns
      // });
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
          updatedTasks[activeIndex].columnId = prevTasks[overIndex].columnId; // Ensure task stays in the correct column.
    
          return arrayMove(updatedTasks, activeIndex, overIndex);
        });
      }
    
      if (isActiveTask && isOverColumn) {
        setTasks((prevTasks) => {
          const activeIndex = prevTasks.findIndex((task) => task.id === activeId);
          
          // Update task's columnId to the new column
          const updatedTasks = [...prevTasks];
          updatedTasks[activeIndex].columnId = overId.toString();
    
          return updatedTasks; // No need to sort the tasks array since the column change is done by columnId update
        });
      }
    }
    

  return (
    <Box

      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        minHeight: '100vh', // Full height of the viewport
        overflowX: 'hidden',  // Horizontal scrolling enabled
        overflowY: 'hidden',  // Disable vertical scrolling
        // px: '40px',
        width: '100vw', 
        backgroundColor:'black' // Padding on the left and right
      }}
    >
    <DndContext onDragStart={onDragStart} sensors={sensors} onDragEnd={onDragEnd} onDragOver={onDragEvent}>
      <Box sx={{ display: 'flex', gap: 4,overflowX:'auto',paddingInline:'2rem', height: '100vh'}}>
        <Box sx={{ display: 'flex', gap: 4,cursor:"grab",paddingBlock:'4rem' }}>
          <SortableContext items={columnsId}>
          {columns.map((column) => (
            <ColumnContainer key={column.id} column={column} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask} /*updateTask={updateTask}*/ deleteTask={deleteTask} 
              tasks={tasks.filter((task) => task.columnId === column.id)}
            />
          ))}
          </SortableContext>
        </Box>

        <Button
          variant="contained"
          onClick={createNewColumn} // Adds a filled background color
          sx={{
            height: '4rem', // 60px in rem
            width: '16rem', // 350px in rem
            minWidth: '15rem', // 250px in rem
            borderRadius: '0.6rem', // Equivalent to Tailwind's rounded-lg
            backgroundColor: 'background.default', // Black background color
            border: '0.125rem solid',
            borderColor: colors.columnBackground, // Black border
            padding: '1rem', // Equivalent to Tailwind's p-4
            '&:hover': {
              borderColor: '#f50057', // Rose border color on hover
            },
            marginTop: '4rem', // Equivalent to Tailwind's mt-8
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            gap: '0.2rem', // Space between IconButton and text
          }}
        >
          <IconButton sx={{ fontSize: '2.5rem', color: 'white' }}>
            <Add />
          </IconButton>
          <Typography variant="button" sx={{ color: 'white' }}>New status</Typography>
        </Button>
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
           /*updateTask={updateTask}*/
            tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
          />
        )}
        {activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} /*updateTask={updateTask} *//>}
        </DragOverlay>, document.body)}

    </DndContext>
    </Box>
  );
}

export default Kanban;
  // const generateId = () => {
  //   return Math.floor(Math.random() * 5000).toString();
  // };