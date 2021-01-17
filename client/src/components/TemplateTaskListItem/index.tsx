import React from "react";
import styled from "styled-components";
import { TemplateTask } from "../../App";
import { Draggable } from "react-beautiful-dnd";

export const TemplateTaskListItem = ({
  task,
  index,
  setName,
  setEstimate,
  updateTask,
  deleteTask,
}: {
  task: TemplateTask;
  index: number;
  setName: Function;
  setEstimate: Function;
  updateTask: Function;
  deleteTask: Function;
}) => (
  <Draggable draggableId={index.toString()} index={index}>
    {(provided) => (
      <StyledPlanListItem
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
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
        <button onClick={() => deleteTask(task)}>Delete</button>
      </StyledPlanListItem>
    )}
  </Draggable>
);

const StyledPlanListItem = styled.li`
  display: grid;
  grid-template-columns: 1fr 50px repeat(1, 70px);
  grid-gap: 5px;
  margin: 5px 0;
`;

const StyledInput = styled.input`
  font-size: 1.5rem;
`;
