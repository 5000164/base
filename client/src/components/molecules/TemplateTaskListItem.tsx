import React from "react";
import styled from "styled-components";
import { DragIndicator } from "styled-icons/material";
import { Button, TextInput } from "grommet";
import { Draggable } from "react-beautiful-dnd";
import { theme } from "../../theme";
import { TemplateTask } from "../../types/templateTask";
import { deleteTask, updateTask } from "../../repositories/templates";
import { AppContext } from "../../App";
import { TemplatesPageContext } from "../pages/TemplatesPage";

export const TemplateTaskListItem = ({
  task,
  index,
  setName,
  setEstimate,
}: {
  task: TemplateTask;
  index: number;
  setName: (name: string) => void;
  setEstimate: (estimate: number) => void;
}) => {
  const { client } = React.useContext(AppContext);
  const { reload } = React.useContext(TemplatesPageContext);

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
          <Button
            label="Delete"
            onClick={() => deleteTask(client, task.id).then(() => reload())}
          />
        </StyledTaskListItem>
      )}
    </Draggable>
  );
};

const StyledTaskListItem = styled.li`
  display: grid;
  grid-template-columns: 16px 1fr 50px repeat(1, 70px);
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
