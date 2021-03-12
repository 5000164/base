import React from "react";
import styled from "styled-components";
import { Text, TextInput } from "grommet";
import { TaskTrack } from "../../types/taskTrack";
import { updateTaskTrack } from "../../repositories/taskTracks";
import { AppContext } from "../../App";
import { ElapsedTime } from "../atoms/ElapsedTime";

export const TaskTrackListItem = ({
  taskTrack,
  setStartAt,
  setStopAt,
}: {
  taskTrack: TaskTrack;
  setStartAt: (startAt: string) => void;
  setStopAt: (stopAt: string) => void;
}) => {
  const { client } = React.useContext(AppContext);

  return (
    <StyledTaskTrackListItem>
      <Text size="small">{taskTrack.task.name}</Text>
      {taskTrack.stop_at && (
        <ElapsedTime seconds={taskTrack.stop_at - taskTrack.start_at} />
      )}
      <TextInput
        type="datetime-local"
        value={format(taskTrack.start_at)}
        onChange={(e) => setStartAt(e.target.value)}
        onBlur={() => updateTaskTrack(client, taskTrack).then()}
      />
      {taskTrack.stop_at && (
        <TextInput
          type="datetime-local"
          value={format(taskTrack.stop_at)}
          onChange={(e) => setStopAt(e.target.value)}
          onBlur={() => updateTaskTrack(client, taskTrack).then()}
        />
      )}
    </StyledTaskTrackListItem>
  );
};

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
  align-items: center;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 5px;
  margin: 5px 0;
`;
