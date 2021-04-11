import React from "react";
import styled from "styled-components";
import { DragIndicator } from "styled-icons/material";
import { Button, TextInput } from "grommet";
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
          <Button
            label="Complete"
            onClick={() =>
              completePlanTask(client, task.id).then(() => reload())
            }
          />
          <Button
            label="Archive"
            onClick={() =>
              archivePlanTask(client, task.id).then(() => reload())
            }
          />
          <Button
            label="Delete"
            onClick={() => deletePlanTask(client, task.id).then(() => reload())}
          />
          <Button
            label="Start"
            onClick={() => startTaskTrack(client, task.id).then(() => reload())}
          />
        </StyledPlanListItem>
      )}
    </Draggable>
  );
};

const StyledPlanListItem = styled.li`
  display: grid;
  grid-template-columns: 16px 1fr 50px repeat(4, 80px);
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
