import DefaultClient, { gql } from "apollo-boost";
import { Mutation, Query } from "schema/src/generated/client/graphql";
import { TaskTrack } from "../types/taskTrack";

export const fetchTaskTracks = (
  client: DefaultClient<any>,
  date: string
): Promise<TaskTrack[]> =>
  client
    .query<Query>({
      fetchPolicy: "no-cache",
      query: gql`
        query($date: String!) {
          task_tracks {
            taskTracks(date: $date) {
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
        date,
      },
    })
    .then((result) => result.data.task_tracks.taskTracks);

export const fetchWorkingTaskTracks = (
  client: DefaultClient<any>
): Promise<TaskTrack[]> =>
  client
    .query<Query>({
      fetchPolicy: "no-cache",
      query: gql`
        {
          task_tracks {
            workingTaskTracks {
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
    .then((result) => result.data.task_tracks.workingTaskTracks);

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
