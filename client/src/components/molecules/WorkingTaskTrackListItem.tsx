import React from "react";
import styled from "styled-components";
import { PlayArrow } from "styled-icons/material";
import { Button, Text } from "grommet";
import { theme } from "../../theme";
import { TaskTrack } from "../../types/taskTrack";
import { stopTaskTrack } from "../../repositories/taskTracks";
import { AppContext } from "../../App";
import { PlanPageContext } from "../pages/PlanPage";
import { Timer } from "../atoms/Timer";

export const WorkingTaskTrackListItem = ({
  taskTrack,
}: {
  taskTrack: TaskTrack;
}) => {
  const { client } = React.useContext(AppContext);
  const { reload } = React.useContext(PlanPageContext);

  return (
    <StyledWorkingTaskTrackListItem>
      <WorkingIcon size="26" />
      <Text size="small">{taskTrack.task.name}</Text>
      <Timer startAt={taskTrack.start_at!} />
      <Button
        label="Stop"
        onClick={() =>
          stopTaskTrack(client, taskTrack.task_track_id).then(() => reload())
        }
      />
    </StyledWorkingTaskTrackListItem>
  );
};

const StyledWorkingTaskTrackListItem = styled.li`
  display: grid;
  align-items: center;
  grid-template-columns: 26px 1fr 160px 80px;
  grid-gap: 8px;
  margin: 8px 0;
`;

const WorkingIcon = styled(PlayArrow)`
  color: ${theme.global.colors["status-ok"]};
`;
