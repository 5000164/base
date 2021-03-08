import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { setStartAt, setStopAt, TaskTrack } from "../../types/taskTrack";
import { fetchTaskTracks } from "../../repositories/taskTracks";
import { AppContext } from "../../App";
import { TaskTrackListItem } from "../molecules/TaskTrackListItem";
import { TaskTracksDate } from "../atoms/TaskTracksDate";

export const TaskTrackList = () => {
  const { client } = React.useContext(AppContext);

  const [taskTracks, setTaskTracks] = useState([] as TaskTrack[]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  useEffect(() => {
    fetchTaskTracks(client, date).then((taskTracks) =>
      setTaskTracks(taskTracks)
    );
  }, [client, date]);

  return (
    <>
      <TaskTracksDate date={date} setDate={setDate} />
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
