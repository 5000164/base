import React, { useEffect, useState } from "react";
import DefaultClient, { gql } from "apollo-boost";
import styled from "styled-components";
import { PlanListItem } from "../PlanListItem";
import { Mutation, Query } from "../../generated/graphql";
import { Task } from "../../App";
import { CalculatedTimes } from "../CalculatedTimes";

export const PlanList = ({
  client,
  countUpReload,
}: {
  client: DefaultClient<any>;
  countUpReload: Function;
}) => {
  const [tasks, setTasks] = useState([] as Task[]);
  const [error, setError] = useState(false);

  const fetchTasks = () => {
    setError(false);
    client
      .query<Query>({
        fetchPolicy: "network-only",
        query: gql`
          {
            tasks {
              id
              name
              estimate
              actual
            }
          }
        `,
      })
      .then((result) => setTasks(result.data.tasks))
      .catch(() => setError(true));
  };
  useEffect(fetchTasks, []);

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
            addTask(name: "") {
              id
              name
              estimate
              actual
            }
          }
        `,
      })
      .then((result) => {
        setTasks([
          ...tasks,
          {
            id: result.data?.addTask.id,
            name: result.data?.addTask.name,
            estimate: result.data?.addTask.estimate,
            actual: result.data?.addTask.actual,
          },
        ]);
      })
      .catch(() => setError(true));
  };

  const updateTask = (task: Task) => {
    setError(false);
    client
      .mutate<Mutation>({
        mutation: gql`
          mutation($id: Int!, $name: String, $estimate: Int, $actual: Int) {
            updateTask(
              id: $id
              name: $name
              estimate: $estimate
              actual: $actual
            ) {
              id
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
            completeTask(id: $id) {
              id
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
            archiveTask(id: $id) {
              id
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
            deleteTask(id: $id) {
              id
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
          <AddButtonWrapper>
            <button onClick={addTask}>Add</button>
          </AddButtonWrapper>
          <CalculatedTimes tasks={tasks} />
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

const AddButtonWrapper = styled.div`
  width: 1024px;
  margin: 4px auto;
`;
