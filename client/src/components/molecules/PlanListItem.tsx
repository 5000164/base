import React from "react";
import styled from "styled-components";
import { DragIndicator, PlayArrow } from "styled-icons/material";
import { Archive, Check, Trash } from "styled-icons/boxicons-regular";
import { TextInput } from "grommet";
import { Draggable } from "react-beautiful-dnd";
import { theme } from "../../theme";
import { PlanTask } from "../../types/planTask";
import {
  archivePlanTask,
  completePlanTask,
  deletePlanTask,
  startTaskTrack,
  updatePlanTask,
} from "../../repositories/planTasks";
import { AppContext } from "../../App";
import { PlanPageContext } from "../pages/PlanPage";

export const PlanListItem = ({
  task,
  index,
  setName,
  setEstimate,
}: {
  task: PlanTask;
  index: number;
  setName: (name: string) => void;
  setEstimate: (estimate: number) => void;
}) => {
  const { client } = React.useContext(AppContext);
  const { reload } = React.useContext(PlanPageContext);

  return (
    <Draggable draggableId={index.toString()} index={index}>
      {(provided) => (
        <StyledPlanListItem
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
            onBlur={() => updatePlanTask(client, task).then()}
          />
          <TextInput
            type="text"
            value={task.estimate ?? ""}
            onChange={(e) => setEstimate(Number(e.target.value))}
            onBlur={() => updatePlanTask(client, task).then()}
          />
          <div>
            <StyledIcon>
              <Check
                title="Complete"
                size="28"
                onClick={() =>
                  completePlanTask(client, task.id).then(() => reload())
                }
              />
            </StyledIcon>
            <StyledIcon>
              <Archive
                title="Archive"
                size="24"
                onClick={() =>
                  archivePlanTask(client, task.id).then(() => reload())
                }
              />
            </StyledIcon>
            <StyledIcon>
              <Trash
                title="Delete"
                size="24"
                onClick={() =>
                  deletePlanTask(client, task.id).then(() => reload())
                }
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
        </StyledPlanListItem>
      )}
    </Draggable>
  );
};

const StyledPlanListItem = styled.li`
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
