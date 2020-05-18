import React from "react";
import styled from "styled-components";
import { Task } from "../../App";

export const PlanListItem = ({
  task,
  setName,
  setEstimate,
  updateTask,
  completeTask,
  archiveTask,
  deleteTask,
}: {
  task: Task;
  setName: Function;
  setEstimate: Function;
  updateTask: Function;
  completeTask: Function;
  archiveTask: Function;
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
    <button onClick={() => completeTask(task.id)}>Complete</button>
    <button onClick={() => archiveTask(task.id)}>Archive</button>
    <button onClick={() => deleteTask(task.id)}>Delete</button>
  </StyledPlanListItem>
);

const StyledPlanListItem = styled.li`
  display: grid;
  grid-template-columns: 1fr 50px repeat(4, 70px);
  grid-gap: 5px;
  margin: 5px 0;
`;

const StyledInput = styled.input`
  font-size: 1.5rem;
`;
