import React, { useEffect, useState } from "react";
import DefaultClient, { gql } from "apollo-boost";
import styled from "styled-components";
import { PlanListItem } from "../PlanListItem";
import { Mutation, Query } from "../../generated/graphql";
import { Task } from "../../App";

export const PlanList = ({
  client,
  countUpReload,
}: {
  client: DefaultClient<any>;
  countUpReload: Function;
}) => {
  const [tasks, setTasks] = useState([] as Task[]);
  const [totalEstimateTime, setTotalEstimateTime] = useState(0);
  const [error, setError] = useState(false);

  const fetchTasks = () => {
    setError(false);
    client
      .query<Query>({
        query: gql`
          {
            tasks {
              id
              name
              estimate
            }
          }
        `,
      })
      .then((result) => setTasks(result.data.tasks))
      .catch(() => setError(true));
  };
  useEffect(fetchTasks, []);

  const calculateTotalEstimateTime = () => {
    setTotalEstimateTime(
      tasks.reduce((totalTime, task) => totalTime + (task?.estimate ?? 0), 0)
    );
  };
  useEffect(calculateTotalEstimateTime, [tasks]);

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
          mutation($id: Int!, $name: String, $estimate: Int) {
            updateTask(id: $id, name: $name, estimate: $estimate) {
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
      .then(() => setTasks(tasks.filter((t) => t.id !== id)))
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
          <TotalEstimateTime>
            Total Estimate Time: {totalEstimateTime} min
          </TotalEstimateTime>
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

const TotalEstimateTime = styled.div`
  width: 1024px;
  margin: 4px auto 80px;
  text-align: right;
`;
