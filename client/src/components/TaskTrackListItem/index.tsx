import React from "react";
import styled from "styled-components";
import { Button, Text, TextInput } from "grommet";
import { TaskTrack } from "../../App";

export const TaskTrackListItem = ({
  taskTrack,
  onlyWorking,
  stopTaskTrack,
  setStartAt,
  setStopAt,
  updateTaskTrack,
}: {
  taskTrack: TaskTrack;
  onlyWorking?: boolean;
  stopTaskTrack: Function;
  setStartAt: Function;
  setStopAt: Function;
  updateTaskTrack: Function;
}) => (
  <>
    {onlyWorking ? (
      <StyledWorkingTaskTrackListItem>
        <Text size="small">{taskTrack.task.name}</Text>
        <Button
          label="Stop"
          onClick={() => stopTaskTrack(taskTrack.task_track_id)}
        />
      </StyledWorkingTaskTrackListItem>
    ) : (
      <StyledTaskTrackListItem>
        <Text>{taskTrack.task.name}</Text>
        <TextInput
          type="datetime-local"
          value={format(taskTrack.start_at)}
          onChange={(e) => setStartAt(e.target.value)}
          onBlur={() => updateTaskTrack(taskTrack)}
        />
        <TextInput
          type="datetime-local"
          value={format(taskTrack.stop_at)}
          onChange={(e) => setStopAt(e.target.value)}
          onBlur={() => updateTaskTrack(taskTrack)}
        />
      </StyledTaskTrackListItem>
    )}
  </>
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

const StyledWorkingTaskTrackListItem = styled.li`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 80px;
  grid-gap: 5px;
  margin: 5px 0;
`;

const StyledTaskTrackListItem = styled.li`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr repeat(2, 320px);
  grid-gap: 5px;
  margin: 5px 0;
`;
