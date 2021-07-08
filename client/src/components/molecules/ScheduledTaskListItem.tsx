import React from "react";
import styled from "styled-components";
import { DragIndicator, PlayArrow } from "styled-icons/material";
import {
  Archive,
  Circle,
  DotsHorizontalRounded,
  Sun,
  Trash,
} from "styled-icons/boxicons-regular";
import { Menu, TextInput } from "grommet";
import { Draggable } from "react-beautiful-dnd";
import { theme } from "../../theme";
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
import { moveDay, toUTCUnixTime } from "../../utils/date";

export const ScheduledTaskListItem = ({
  task,
  index,
  setName,
  setEstimate,
  setScheduledDate,
  reload,
}: {
  task: Task;
  index: number;
  setName: (name: string) => void;
  setEstimate: (estimate: number) => void;
  setScheduledDate: (scheduled_date: number) => void;
  reload: () => void;
}) => {
  const { client, time } = React.useContext(AppContext);

  return (
    <Draggable draggableId={index.toString()} index={index}>
      {(provided) => (
        <StyledTaskListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Handle {...provided.dragHandleProps}>
            <StyledDragIndicator size="16" />
          </Handle>
          <StyledIcon>
            <Circle
              title="Complete"
              size="28"
              onClick={() =>
                completeTask(client, task.taskId).then(() => reload())
              }
            />
          </StyledIcon>
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
          <StyledIcon>
            <PlayArrow
              title="Start"
              size="28"
              onClick={() =>
                startTaskTrack(client, task.taskId).then(() => reload())
              }
            />
          </StyledIcon>
          <StyledMenu
            icon={
              <StyledIcon>
                <DotsHorizontalRounded title="Menu" size="28" />
              </StyledIcon>
            }
            dropAlign={{ top: "bottom", right: "right" }}
            items={[
              {
                label: (
                  <StyledItem>
                    <StyledIcon>
                      <Sun title="Tomorrow" size="24" />
                    </StyledIcon>
                    Tomorrow
                  </StyledItem>
                ),
                onClick: () => {
                  setScheduledDate(toUTCUnixTime(moveDay(time, 1)));
                  changeScheduledDate(client, task).then(() => reload());
                },
              },
              {
                label: (
                  <StyledItem>
                    <StyledIcon>
                      <Archive title="Archive" size="24" />
                    </StyledIcon>
                    Archive
                  </StyledItem>
                ),
                onClick: () =>
                  archiveTask(client, task.taskId).then(() => reload()),
              },
              {
                label: (
                  <StyledItem>
                    <StyledIcon>
                      <Trash title="Delete" size="24" />
                    </StyledIcon>
                    Delete
                  </StyledItem>
                ),
                onClick: () =>
                  deleteTask(client, task.taskId).then(() => reload()),
              },
            ]}
          />
        </StyledTaskListItem>
      )}
    </Draggable>
  );
};

const StyledTaskListItem = styled.li`
  display: grid;
  align-items: center;
  grid-template-columns: 16px 32px 1fr 64px 32px 32px;
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

const StyledItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
`;
