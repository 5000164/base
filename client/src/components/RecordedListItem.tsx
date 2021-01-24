import React from "react";
import styled from "styled-components";
import { Button, TextInput } from "grommet";
import { Status, Task } from "../App";

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
  </StyledRecordedListItem>
);

const StyledRecordedListItem = styled.li`
  display: grid;
  grid-template-columns: 20px 1fr 50px 50px repeat(3, 70px);
  grid-gap: 5px;
  margin: 5px 0;
`;
