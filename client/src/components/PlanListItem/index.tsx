import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { DragIndicator } from "@styled-icons/material";
import { Task } from "../../App";

export const PlanListItem = ({
  task,
  index,
  setName,
  setEstimate,
  setActual,
  updateTask,
  completeTask,
  archiveTask,
  deleteTask,
  startTaskTrack,
}: {
  task: Task;
  index: number;
  setName: Function;
  setEstimate: Function;
  setActual: Function;
  updateTask: Function;
  completeTask: Function;
  archiveTask: Function;
  deleteTask: Function;
  startTaskTrack: Function;
}) => (
  <Draggable draggableId={index.toString()} index={index}>
    {(provided) => (
      <StyledPlanListItem ref={provided.innerRef} {...provided.draggableProps}>
        <Handle {...provided.dragHandleProps}>
          <DragIndicator />
        </Handle>
        <StyledInput
          type="text"
          value={task.name ?? ""}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => updateTask(task)}
        />
        <StyledInput
          type="text"
          value={task.estimate ?? ""}
          onChange={(e) => setEstimate(Number(e.target.value))}
          onBlur={() => updateTask(task)}
        />
        <StyledInput
          type="text"
          value={task.actual ?? ""}
          onChange={(e) => setActual(Number(e.target.value))}
          onBlur={() => updateTask(task)}
        />
        <button onClick={() => completeTask(task.id)}>Complete</button>
        <button onClick={() => archiveTask(task.id)}>Archive</button>
        <button onClick={() => deleteTask(task.id)}>Delete</button>
        <button onClick={() => startTaskTrack(task.id)}>Start</button>
      </StyledPlanListItem>
    )}
  </Draggable>
);

const StyledPlanListItem = styled.li`
  display: grid;
  grid-template-columns: 16px 1fr 50px 50px repeat(4, 70px);
  grid-gap: 5px;
  margin: 5px 0;
`;

const Handle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled.input`
  font-size: 1.5rem;
`;
