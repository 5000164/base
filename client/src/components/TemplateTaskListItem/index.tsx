import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { DragIndicator } from "@styled-icons/material";
import { Button, TextInput } from "grommet";
import { TemplateTask } from "../../App";

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
      <StyledPlanListItem ref={provided.innerRef} {...provided.draggableProps}>
        <Handle {...provided.dragHandleProps}>
          <DragIndicator />
        </Handle>
        <TextInput
          type="text"
          value={task.name ?? ""}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => updateTask(task)}
        />
        <TextInput
          type="text"
          value={task.estimate ?? ""}
          onChange={(e) => setEstimate(Number(e.target.value))}
          onBlur={() => updateTask(task)}
        />
        <Button label="Delete" onClick={() => deleteTask(task)} />
      </StyledPlanListItem>
    )}
  </Draggable>
);

const StyledPlanListItem = styled.li`
  display: grid;
  grid-template-columns: 16px 1fr 50px repeat(1, 70px);
  grid-gap: 5px;
  margin: 5px 0;
`;

const Handle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
