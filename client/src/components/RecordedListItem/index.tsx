import React from "react";
import styled from "styled-components";
import { Task, Status } from "../../App";

export const RecordedListItem = ({ task }: { task: Task }) => (
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
    <span>{task.name}</span>
    <Time>{task.estimate}</Time>
    <Time>{task.actual}</Time>
  </StyledRecordedListItem>
);

const StyledRecordedListItem = styled.li`
  display: grid;
  grid-template-columns: 20px 1fr 100px 100px;
  grid-gap: 5px;
  height: 28px;
  margin: 12px 0;
  border-bottom: 1px solid hsl(235, 10%, 80%);
`;

const Time = styled.span`
  justify-self: end;
`;
