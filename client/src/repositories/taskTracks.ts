import DefaultClient, { gql } from "apollo-boost";
import { Mutation, Query, Task_Tracks_Fetch_Type } from "../generated/graphql";
import { TaskTrack } from "../types/taskTrack";

export const fetchTaskTracks = (
  client: DefaultClient<any>
): Promise<TaskTrack[]> =>
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
        fetch_type: Task_Tracks_Fetch_Type.All,
      },
    })
    .then((result) => result.data.task_tracks.task_tracks);

export const fetchWorkingTaskTracks = (
  client: DefaultClient<any>
): Promise<TaskTrack[]> =>
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
        fetch_type: Task_Tracks_Fetch_Type.OnlyWorking,
      },
    })
    .then((result) => result.data.task_tracks.task_tracks);

export const updateTaskTrack = (
  client: DefaultClient<any>,
  taskTrack: TaskTrack
): Promise<boolean> =>
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
    .then(() => true);

export const stopTaskTrack = (
  client: DefaultClient<any>,
  taskTrackId: number
): Promise<boolean> =>
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
      variables: { task_track_id: taskTrackId },
    })
    .then(() => true);
