import React from "react";
import styled from "styled-components";
import { DragIndicator, PlayArrow } from "styled-icons/material";
import { Archive, Check, Trash } from "styled-icons/boxicons-regular";
import { TextInput } from "grommet";
import { Draggable } from "react-beautiful-dnd";
import { theme } from "../../theme";
import { Task } from "../../types/task";
import {
  archiveTask,
  completeTask,
  deleteTask,
  startTaskTrack,
  updateTask,
} from "../../repositories/tasks";
import { AppContext } from "../../App";
import { TasksPageContext } from "../pages/TasksPage";

export const TaskListItem = ({
  task,
  index,
  setName,
  setEstimate,
}: {
  task: Task;
  index: number;
  setName: (name: string) => void;
  setEstimate: (estimate: number) => void;
}) => {
  const { client } = React.useContext(AppContext);
  const { reload } = React.useContext(TasksPageContext);

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
          <div>
            <StyledIcon>
              <Check
                title="Complete"
                size="28"
                onClick={() =>
                  completeTask(client, task.id).then(() => reload())
                }
              />
            </StyledIcon>
            <StyledIcon>
              <Archive
                title="Archive"
                size="24"
                onClick={() =>
                  archiveTask(client, task.id).then(() => reload())
                }
              />
            </StyledIcon>
            <StyledIcon>
              <Trash
                title="Delete"
                size="24"
                onClick={() => deleteTask(client, task.id).then(() => reload())}
              />
            </StyledIcon>
            <StyledIcon>
              <PlayArrow
                title="Start"
                size="28"
                onClick={() =>
                  startTaskTrack(client, task.id).then(() => reload())
                }
              />
            </StyledIcon>
          </div>
        </StyledTaskListItem>
      )}
    </Draggable>
  );
};

const StyledTaskListItem = styled.li`
  display: grid;
  align-items: center;
  grid-template-columns: 16px 1fr 50px 160px;
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
  display: inline-block;
  width: 32px;
  margin-left: 8px;
  text-align: center;
  cursor: pointer;
`;
