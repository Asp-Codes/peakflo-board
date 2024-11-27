import { useState } from "react";
import { Link } from "react-router-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "../types";
import { Card, CardContent, IconButton } from "@mui/material";
import { colors } from "../theme/colors";
import { DeleteOutline } from "@mui/icons-material";

interface Props {
  task: Task;
  deleteTask: (id: string) => void;
}

function TaskCard({ task, deleteTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        sx={{
          bgcolor: "background.default",
          px: 2.5,
          height: 100,
          minHeight: 100,
          opacity: 0.5,
          width: "90%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "left",
          borderRadius: 1.5,
          cursor: "grab",
          position: "relative",
        }}
      ></Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      sx={{
        bgcolor: "background.default",
        px: 2.5,
        height: 100,
        minHeight: 100,
        width: "90%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
        <CardContent
          sx={{
            color: "white",
            display: "flex",
            flexWrap: "wrap",
            flexGrow: 1,
            alignItems: "center",
            // overflowX: "auto", // Hide overflow content horizontally
            overflowY: "auto", // Allow vertical overflow if needed
            whiteSpace: "pre-wrap", // Prevent text from wrapping
            // textOverflow: "ellipsis", // Display ellipsis (...) for overflowing text
            justifyContent: "center",
            // width: "50%",
            pr: 24,
            // border: "1px solid #f50057",
          }}
        >
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
            width: "auto",
            height: "auto",
            color: "gray",
            p: 1,
            "&:hover": {
              bgcolor: colors.columnBackground,
              color: "#f50057",
            },
          }}
        >
          <DeleteOutline sx={{ color: "white-400" }} />
        </IconButton>
      )}
    </Card>
  );
}

export default TaskCard;
