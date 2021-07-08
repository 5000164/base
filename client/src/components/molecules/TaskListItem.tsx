import React from "react";
import styled from "styled-components";
import { PlayArrow } from "styled-icons/material";
import { Archive, Check, Trash } from "styled-icons/boxicons-regular";
import { TextInput } from "grommet";
import { Task } from "../../types/task";
import {
  archiveTask,
  changeScheduledDate,
  completeTask,
  deleteTask,
  updateTask,
} from "../../repositories/tasks";
import { startTaskTrack } from "../../repositories/taskTracks";
import { AppContext } from "../../App";
import {
  dateStringToUTCMidnightTime,
  formatToDateString,
} from "../../utils/date";

export const TaskListItem = ({
  task,
  setName,
  setEstimate,
  setScheduledDate,
  reload,
}: {
  task: Task;
  setName: (name: string) => void;
  setEstimate: (estimate: number) => void;
  setScheduledDate: (scheduled_date: number) => void;
  reload: () => void;
}) => {
  const { client } = React.useContext(AppContext);

  return (
    <StyledTaskListItem>
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
      <StyledTextInput
        type="date"
        value={task.scheduledDate ? formatToDateString(task.scheduledDate) : ""}
        onChange={(e) =>
          setScheduledDate(dateStringToUTCMidnightTime(e.target.value))
        }
        onBlur={() => changeScheduledDate(client, task).then(() => reload())}
      />
      <div>
        <StyledIcon>
          <Check
            title="Complete"
            size="28"
            onClick={() =>
              completeTask(client, task.taskId).then(() => reload())
            }
          />
        </StyledIcon>
        <StyledIcon>
          <Archive
            title="Archive"
            size="24"
            onClick={() =>
              archiveTask(client, task.taskId).then(() => reload())
            }
          />
        </StyledIcon>
        <StyledIcon>
          <Trash
            title="Delete"
            size="24"
            onClick={() => deleteTask(client, task.taskId).then(() => reload())}
          />
        </StyledIcon>
        <StyledIcon>
          <PlayArrow
            title="Start"
            size="28"
            onClick={() =>
              startTaskTrack(client, task.taskId).then(() => reload())
            }
          />
        </StyledIcon>
      </div>
    </StyledTaskListItem>
  );
};

const StyledTaskListItem = styled.li`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 40px 176px 160px;
  grid-gap: 5px;
  margin: 5px 0;
`;

const StyledTextInput = styled(TextInput)`
  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
`;

const StyledIcon = styled.div`
  display: inline-block;
  width: 32px;
  margin-left: 8px;
  text-align: center;
  cursor: pointer;
`;
