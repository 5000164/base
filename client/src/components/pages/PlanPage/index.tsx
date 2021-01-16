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
              }
            }
          }
        `,
      })
      .then((result) => setPlanTasks(result.data?.plan?.tasks ?? []))
      .catch(() => setPlanError(true));
  };
  useEffect(fetchPlanTasks, [client, reloadCount]);

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
              addTask(name: "") {
                id
                name
                estimate
                actual
              }
            }
          }
        `,
      })
      .then(({ data }) => {
        if (data) {
          setPlanTasks([
            ...planTasks,
            {
              id: data.plan.addTask.id,
              name: data.plan.addTask.name,
              estimate: data?.plan?.addTask.estimate,
              actual: data?.plan?.addTask.actual,
            },
          ]);
        } else {
          setPlanError(true);
        }
      })
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
              ) {
                id
              }
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
              completeTask(id: $id) {
                id
              }
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
              archiveTask(id: $id) {
                id
              }
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
              deleteTask(id: $id) {
                id
              }
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
      recordedError={recordedError}
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
    />
  );
};
