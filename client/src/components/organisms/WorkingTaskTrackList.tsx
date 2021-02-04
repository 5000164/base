import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { theme } from "../../theme";
import { TaskTrack } from "../../types/taskTrack";
import { fetchWorkingTaskTracks } from "../../repositories/taskTracks";
import { AppContext } from "../../App";
import { PlanPageContext } from "../pages/PlanPage";
import { WorkingTaskTrackListItem } from "../molecules/WorkingTaskTrackListItem";

export const WorkingTaskTrackList = () => {
  const { client } = React.useContext(AppContext);
  const { reloadCount } = React.useContext(PlanPageContext);

  const [taskTracks, setTaskTracks] = useState([] as TaskTrack[]);
  useEffect(() => {
    fetchWorkingTaskTracks(client).then((taskTracks) =>
      setTaskTracks(taskTracks)
    );
  }, [client, reloadCount]);

  return (
    <StyledTaskTrackList>
      {taskTracks.map((taskTrack, index) => (
        <WorkingTaskTrackListItem key={index} taskTrack={taskTrack} />
      ))}
    </StyledTaskTrackList>
  );
};

const StyledTaskTrackList = styled.ul`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: min(1024px, 100%);
  margin: 0 auto;
  padding: 0;
  background: ${theme.global.colors.background};
`;
