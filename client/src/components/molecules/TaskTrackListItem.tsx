import React from "react";
import styled from "styled-components";
import { DotsHorizontalRounded, Trash } from "styled-icons/boxicons-regular";
import { ClockFill } from "styled-icons/bootstrap";
import { DropButton, Menu, Text, TextInput } from "grommet";
import { TaskTrack } from "../../types/taskTrack";
import {
  deleteTaskTrack,
  updateTaskTrack,
} from "../../repositories/taskTracks";
import {
  dateTimeStringToLocalTime,
  formatToDateTimeString,
} from "../../utils/date";
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
  const { client } = React.useContext(AppContext);
  const { reload } = React.useContext(TaskTracksPageContext);

  return (
    <StyledTaskTrackListItem>
      <Text size="small">{taskTrack.task.name}</Text>
      {taskTrack.stopAt ? (
        <ElapsedTime seconds={taskTrack.stopAt - taskTrack.startAt} />
      ) : (
        <StyledWorking>Working</StyledWorking>
      )}
      <DropButton
        icon={
          <StyledIcon>
            <ClockFill size="24" />
          </StyledIcon>
        }
        plain={true}
        dropAlign={{ top: "bottom", right: "right" }}
        dropContent={
          <>
            <Text>Start: </Text>
            <StyledTextInput
              type="datetime-local"
              step="1"
              value={formatToDateTimeString(taskTrack.startAt)}
              onChange={(e) => {
                setStartAt(dateTimeStringToLocalTime(e.target.value));
                updateTaskTrack(client, taskTrack).then();
              }}
            />
            {taskTrack.stopAt ? (
              <>
                <Text>Stop: </Text>
                <StyledTextInput
                  type="datetime-local"
                  step="1"
                  value={formatToDateTimeString(taskTrack.stopAt)}
                  onChange={(e) => {
                    setStopAt(dateTimeStringToLocalTime(e.target.value));
                    updateTaskTrack(client, taskTrack).then();
                  }}
                />
              </>
            ) : (
              <></>
            )}
          </>
        }
      />
      <StyledMenu
        icon={
          <StyledIcon>
            <DotsHorizontalRounded title="Menu" size="28" />
          </StyledIcon>
        }
        dropAlign={{ top: "bottom", right: "right" }}
        items={[
          {
            label: (
              <StyledItem>
                <StyledIcon>
                  <Trash title="Delete" size="24" />
                </StyledIcon>
                Delete
              </StyledItem>
            ),
            onClick: () =>
              window.confirm("削除しますか？")
                ? deleteTaskTrack(client, taskTrack.taskTrackId).then(() =>
                    reload()
                  )
                : undefined,
          },
        ]}
      />
    </StyledTaskTrackListItem>
  );
};

const StyledTaskTrackListItem = styled.li`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 160px 32px 32px;
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

const StyledMenu = styled(Menu)`
  & > div {
    padding: 0;
  }
`;

const StyledItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
`;

const StyledIcon = styled.div`
  width: 32px;
  text-align: center;
  cursor: pointer;
`;
