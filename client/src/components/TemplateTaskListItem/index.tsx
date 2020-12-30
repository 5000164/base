import React from "react";
import styled from "styled-components";
import { TemplateTask } from "../../App";

export const TemplateTaskListItem = ({
  task,
  setName,
  setEstimate,
  updateTask,
  deleteTask,
}: {
  task: TemplateTask;
  setName: Function;
  setEstimate: Function;
  updateTask: Function;
  deleteTask: Function;
}) => (
  <StyledPlanListItem>
    <StyledInput
      type="text"
      value={task.name ?? ""}
      onChange={(e) => setName(e.target.value)}
    />
    <StyledInput
      type="text"
      value={task.estimate ?? ""}
      onChange={(e) => setEstimate(Number(e.target.value))}
    />
    <button onClick={() => updateTask(task)}>Update</button>
    <button onClick={() => deleteTask(task)}>Delete</button>
  </StyledPlanListItem>
);

const StyledPlanListItem = styled.li`
  display: grid;
  grid-template-columns: 1fr 50px repeat(2, 70px);
  grid-gap: 5px;
  margin: 5px 0;
`;

const StyledInput = styled.input`
  font-size: 1.5rem;
`;
