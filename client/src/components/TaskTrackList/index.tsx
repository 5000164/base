import React, { useEffect, useState } from "react";
import DefaultClient, { gql } from "apollo-boost";
import styled from "styled-components";
import { Mutation, Query } from "../../generated/graphql";
import { TaskTrack } from "../../App";
import { TaskTrackListItem } from "../TaskTrackListItem";

export const TaskTrackList = ({ client }: { client: DefaultClient<any> }) => {
  const [taskTracks, setTaskTracks] = useState([] as TaskTrack[]);
  const [error, setError] = useState(false);

  const fetchTaskTracks = () => {
    setError(false);
    client
      .query<Query>({
        fetchPolicy: "network-only",
        query: gql`
          {
            task_tracks {
              task_tracks {
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
      })
      .then((result) =>
        setTaskTracks(result.data?.task_tracks?.task_tracks ?? [])
      )
      .catch(() => setError(true));
  };
  useEffect(fetchTaskTracks, [client]);

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
      .then(({ data }) => {
        if (data) {
          setTaskTracks(
            taskTracks.map((t) =>
              t.task_track_id === task_track_id
                ? {
                    task_track_id:
                      data.task_tracks.stop_task_track.task_track_id,
                    task: {
                      id: data.task_tracks.stop_task_track.task.id,
                      name: data.task_tracks.stop_task_track.task.name,
                    },
                    start_at: data.task_tracks?.stop_task_track.start_at,
                    stop_at: data.task_tracks?.stop_task_track.stop_at,
                  }
                : t
            )
          );
        } else {
          setError(true);
        }
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
        <>
          <StyledTaskTrackList>
            {taskTracks.map((taskTrack, index) => (
              <TaskTrackListItem
                key={index}
                taskTrack={taskTrack}
                stopTaskTrack={stopTaskTrack}
              />
            ))}
          </StyledTaskTrackList>
        </>
      )}
    </>
  );
};

const StyledTaskTrackList = styled.ul`
  width: min(1024px, 100%);
  margin: 80px auto 4px;
  padding: 0;
`;
