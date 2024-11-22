import React from "react";
import styled from "styled-components";
import { Menu, TextInput } from "grommet";
import { DotsHorizontalRounded } from "styled-icons/boxicons-regular";
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
      <StyledMenu
        icon={
          <StyledIcon>
            <DotsHorizontalRounded title="Menu" size="28" />
          </StyledIcon>
        }
        dropAlign={{ top: "bottom", right: "right" }}
        items={[
          {
            label: <span>Complete</span>,
            onClick: () => {
              completeTask(client, task.taskId).then(() => reload());
            },
          },
          {
            label: <span>Archive</span>,
            onClick: () => {
              archiveTask(client, task.taskId).then(() => reload());
            },
          },
          {
            label: <span>Delete</span>,
            onClick: () => {
              deleteTask(client, task.taskId).then(() => reload());
            },
          },
        ]}
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

const StyledIcon = styled.div`
  width: 32px;
  text-align: center;
  cursor: pointer;
`;

const StyledMenu = styled(Menu)`
  & > div {
    padding: 0;
  }
`;
