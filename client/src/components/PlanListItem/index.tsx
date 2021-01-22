import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { DragIndicator } from "@styled-icons/material";
import { Button, TextInput } from "grommet";
import { Task } from "../../App";
import { theme } from "../../theme";

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
          <StyledDragIndicator />
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
        <TextInput
          type="text"
          value={task.actual ?? ""}
          onChange={(e) => setActual(Number(e.target.value))}
          onBlur={() => updateTask(task)}
        />
        <Button label="Complete" onClick={() => completeTask(task.id)} />
        <Button label="Archive" onClick={() => archiveTask(task.id)} />
        <Button label="Delete" onClick={() => deleteTask(task.id)} />
        <Button label="Start" onClick={() => startTaskTrack(task.id)} />
      </StyledPlanListItem>
    )}
  </Draggable>
);

const StyledPlanListItem = styled.li`
  display: grid;
  grid-template-columns: 16px 1fr 50px 50px repeat(4, 80px);
  grid-gap: 5px;
  margin: 5px 0;
`;

const Handle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledDragIndicator = styled(DragIndicator)`
  color: ${theme.global.colors.text};
`;
