import React from "react";
import styled from "styled-components";
import { TaskTrack } from "../../App";

export const TaskTrackListItem = ({
  taskTrack,
  stopTaskTrack,
  setStartAt,
  setStopAt,
  updateTaskTrack,
}: {
  taskTrack: TaskTrack;
  stopTaskTrack: Function;
  setStartAt: Function;
  setStopAt: Function;
  updateTaskTrack: Function;
}) => (
  <StyledTaskTrackListItem>
    <div>{taskTrack.task.name}</div>
    <StyledInput
      type="datetime-local"
      value={format(taskTrack.start_at)}
      onChange={(e) => setStartAt(e.target.value)}
      onBlur={() => updateTaskTrack(taskTrack)}
    />
    <StyledInput
      type="datetime-local"
      value={format(taskTrack.stop_at)}
      onChange={(e) => setStopAt(e.target.value)}
      onBlur={() => updateTaskTrack(taskTrack)}
    />
    <button onClick={() => stopTaskTrack(taskTrack.task_track_id)}>Stop</button>
  </StyledTaskTrackListItem>
);

const format = (time?: number) => {
  if (time) {
    const date = new Date(time * 1000);
    return [
      date.getFullYear().toString().padStart(4, "0"),
      "-",
      (date.getMonth() + 1).toString().padStart(2, "0"),
      "-",
      date.getDate().toString().padStart(2, "0"),
      "T",
      date.getHours().toString().padStart(2, "0"),
      ":",
      date.getMinutes().toString().padStart(2, "0"),
      ":",
      date.getSeconds().toString().padStart(2, "0"),
    ].join("");
  } else {
    return "";
  }
};

const StyledTaskTrackListItem = styled.li`
  display: grid;
  grid-template-columns: repeat(3, 1fr) repeat(1, 70px);
  grid-gap: 5px;
  margin: 5px 0;
`;

const StyledInput = styled.input`
  font-size: 1.5rem;
`;
