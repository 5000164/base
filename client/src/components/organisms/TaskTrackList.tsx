import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { setStartAt, setStopAt, TaskTrack } from "../../types/taskTrack";
import { fetchTaskTracks } from "../../repositories/taskTracks";
import { AppContext } from "../../App";
import { TaskTracksPageContext } from "../pages/TaskTracksPage";
import { TaskTrackListItem } from "../molecules/TaskTrackListItem";

export const TaskTrackList = () => {
  const { client, date } = React.useContext(AppContext);
  const { reloadCount } = React.useContext(TaskTracksPageContext);

  const [taskTracks, setTaskTracks] = useState([] as TaskTrack[]);
  useEffect(() => {
    fetchTaskTracks(client, date).then((taskTracks) =>
      setTaskTracks(taskTracks)
    );
  }, [client, date, reloadCount]);

  return (
    <>
      <StyledTaskTrackList>
        {taskTracks.map((taskTrack, index) => (
          <TaskTrackListItem
            key={index}
            taskTrack={taskTrack}
            setStartAt={(v: string) =>
              setStartAt(taskTracks, setTaskTracks, index, v)
            }
            setStopAt={(v: string) =>
              setStopAt(taskTracks, setTaskTracks, index, v)
            }
          />
        ))}
      </StyledTaskTrackList>
    </>
  );
};

const StyledTaskTrackList = styled.ul`
  width: min(1024px, calc(100% - 16px));
  margin: 8px auto 0;
  padding: 0;
`;
