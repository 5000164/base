import React from "react";
import styled from "styled-components";
import { Status, Task } from "../../App";

export const RecordedListItem = ({
  task,
  setName,
  setEstimate,
  setActual,
  updateTask,
  completeTask,
  archiveTask,
  deleteTask,
}: {
  task: Task;
  setName: Function;
  setEstimate: Function;
  setActual: Function;
  updateTask: Function;
  completeTask: Function;
  archiveTask: Function;
  deleteTask: Function;
}) => (
  <StyledRecordedListItem>
    {task.status === Status.Completed ? (
      <span role="img" aria-label="White Heavy Check Mark">
        ✅
      </span>
    ) : (
      <span role="img" aria-label="Shite Large Square">
        ⬜️
      </span>
    )}
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
  </StyledRecordedListItem>
);

const StyledRecordedListItem = styled.li`
  display: grid;
  grid-template-columns: 20px 1fr 50px 50px repeat(3, 70px);
  grid-gap: 5px;
  margin: 5px 0;
`;

const StyledInput = styled.input`
  font-size: 1.5rem;
`;
