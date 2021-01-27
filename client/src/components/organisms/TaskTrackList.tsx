import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { setStartAt, setStopAt, TaskTrack } from "../../types/taskTrack";
import { fetchTaskTracks } from "../../repositories/taskTracks";
import { AppContext } from "../../App";
import { TaskTrackListItem } from "../molecules/TaskTrackListItem";

export const TaskTrackList = () => {
  const { client } = React.useContext(AppContext);

  const [taskTracks, setTaskTracks] = useState([] as TaskTrack[]);
  useEffect(() => {
    fetchTaskTracks(client).then((taskTracks) => setTaskTracks(taskTracks));
  }, [client]);

  return (
    <>
      {(() => {
        let taskTracksDate: string | undefined = undefined;
        return (
          <StyledTaskTrackList>
            {taskTracks.map((taskTrack, index) => (
              <React.Fragment key={index}>
                {(() => {
                  const currentTaskTrackDate = taskTrack.start_at
                    ? format(taskTrack.start_at)
                    : undefined;
                  if (
                    !taskTracksDate ||
                    currentTaskTrackDate !== taskTracksDate
                  ) {
                    taskTracksDate = currentTaskTrackDate;
                    return <div>{taskTracksDate}</div>;
                  } else {
                    return <></>;
                  }
                })()}
                <TaskTrackListItem
                  taskTrack={taskTrack}
                  setStartAt={(v: string) =>
                    setStartAt(taskTracks, setTaskTracks, index, v)
                  }
                  setStopAt={(v: string) =>
                    setStopAt(taskTracks, setTaskTracks, index, v)
                  }
                />
              </React.Fragment>
            ))}
          </StyledTaskTrackList>
        );
      })()}
    </>
  );
};

const format = (time?: number) => {
  if (time) {
    const date = new Date(time * 1000);
    return [
      date.getFullYear().toString(),
      "/",
      (date.getMonth() + 1).toString(),
      "/",
      date.getDate().toString(),
    ].join("");
  } else {
    return undefined;
  }
};

const StyledTaskTrackList = styled.ul`
  width: min(1024px, 100%);
  margin: 80px auto 4px;
  padding: 0;
`;
