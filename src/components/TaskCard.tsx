import { Task } from "../types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";
interface Props {
  task: Task;
  deleteTask: (id: string) => void;
  // updateTask: (id: string, content: string) => void;
}

function TaskCard({ task, deleteTask,/*updateTask*/ }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  // const [editMode, setEditMode] = useState(false);
  // const [content, setContent] = useState(task.content); // Track local changes

  // const toggleEditMode = () => {
  //   setEditMode((prev) => !prev);
  //   setMouseIsOver(false);
  // };

  // const handleBlur = () => {
  //   updateTask(task.id, content);
  //   // setEditMode(false);
  // };

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   if (e.key === "Enter" && !e.shiftKey) {
  //     e.preventDefault(); // Prevent default behavior of adding a new line
  //     // handleBlur();
  //   }
  // };


  const { setNodeRef,attributes,listeners,transform,transition,isDragging,
  } =
 useSortable({
   id: task.id,
   data:{
       type: 'task',
       task,
   },
  //  disabled: editMode,
   });


   const style = {
       transition,
       transform: CSS.Transform.toString(transform),
   };

   if(isDragging){
        return <Card ref={setNodeRef} style={style} sx={{
          bgcolor: 'background.default',
          px: 2.5,
          height: 100,
          minHeight: 100,
          opacity: 0.5,
          width: "90%",
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          textAlign: "left",
          borderRadius: 1.5,
          cursor: "grab",
          position: "relative",
        }}></Card>
    }


  // if (editMode) {
  //   return (
  //     <Card
  //      ref={setNodeRef}
  //       style={style}
  //       {...attributes}
  //       {...listeners}
  //       sx={{
  //         bgcolor: "black",
  //         px: 2.5,
  //         height: 100,
  //         minHeight: 100,
  //         width: "80%",
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "left",
  //         textAlign: "left",
  //         borderRadius: 2,
  //         "&:hover": {
  //           border: "2px solid #f50057",
  //         },
  //         cursor: "grab",
  //         position: "relative",
  //       }}
  //     >
  //       <CardContent sx={{ color: "white", display: "flex", flexGrow: 1, p: 0 }}>
  //         <textarea
  //           style={{
  //             width: "100%",
  //             height: "100%",
  //             backgroundColor: "transparent",
  //             color: "white",
  //             border: "none",
  //             outline: "none",
  //             resize: "none",
  //           }}
  //           value={content}
  //           autoFocus
  //           placeholder="Task content"
  //           onBlur={handleBlur}
  //           onKeyDown={handleKeyDown}
  //           onChange={(e) => setContent(e.target.value)}
  //         ></textarea>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (
    <Card
      // onClick={toggleEditMode}
      ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      sx={{
        bgcolor: 'background.default',
        px: 2.5,
        height: 100,
        minHeight: 100,
        width: "90%",
        display: "flex",
        alignItems: "center",
        justifyContent: "left",
        textAlign: "left",
        borderRadius: 1,
        "&:hover": {
          border: "2px solid #f50057",
        },
        cursor: "grab",
        position: "relative",
      }}
    >
  <Link to={`/task/${task.id}`} key={task.id}>
    <CardContent sx={{ color: "white", display:- "flex", flexGrow: 1, alignItems: "center", overflowX: "none", whiteSpace: "pre-wrap", overflowY: "auto",justifyContent:'center',paddingBottom:0 }}>
      {task.content}
    </CardContent>
  </Link>

      {mouseIsOver && (
        <IconButton
          onClick={() => {
            deleteTask(task.id);
          }}
          sx={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "transparent",
            p: 0,
            "&:hover": {
              bgcolor: "transparent",
            //   color: "#f50057",
            },
          }}
        >
          <DeleteIcon sx={{ color: "white" }} />
        </IconButton>
      )}
    </Card>
  );
}

export default TaskCard;
