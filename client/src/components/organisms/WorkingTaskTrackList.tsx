import React, { useEffect, useState } from "react";
import styled from "styled-components";
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
  width: min(1024px, 100%);
  margin: 80px auto 4px;
  padding: 0;
`;
