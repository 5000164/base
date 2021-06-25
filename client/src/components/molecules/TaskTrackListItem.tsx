import React from "react";
import styled from "styled-components";
import { Button, Text, TextInput } from "grommet";
import { TaskTrack } from "../../types/taskTrack";
import {
  deleteTaskTrack,
  updateTaskTrack,
} from "../../repositories/taskTracks";
import { formatToTimeString, setTime } from "../../utils/date";
import { AppContext } from "../../App";
import { TaskTracksPageContext } from "../pages/TaskTracksPage";
import { ElapsedTime } from "../atoms/ElapsedTime";

export const TaskTrackListItem = ({
  taskTrack,
  setStartAt,
  setStopAt,
}: {
  taskTrack: TaskTrack;
  setStartAt: (startAt: number) => void;
  setStopAt: (stopAt: number) => void;
}) => {
  const { client, time } = React.useContext(AppContext);
  const { reload } = React.useContext(TaskTracksPageContext);

  return (
    <StyledTaskTrackListItem>
      <Text size="small">{taskTrack.task.name}</Text>
      {taskTrack.stopAt ? (
        <ElapsedTime seconds={taskTrack.stopAt - taskTrack.startAt} />
      ) : (
        <StyledWorking>Working</StyledWorking>
      )}
      <StyledTextInput
        type="time"
        step="1"
        value={formatToTimeString(taskTrack.startAt)}
        onChange={(e) => setStartAt(setTime(time, e.target.value))}
        onBlur={() => updateTaskTrack(client, taskTrack).then()}
      />
      {taskTrack.stopAt ? (
        <StyledTextInput
          type="time"
          step="1"
          value={formatToTimeString(taskTrack.stopAt)}
          onChange={(e) => setStopAt(setTime(time, e.target.value))}
          onBlur={() => updateTaskTrack(client, taskTrack).then()}
        />
      ) : (
        <div />
      )}
      <Button
        label="Delete"
        onClick={() =>
          window.confirm("削除しますか？")
            ? deleteTaskTrack(client, taskTrack.taskTrackId).then(() =>
                reload()
              )
            : undefined
        }
      />
    </StyledTaskTrackListItem>
  );
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
