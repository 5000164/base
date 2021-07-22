import { ApolloClient, gql } from "@apollo/client";
import {
  Mutation,
  Query,
  TasksUpdatedTask,
} from "schema/src/generated/client/graphql";
import { Task } from "../types/task";

export const fetchTasks = (client: ApolloClient<any>): Promise<Task[]> =>
  client
    .query<Query>({
      query: gql`
        {
          tasks {
            all {
              taskId
              name
              status
              estimate
              scheduledDate
              statusChangedAt
              previousId
              nextId
            }
          }
        }
      `,
    })
    .then((result) => result.data.tasks.all as Task[]);

export const fetchScheduledTasks = (
  client: ApolloClient<any>,
  scheduledDate: number
): Promise<Task[]> =>
  client
    .query<Query>({
      query: gql`
        query ($scheduledDate: Float!) {
          tasks {
            scheduled(scheduledDate: $scheduledDate) {
              taskId
              name
              status
              estimate
              scheduledDate
              statusChangedAt
              previousId
              nextId
            }
          }
        }
      `,
      variables: {
        scheduledDate,
      },
    })
    .then((result) => result.data.tasks.scheduled as Task[]);

export const fetchRecordedTasks = (
  client: ApolloClient<any>,
  recordedDate: number
): Promise<Task[]> =>
  client
    .query<Query>({
      query: gql`
        query ($recordedDate: Float!) {
          tasks {
            recorded(recordedDate: $recordedDate) {
              taskId
              name
              status
              estimate
              scheduledDate
              statusChangedAt
              previousId
              nextId
            }
          }
        }
      `,
      variables: {
        recordedDate,
      },
    })
    .then((result) => result.data.tasks.recorded as Task[]);

export const addTask = (client: ApolloClient<any>): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation {
          tasks {
            add
          }
        }
      `,
    })
    .then(() => true);

export const addTaskWithScheduledDate = (
  client: ApolloClient<any>,
  scheduledDate: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation ($scheduledDate: Float!) {
          tasks {
            addWithScheduledDate(scheduledDate: $scheduledDate)
          }
        }
      `,
      variables: {
        scheduledDate,
      },
    })
    .then(() => true);

export const updateTask = (
  client: ApolloClient<any>,
  task: Task
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation ($taskId: Int!, $name: String, $estimate: Int) {
          tasks {
            update(taskId: $taskId, name: $name, estimate: $estimate)
          }
        }
      `,
      variables: task,
    })
    .then(() => true);

export const changeScheduledDate = (
  client: ApolloClient<any>,
  task: Task
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation ($taskId: Int!, $scheduledDate: Float) {
          tasks {
            changeScheduledDate(taskId: $taskId, scheduledDate: $scheduledDate)
          }
        }
      `,
      variables: task,
    })
    .then(() => true);

export const completeTask = (
  client: ApolloClient<any>,
  taskId: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation ($taskId: Int!) {
          tasks {
            complete(taskId: $taskId)
          }
        }
      `,
      variables: { taskId },
    })
    .then(() =>
      client
        .mutate<Mutation>({
          mutation: gql`
            mutation ($taskId: Int!) {
              taskTracks {
                stopByTaskId(taskId: $taskId)
              }
            }
          `,
          variables: { taskId },
        })
        .then(() => true)
    );

export const archiveTask = (
  client: ApolloClient<any>,
  taskId: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation ($taskId: Int!) {
          tasks {
            archive(taskId: $taskId)
          }
        }
      `,
      variables: { taskId },
    })
    .then(() => true);

export const deleteTask = (
  client: ApolloClient<any>,
  taskId: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation ($taskId: Int!) {
          tasks {
            delete(taskId: $taskId)
          }
        }
      `,
      variables: { taskId },
    })
    .then(() => true);

export const importTemplate = (
  client: ApolloClient<any>,
  templateId: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation ($templateId: Int!) {
          tasks {
            import(templateId: $templateId)
          }
        }
      `,
      variables: { templateId },
    })
    .then(() => true);

export const importTemplateWithScheduledDate = (
  client: ApolloClient<any>,
  templateId: number,
  scheduledDate: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation ($templateId: Int!, $scheduledDate: Float!) {
          tasks {
            importWithScheduledDate(
              templateId: $templateId
              scheduledDate: $scheduledDate
            )
          }
        }
      `,
      variables: { templateId, scheduledDate },
    })
    .then(() => true);

export const updateTasksOrder = (
  client: ApolloClient<any>,
  updatedTasks: TasksUpdatedTask[]
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation ($updatedTasks: [TasksUpdatedTask!]!) {
          tasks {
            updateTasksOrder(updatedTasks: $updatedTasks)
          }
        }
      `,
      variables: {
        updatedTasks,
      },
    })
    .then(() => true);
