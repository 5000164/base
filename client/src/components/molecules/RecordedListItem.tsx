import React from "react";
import styled from "styled-components";
import { Button, TextInput } from "grommet";
import { Status } from "shared/src/types/status";
import { PlanTask } from "../../types/planTask";
import {
  archivePlanTask,
  completePlanTask,
  deletePlanTask,
  updatePlanTask,
} from "../../repositories/planTasks";
import { AppContext } from "../../App";
import { PlanPageContext } from "../pages/PlanPage";

export const RecordedListItem = ({
  task,
  setName,
  setEstimate,
  setActual,
}: {
  task: PlanTask;
  setName: (name: string) => void;
  setEstimate: (estimate: number) => void;
  setActual: (actual: number) => void;
}) => {
  const { client } = React.useContext(AppContext);
  const { reload } = React.useContext(PlanPageContext);

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
        onBlur={() => updatePlanTask(client, task).then()}
      />
      <TextInput
        type="text"
        value={task.estimate ?? ""}
        onChange={(e) => setEstimate(Number(e.target.value))}
        onBlur={() => updatePlanTask(client, task).then()}
      />
      <TextInput
        type="text"
        value={task.actual ?? ""}
        onChange={(e) => setActual(Number(e.target.value))}
        onBlur={() => updatePlanTask(client, task).then()}
      />
      <Button
        label="Complete"
        onClick={() => completePlanTask(client, task.id).then(() => reload())}
      />
      <Button
        label="Archive"
        onClick={() => archivePlanTask(client, task.id).then(() => reload())}
      />
      <Button
        label="Delete"
        onClick={() => deletePlanTask(client, task.id).then(() => reload())}
      />
    </StyledRecordedListItem>
  );
};

const StyledRecordedListItem = styled.li`
  display: grid;
  grid-template-columns: 20px 1fr 50px 50px repeat(3, 70px);
  grid-gap: 5px;
  margin: 5px 0;
`;
