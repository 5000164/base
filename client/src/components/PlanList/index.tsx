import React, { useEffect, useState } from "react";
import ApolloClient, { gql } from "apollo-boost";
import { PlanListItem } from "../PlanListItem";
import { Mutation, Query } from "../../generated/graphql";

const client = new ApolloClient({
  uri: "http://localhost:5164",
});

export interface Task {
  id?: number;
  name?: string;
  estimate?: number;
}

export const PlanList = () => {
  const [tasks, setTasks] = useState([] as Task[]);
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
            }
          }
        `,
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
      .then(() => setTasks(tasks.filter((t) => t.id !== id)))
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
    <div>
      {error ? (
        <>
          <div>Error</div>
          <button onClick={fetchTasks}>Retry</button>
        </>
      ) : (
        <>
          <ul>
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
          </ul>
          <button onClick={addTask}>Add</button>
        </>
      )}
    </div>
  );
};
