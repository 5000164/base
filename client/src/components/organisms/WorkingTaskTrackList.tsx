import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { theme } from "../../theme";
import { TaskTrack } from "../../types/taskTrack";
import { fetchWorkingTaskTracks } from "../../repositories/taskTracks";
import { AppContext } from "../../App";
import { BacklogPageContext } from "../pages/BacklogPage";
import { WorkingTaskTrackListItem } from "../molecules/WorkingTaskTrackListItem";

export const WorkingTaskTrackList = () => {
  const { client } = React.useContext(AppContext);
  const { reloadCount } = React.useContext(BacklogPageContext);

  const [taskTracks, setTaskTracks] = useState([] as TaskTrack[]);
  useEffect(() => {
    fetchWorkingTaskTracks(client).then((taskTracks) =>
      setTaskTracks(taskTracks)
    );
  }, [client, reloadCount]);

  return (
    <>
      {taskTracks.length > 0 ? (
        <StyledTaskTrackList>
          {taskTracks.map((taskTrack, index) => (
            <WorkingTaskTrackListItem key={index} taskTrack={taskTrack} />
          ))}
        </StyledTaskTrackList>
      ) : (
        <></>
      )}
    </>
  );
};

const StyledTaskTrackList = styled.ul`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  margin: 0 auto;
  padding: 4px 16px 8px 16px;
  background: ${theme.global.colors.background};
  box-shadow: 0 0 2px rgba(255, 255, 255, 0.2);
`;
