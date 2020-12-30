import React, { useEffect, useState } from "react";
import DefaultClient, { gql } from "apollo-boost";
import styled from "styled-components";
import { PlanListItem } from "../PlanListItem";
import { Mutation, Query } from "../../generated/graphql";
import { Task } from "../../App";
import { CalculatedTimes } from "../CalculatedTimes";
import { TemplateListLayer } from "../TemplateListLayer";

export const PlanList = ({
  client,
  countUpReload,
}: {
  client: DefaultClient<any>;
  countUpReload: Function;
}) => {
  const [tasks, setTasks] = useState([] as Task[]);
  const [tasksReload, setTasksReload] = useState(0);
  const reloadTasks = () => setTasksReload((tasksReload) => tasksReload + 1);
  const [error, setError] = useState(false);
  const [show, setShow] = React.useState(false);

  const fetchTasks = () => {
    setError(false);
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
      .then((result) => setTasks(result.data?.plan?.tasks ?? []))
      .catch(() => setError(true));
  };
  useEffect(fetchTasks, [client, tasksReload]);

  const setName = (index: number, name: string) => {
    const newTasks = [...tasks];
    newTasks[index].name = name;
    setTasks(newTasks);
  };

  const setEstimate = (index: number, estimate: number) => {
    const newTasks = [...tasks];
    newTasks[index].estimate = estimate;
    setTasks(newTasks);
  };

  const setActual = (index: number, actual: number) => {
    const newTasks = [...tasks];
    newTasks[index].actual = actual;
    setTasks(newTasks);
  };

  const addTask = () => {
    setError(false);
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
      .then((result) => {
        if (result.data) {
          setTasks([
            ...tasks,
            {
              id: result.data.plan.addTask.id,
              name: result.data.plan.addTask.name,
              estimate: result.data?.plan?.addTask.estimate,
              actual: result.data?.plan?.addTask.actual,
            },
          ]);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  };

  const updateTask = (task: Task) => {
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

  const completeTask = (id: number) => {
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
      .then(() => {
        setTasks(tasks.filter((t) => t.id !== id));
        countUpReload();
      })
      .catch(() => setError(true));
  };

  const archiveTask = (id: number) => {
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
      .then(() => {
        setTasks(tasks.filter((t) => t.id !== id));
        countUpReload();
      })
      .catch(() => setError(true));
  };

  const deleteTask = (id: number) => {
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
      .then(() => setTasks(tasks.filter((t) => t.id !== id)))
      .catch(() => setError(true));
  };

  return (
    <>
      {error ? (
        <>
          <div>Error</div>
          <button onClick={fetchTasks}>Retry</button>
        </>
      ) : (
        <>
          <StyledPlanList>
            {tasks.map((task, index) => (
              <PlanListItem
                key={index}
                task={task}
                setName={(v: string) => setName(index, v)}
                setEstimate={(v: number) => setEstimate(index, v)}
                setActual={(v: number) => setActual(index, v)}
                updateTask={updateTask}
                completeTask={completeTask}
                archiveTask={archiveTask}
                deleteTask={deleteTask}
              />
            ))}
          </StyledPlanList>
          <ButtonWrapper>
            <button onClick={addTask}>Add</button>
            <button onClick={() => setShow(true)}>Import</button>
          </ButtonWrapper>
          <CalculatedTimes tasks={tasks} />
          {show && (
            <TemplateListLayer
              client={client}
              reloadTasks={reloadTasks}
              setShow={setShow}
            />
          )}
        </>
      )}
    </>
  );
};

const StyledPlanList = styled.ul`
  width: 1024px;
  margin: 80px auto 4px;
  padding: 0;
`;

const ButtonWrapper = styled.div`
  width: 1024px;
  margin: 4px auto;
`;
