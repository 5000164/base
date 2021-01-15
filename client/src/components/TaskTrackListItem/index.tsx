import React from "react";
import styled from "styled-components";
import { TaskTrack } from "../../App";

export const TaskTrackListItem = ({
  taskTrack,
  stopTaskTrack,
}: {
  taskTrack: TaskTrack;
  stopTaskTrack: Function;
}) => (
  <StyledTaskTrackListItem>
    <div>{taskTrack.task_track_id}</div>
    <div>{taskTrack.task_id}</div>
    <div>{taskTrack.start_at}</div>
    <div>{taskTrack.stop_at}</div>
    <button onClick={() => stopTaskTrack(taskTrack.task_track_id)}>Stop</button>
  </StyledTaskTrackListItem>
);

const StyledTaskTrackListItem = styled.li`
  display: grid;
  grid-template-columns: repeat(4, 1fr) repeat(1, 70px);
  grid-gap: 5px;
  margin: 5px 0;
`;
