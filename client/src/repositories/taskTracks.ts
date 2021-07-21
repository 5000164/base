import { ApolloClient, gql } from "@apollo/client";
import { Mutation, Query } from "schema/src/generated/client/graphql";
import { TaskTrack } from "../types/taskTrack";

export const fetchTaskTracks = (
  client: ApolloClient<any>,
  recordedDate: number
): Promise<TaskTrack[]> =>
  client
    .query<Query>({
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
  client: ApolloClient<any>
): Promise<TaskTrack[]> =>
  client
    .query<Query>({
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
  client: ApolloClient<any>,
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
  client: ApolloClient<any>,
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
  client: ApolloClient<any>,
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
  client: ApolloClient<any>,
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
