import DefaultClient, { gql } from "apollo-boost";
import { Mutation, Query } from "schema/src/generated/client/graphql";
import { TaskTrack } from "../types/taskTrack";

export const fetchTaskTracks = (
  client: DefaultClient<any>,
  recordedDate: number
): Promise<TaskTrack[]> =>
  client
    .query<Query>({
      fetchPolicy: "no-cache",
      query: gql`
        query ($recordedDate: Float!) {
          taskTracks {
            recorded(recordedDate: $recordedDate) {
              taskTrackId
              task {
                taskId
                name
              }
              startAt
              stopAt
            }
          }
        }
      `,
      variables: {
        recordedDate,
      },
    })
    .then((result) => result.data.taskTracks.recorded);

export const fetchWorkingTaskTracks = (
  client: DefaultClient<any>
): Promise<TaskTrack[]> =>
  client
    .query<Query>({
      fetchPolicy: "no-cache",
      query: gql`
        {
          taskTracks {
            working {
              taskTrackId
              task {
                taskId
                name
              }
              startAt
              stopAt
            }
          }
        }
      `,
    })
    .then((result) => result.data.taskTracks.working);

export const startTaskTrack = (
  client: DefaultClient<any>,
  taskId: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation ($taskId: Int!) {
          taskTracks {
            start(taskId: $taskId)
          }
        }
      `,
      variables: { taskId },
    })
    .then(() => true);

export const stopTaskTrack = (
  client: DefaultClient<any>,
  taskTrackId: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation ($taskTrackId: Int!) {
          taskTracks {
            stop(taskTrackId: $taskTrackId)
          }
        }
      `,
      variables: { taskTrackId },
    })
    .then(() => true);

export const updateTaskTrack = (
  client: DefaultClient<any>,
  taskTrack: TaskTrack
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation ($taskTrackId: Int!, $startAt: Float, $stopAt: Float) {
          taskTracks {
            update(
              taskTrackId: $taskTrackId
              startAt: $startAt
              stopAt: $stopAt
            )
          }
        }
      `,
      variables: taskTrack,
    })
    .then(() => true);

export const deleteTaskTrack = (
  client: DefaultClient<any>,
  taskTrackId: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation ($taskTrackId: Int!) {
          taskTracks {
            delete(taskTrackId: $taskTrackId)
          }
        }
      `,
      variables: { taskTrackId },
    })
    .then(() => true);
