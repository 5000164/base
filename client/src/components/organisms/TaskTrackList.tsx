import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { setStartAt, setStopAt, TaskTrack } from "../../types/taskTrack";
import { fetchTaskTracks } from "../../repositories/taskTracks";
import { AppContext } from "../../App";
import { TaskTrackListItem } from "../molecules/TaskTrackListItem";

export const TaskTrackList = () => {
  const { client, date } = React.useContext(AppContext);

  const [taskTracks, setTaskTracks] = useState([] as TaskTrack[]);
  useEffect(() => {
    fetchTaskTracks(client, date).then((taskTracks) =>
      setTaskTracks(taskTracks)
    );
  }, [client, date]);

  return (
    <>
      <StyledTaskTrackList>
        {taskTracks.map((taskTrack, index) => (
          <TaskTrackListItem
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
  width: min(1024px, 100%);
  margin: 80px auto 4px;
  padding: 0;
`;
