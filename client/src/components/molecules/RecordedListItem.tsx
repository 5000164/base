import React from "react";
import styled from "styled-components";
import { Button, TextInput } from "grommet";
import { Status } from "shared/src/types/status";
import { Task } from "../../types/task";
import {
  archiveTask,
  completeTask,
  deleteTask,
  updateTask,
} from "../../repositories/tasks";
import { AppContext } from "../../App";
import { ReviewPageContext } from "../pages/ReviewPage";
import { ElapsedTime } from "../atoms/ElapsedTime";

export const RecordedListItem = ({
  task,
  seconds,
  setName,
  setEstimate,
}: {
  task: Task;
  seconds: number;
  setName: (name: string) => void;
  setEstimate: (estimate: number) => void;
}) => {
  const { client } = React.useContext(AppContext);
  const { reload } = React.useContext(ReviewPageContext);

  return (
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
        onBlur={() => updateTask(client, task).then()}
      />
      <TextInput
        type="text"
        value={task.estimate ?? ""}
        onChange={(e) => setEstimate(Number(e.target.value))}
        onBlur={() => updateTask(client, task).then()}
      />
      <ElapsedTime seconds={seconds} />
      <Button
        label="Complete"
        onClick={() => completeTask(client, task.id).then(() => reload())}
      />
      <Button
        label="Archive"
        onClick={() => archiveTask(client, task.id).then(() => reload())}
      />
      <Button
        label="Delete"
        onClick={() => deleteTask(client, task.id).then(() => reload())}
      />
    </StyledRecordedListItem>
  );
};

const StyledRecordedListItem = styled.li`
  display: grid;
  grid-template-columns: 20px 1fr 50px 100px repeat(3, 70px);
  grid-gap: 5px;
  align-items: center;
  margin: 5px 0;
`;
