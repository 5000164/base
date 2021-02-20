import DefaultClient, { gql } from "apollo-boost";
import { Mutation, Query } from "schema/src/generated/client/graphql";
import { PlanTask } from "../types/planTask";

export const fetchPlanTasks = (
  client: DefaultClient<any>
): Promise<PlanTask[]> =>
  client
    .query<Query>({
      fetchPolicy: "no-cache",
      query: gql`
        {
          plan {
            tasks {
              id
              name
              estimate
              previous_id
              next_id
            }
          }
        }
      `,
    })
    .then((result) => result.data.plan.tasks);

export const addPlanTask = (client: DefaultClient<any>): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation {
          plan {
            addTask
          }
        }
      `,
    })
    .then(() => true);

export const updatePlanTask = (
  client: DefaultClient<any>,
  task: PlanTask
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation($id: Int!, $name: String, $estimate: Int) {
          plan {
            updateTask(id: $id, name: $name, estimate: $estimate)
          }
        }
      `,
      variables: task,
    })
    .then(() => true);

export const completePlanTask = (
  client: DefaultClient<any>,
  id: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation($id: Int!) {
          plan {
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

export const archivePlanTask = (
  client: DefaultClient<any>,
  id: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation($id: Int!) {
          plan {
            archiveTask(id: $id)
          }
        }
      `,
      variables: { id },
    })
    .then(() => true);

export const deletePlanTask = (
  client: DefaultClient<any>,
  id: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation($id: Int!) {
          plan {
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

export const updatePlanTasksOrder = (
  client: DefaultClient<any>,
  updatedPlanTasks: {
    id: number;
    previous_id?: number | null;
    next_id?: number | null;
  }[]
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation($updatedPlanTasks: [Plan_Updated_Plan_Task!]!) {
          plan {
            updatePlanTasksOrder(updatedPlanTasks: $updatedPlanTasks)
          }
        }
      `,
      variables: {
        updatedPlanTasks,
      },
    })
    .then(() => true);

export const fetchRecordedTasks = (
  client: DefaultClient<any>,
  date: string
): Promise<PlanTask[]> =>
  client
    .query<Query>({
      fetchPolicy: "no-cache",
      query: gql`
        query($date: String!) {
          plan {
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
    .then((result) => result.data.plan.recordedTasks);
