import React from "react";
import styled from "styled-components";
import { Button, Text, TextInput } from "grommet";
import { TaskTrack } from "../../types/taskTrack";
import {
  deleteTaskTrack,
  updateTaskTrack,
} from "../../repositories/taskTracks";
import { AppContext } from "../../App";
import { TaskTracksPageContext } from "../pages/TaskTracksPage";
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
  const { client, date } = React.useContext(AppContext);
  const { reload } = React.useContext(TaskTracksPageContext);

  return (
    <StyledTaskTrackListItem>
      <Text size="small">{taskTrack.task.name}</Text>
      {taskTrack.stop_at ? (
        <ElapsedTime seconds={taskTrack.stop_at - taskTrack.start_at} />
      ) : (
        <StyledWorking>Working</StyledWorking>
      )}
      <StyledTextInput
        type="time"
        step="1"
        value={formatToTime(taskTrack.start_at)}
        onChange={(e) => setStartAt(formatToDatetime(date, e.target.value))}
        onBlur={() => updateTaskTrack(client, taskTrack).then()}
      />
      {taskTrack.stop_at ? (
        <StyledTextInput
          type="time"
          step="1"
          value={formatToTime(taskTrack.stop_at)}
          onChange={(e) => setStopAt(formatToDatetime(date, e.target.value))}
          onBlur={() => updateTaskTrack(client, taskTrack).then()}
        />
      ) : (
        <div />
      )}
      <Button
        label="Delete"
        onClick={() =>
          window.confirm("削除しますか？")
            ? deleteTaskTrack(client, taskTrack.task_track_id).then(() =>
                reload()
              )
            : undefined
        }
      />
    </StyledTaskTrackListItem>
  );
};

const formatToTime = (time: number) => {
  const date = new Date(time * 1000);
  return [
    date.getHours().toString().padStart(2, "0"),
    ":",
    date.getMinutes().toString().padStart(2, "0"),
    ":",
    date.getSeconds().toString().padStart(2, "0"),
  ].join("");
};

const formatToDatetime = (dateString: string, timeString: string) => {
  const times = timeString.split(":").map((t) => parseInt(t, 10));
  const date = new Date(
    new Date(Date.parse(dateString)).setHours(times[0], times[1], times[2], 0)
  );
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
};

const StyledTaskTrackListItem = styled.li`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 80px repeat(2, 120px) 80px;
  grid-gap: 5px;
  margin: 5px 0;
`;

const StyledWorking = styled.div`
  text-align: right;
`;

const StyledTextInput = styled(TextInput)`
  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
`;
