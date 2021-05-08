import DefaultClient, { gql } from "apollo-boost";
import { Mutation, Query } from "schema/src/generated/client/graphql";
import { Task } from "../types/task";

export const fetchTasks = (client: DefaultClient<any>): Promise<Task[]> =>
  client
    .query<Query>({
      fetchPolicy: "no-cache",
      query: gql`
        {
          tasks {
            all {
              id
              name
              estimate
              scheduled_date
              previous_id
              next_id
            }
          }
        }
      `,
    })
    .then((result) => result.data.tasks.all);

export const fetchScheduledTasks = (
  client: DefaultClient<any>,
  date: string
): Promise<Task[]> =>
  client
    .query<Query>({
      fetchPolicy: "no-cache",
      query: gql`
        query($date: String!) {
          tasks {
            scheduled(date: $date) {
              id
              name
              estimate
              scheduled_date
              previous_id
              next_id
            }
          }
        }
      `,
      variables: {
        date,
      },
    })
    .then((result) => result.data.tasks.scheduled);

export const addTask = (client: DefaultClient<any>): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation {
          tasks {
            addTask
          }
        }
      `,
    })
    .then(() => true);

export const addTaskWithScheduledDate = (
  client: DefaultClient<any>,
  scheduledDate: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation($scheduledDate: Int!) {
          tasks {
            add_task_with_scheduled_date(scheduled_date: $scheduledDate)
          }
        }
      `,
      variables: {
        scheduledDate,
      },
    })
    .then(() => true);

export const updateTask = (
  client: DefaultClient<any>,
  task: Task
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation($id: Int!, $name: String, $estimate: Int) {
          tasks {
            updateTask(id: $id, name: $name, estimate: $estimate)
          }
        }
      `,
      variables: task,
    })
    .then(() => true);

export const changeScheduledDate = (
  client: DefaultClient<any>,
  task: Task
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation($id: Int!, $scheduled_date: Int) {
          tasks {
            change_scheduled_date(id: $id, scheduled_date: $scheduled_date)
          }
        }
      `,
      variables: task,
    })
    .then(() => true);

export const completeTask = (
  client: DefaultClient<any>,
  id: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation($id: Int!) {
          tasks {
            completeTask(id: $id)
          }
        }
      `,
      variables: { id },
    })
    .then(() =>
      client
        .mutate<Mutation>({
          mutation: gql`
            mutation($task_id: Int!) {
              task_tracks {
                stop_task_track_by_task_id(task_id: $task_id)
              }
            }
          `,
          variables: { task_id: id },
        })
        .then(() => true)
    );

export const archiveTask = (
  client: DefaultClient<any>,
  id: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation($id: Int!) {
          tasks {
            archiveTask(id: $id)
          }
        }
      `,
      variables: { id },
    })
    .then(() => true);

export const deleteTask = (
  client: DefaultClient<any>,
  id: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation($id: Int!) {
          tasks {
            deleteTask(id: $id)
          }
        }
      `,
      variables: { id },
    })
    .then(() => true);

export const startTaskTrack = (
  client: DefaultClient<any>,
  task_id: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation($task_id: Int!) {
          task_tracks {
            start_task_track(task_id: $task_id) {
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
      variables: { task_id },
    })
    .then(() => true);

export const updateTasksOrder = (
  client: DefaultClient<any>,
  updatedTasks: {
    id: number;
    previous_id?: number | null;
    next_id?: number | null;
  }[]
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation($updatedTasks: [Tasks_Updated_Task!]!) {
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

export const fetchRecordedTasks = (
  client: DefaultClient<any>,
  date: string
): Promise<Task[]> =>
  client
    .query<Query>({
      fetchPolicy: "no-cache",
      query: gql`
        query($date: String!) {
          tasks {
            recordedTasks(date: $date) {
              id
              name
              status
              estimate
            }
          }
        }
      `,
      variables: {
        date,
      },
    })
    .then((result) => result.data.tasks.recordedTasks);
