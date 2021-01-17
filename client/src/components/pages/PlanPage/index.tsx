import React, { useEffect, useState } from "react";
import DefaultClient, { gql } from "apollo-boost";
import { Mutation, Query } from "../../../generated/graphql";
import { Task } from "../../../App";
import { PlanTemplate } from "../../templates/PlanTemplate";

export const PlanPage = ({ client }: { client: DefaultClient<any> }) => {
  const [planTasks, setPlanTasks] = useState([] as Task[]);
  const [planError, setPlanError] = useState(false);

  const [recordedTasks, setRecordedTasks] = useState([] as Task[]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [reloadCount, setReloadCount] = useState(0);
  const reload = () => setReloadCount((reloadCount) => reloadCount + 1);
  const [recordedError, setRecordedError] = useState(false);

  const [show, setShow] = React.useState(false);

  const sort = (tasks: Task[]): Task[] => {
    const [firstTask] = tasks.splice(
      tasks.findIndex((t) => !t.previous_id),
      1
    );

    if (firstTask) {
      const sortedTasks = [];
      sortedTasks.push(firstTask);

      const sort = (
        nextId: number,
        remainTasks: Task[],
        sortedTasks: Task[]
      ): Task[] => {
        if (remainTasks.length === 0) {
          return sortedTasks;
        }

        const [nextTask] = remainTasks.splice(
          remainTasks.findIndex((t) => t.id === nextId),
          1
        );
        sortedTasks.push(nextTask);

        if (nextTask.next_id) {
          return sort(nextTask.next_id, remainTasks, sortedTasks);
        } else {
          return [...sortedTasks, ...remainTasks];
        }
      };

      if (firstTask.next_id) {
        return sort(firstTask.next_id, tasks, sortedTasks);
      } else {
        return [...sortedTasks, ...tasks];
      }
    } else {
      return tasks;
    }
  };

  const fetchPlanTasks = () => {
    setPlanError(false);
    client
      .query<Query>({
        fetchPolicy: "network-only",
        query: gql`
          {
            plan {
              tasks {
                id
                name
                estimate
                actual
                previous_id
                next_id
              }
            }
          }
        `,
      })
      .then((result) => setPlanTasks(sort(result.data?.plan?.tasks ?? [])))
      .catch(() => setPlanError(true));
  };
  useEffect(fetchPlanTasks, [client, reloadCount]);

  const updatePlanTasksOrder = (
    updatedPlanTasks: {
      id: number;
      previous_id?: number | null;
      next_id?: number | null;
    }[]
  ) => {
    setPlanError(false);
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
      .catch(() => setPlanError(true));
  };

  const fetchRecordedTasks = () => {
    setRecordedError(false);
    client
      .query<Query>({
        fetchPolicy: "network-only",
        query: gql`
          query($date: String!) {
            plan {
              recordedTasks(date: $date) {
                id
                name
                status
                estimate
                actual
              }
            }
          }
        `,
        variables: {
          date,
        },
      })
      .then((result) => setRecordedTasks(result.data.plan.recordedTasks ?? []))
      .catch(() => setRecordedError(true));
  };
  useEffect(fetchRecordedTasks, [client, reloadCount, date]);

  const setName = (
    tasks: Task[],
    setTasks: Function,
    index: number,
    name: string
  ) => {
    const newTasks = [...tasks];
    newTasks[index].name = name;
    setTasks(newTasks);
  };

  const setEstimate = (
    tasks: Task[],
    setTasks: Function,
    index: number,
    estimate: number
  ) => {
    const newTasks = [...tasks];
    newTasks[index].estimate = estimate;
    setTasks(newTasks);
  };

  const setActual = (
    tasks: Task[],
    setTasks: Function,
    index: number,
    actual: number
  ) => {
    const newTasks = [...tasks];
    newTasks[index].actual = actual;
    setTasks(newTasks);
  };

  const addTask = () => {
    setPlanError(false);
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
      .then(() => reload())
      .catch(() => setPlanError(true));
  };

  const updateTask = (task: Task, setError: Function) => {
    setError(false);
    client
      .mutate<Mutation>({
        mutation: gql`
          mutation($id: Int!, $name: String, $estimate: Int, $actual: Int) {
            plan {
              updateTask(
                id: $id
                name: $name
                estimate: $estimate
                actual: $actual
              )
            }
          }
        `,
        variables: task,
      })
      .catch(() => setError(true));
  };

  const completeTask = (id: number, setError: Function) => {
    setError(false);
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
      .then(() => reload())
      .catch(() => setError(true));
  };

  const archiveTask = (id: number, setError: Function) => {
    setError(false);
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
      .then(() => reload())
      .catch(() => setError(true));
  };

  const deleteTask = (id: number, setError: Function) => {
    setError(false);
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
      .then(() => reload())
      .catch(() => setError(true));
  };

  return (
    <PlanTemplate
      client={client}
      planTasks={planTasks}
      setPlanTasks={setPlanTasks}
      planError={planError}
      setPlanError={setPlanError}
      recordedTasks={recordedTasks}
      setRecordedTasks={setRecordedTasks}
      recordedError={recordedError}
      setRecordedError={setRecordedError}
      date={date}
      setDate={setDate}
      reload={reload}
      show={show}
      setShow={setShow}
      fetchPlanTasks={fetchPlanTasks}
      fetchRecordedTasks={fetchRecordedTasks}
      setName={setName}
      setEstimate={setEstimate}
      setActual={setActual}
      addTask={addTask}
      updateTask={updateTask}
      completeTask={completeTask}
      archiveTask={archiveTask}
      deleteTask={deleteTask}
      updatePlanTasksOrder={updatePlanTasksOrder}
    />
  );
};
