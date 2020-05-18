import React from "react";
import styled from "styled-components";
import { Task } from "../../App";

export const CompletedListItem = ({ task }: { task: Task }) => (
  <StyledCompletedListItem>
    <span role="img" aria-label="White Heavy Check Mark">
      ✅
    </span>
    <span>{task.name}</span>
    <Time>{task.estimate}</Time>
    <Time>{task.actual}</Time>
  </StyledCompletedListItem>
);

const StyledCompletedListItem = styled.li`
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
