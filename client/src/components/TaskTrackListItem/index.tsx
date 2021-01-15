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
    <div>{taskTrack.task.name}</div>
    <div>
      {taskTrack.start_at
        ? new Date(taskTrack.start_at * 1000).toLocaleString("ja-JP")
        : ""}
    </div>
    <div>
      {taskTrack.stop_at
        ? new Date(taskTrack.stop_at * 1000).toLocaleString("ja-JP")
        : ""}
    </div>
    <button onClick={() => stopTaskTrack(taskTrack.task_track_id)}>Stop</button>
  </StyledTaskTrackListItem>
);

const StyledTaskTrackListItem = styled.li`
  display: grid;
  grid-template-columns: repeat(3, 1fr) repeat(1, 70px);
  grid-gap: 5px;
  margin: 5px 0;
`;
