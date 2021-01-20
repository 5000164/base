import React, { useEffect, useState } from "react";
import DefaultClient, { gql } from "apollo-boost";
import styled from "styled-components";
import {
  Mutation,
  Query,
  Task_Tracks_Fetch_Type,
} from "../../generated/graphql";
import { TaskTrack } from "../../App";
import { TaskTrackListItem } from "../TaskTrackListItem";

export const TaskTrackList = ({
  client,
  onlyWorking,
  reloadCount,
  reload,
}: {
  client: DefaultClient<any>;
  onlyWorking?: boolean;
  reloadCount?: number;
  reload?: Function;
}) => {
  const [taskTracks, setTaskTracks] = useState([] as TaskTrack[]);
  const [error, setError] = useState(false);

  const fetchTaskTracks = () => {
    setError(false);
    client
      .query<Query>({
        fetchPolicy: "no-cache",
        query: gql`
          query($fetch_type: Task_Tracks_Fetch_Type!) {
            task_tracks {
              task_tracks(fetch_type: $fetch_type) {
                task_track_id
                task {
                  id
                  name
                }
                start_at
                stop_at
              }
            }
          }
        `,
        variables: {
          fetch_type: onlyWorking
            ? Task_Tracks_Fetch_Type.OnlyWorking
            : Task_Tracks_Fetch_Type.All,
        },
      })
      .then((result) =>
        setTaskTracks(result.data?.task_tracks?.task_tracks ?? [])
      )
      .catch(() => setError(true));
  };
  useEffect(fetchTaskTracks, [client, onlyWorking, reloadCount]);

  const stopTaskTrack = (task_track_id: number) => {
    setError(false);
    client
      .mutate<Mutation>({
        mutation: gql`
          mutation($task_track_id: Int!) {
            task_tracks {
              stop_task_track(task_track_id: $task_track_id) {
                task_track_id
                task {
                  id
                  name
                }
                start_at
                stop_at
              }
            }
          }
        `,
        variables: { task_track_id },
      })
      .then(() => (reload ? reload() : []))
      .catch(() => setError(true));
  };

  const setStartAt = (index: number, startAt: string) => {
    const newTaskTracks = [...taskTracks];
    newTaskTracks[index].start_at = Math.floor(
      new Date(startAt).getTime() / 1000
    );
    setTaskTracks(newTaskTracks);
  };

  const setStopAt = (index: number, stopAt: string) => {
    const newTaskTracks = [...taskTracks];
    newTaskTracks[index].stop_at = Math.floor(
      new Date(stopAt).getTime() / 1000
    );
    setTaskTracks(newTaskTracks);
  };

  const updateTaskTrack = (taskTrack: TaskTrack) => {
    setError(false);
    client
      .mutate<Mutation>({
        mutation: gql`
          mutation($task_track_id: Int!, $start_at: Int, $stop_at: Int) {
            task_tracks {
              update_task_track(
                task_track_id: $task_track_id
                start_at: $start_at
                stop_at: $stop_at
              ) {
                task_track_id
                task {
                  id
                  name
                }
                start_at
                stop_at
              }
            }
          }
        `,
        variables: taskTrack,
      })
      .catch(() => setError(true));
  };

  return (
    <>
      {error ? (
        <>
          <div>Error</div>
          <button onClick={fetchTaskTracks}>Retry</button>
        </>
      ) : (
        (() => {
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
                    stopTaskTrack={stopTaskTrack}
                    setStartAt={(v: string) => setStartAt(index, v)}
                    setStopAt={(v: string) => setStopAt(index, v)}
                    updateTaskTrack={updateTaskTrack}
                  />
                </React.Fragment>
              ))}
            </StyledTaskTrackList>
          );
        })()
      )}
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
