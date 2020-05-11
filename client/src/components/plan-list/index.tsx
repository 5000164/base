import React, { useEffect, useState } from "react";
import ApolloClient, { gql } from "apollo-boost";
import { PlanListItem } from "../plan-list-item";
import { Mutation, Query } from "../../generated/graphql";

const client = new ApolloClient({
  uri: "http://localhost:5164",
});

export interface Task {
  id?: number;
  name?: string;
}

export const PlanList = () => {
  const [tasks, setTasks] = useState([] as Task[]);
  const [error, setError] = useState(false);

  const setTaskName = (index: number, name: string) => {
    const newTasks = [...tasks];
    newTasks[index].name = name;
    setTasks(newTasks);
  };

  const updateTaskName = (updatedTask: Task) =>
    setTasks(tasks.map((t) => (updatedTask.id === t.id ? updatedTask : t)));

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
      .then((result) => {
        const addedTask: Task = {
          id: result.data?.addTask.id,
          name: result.data?.addTask.name,
        };
        setTasks([...tasks, addedTask]);
      })
      .catch(() => setError(true));
  };

  const updateTask = (task: Task) => {
    setError(false);
    client
      .mutate<Mutation>({
        mutation: gql`
        mutation {
          updateTask(id: ${task.id}, name: "${task.name}") {
            id
            name
          }
        }
      `,
      })
      .then((result) => {
        updateTaskName({
          id: result.data?.updateTask.id as number,
          name: result.data?.updateTask.name as string,
        } as Task);
      })
      .catch(() => setError(true));
  };

  const completeTask = (id: number) => {
    setError(false);
    client
      .mutate<Mutation>({
        mutation: gql`
        mutation {
          completeTask(id: ${id}) {
            id
          }
        }
      `,
      })
      .then(() => setTasks(tasks.filter((t) => t.id !== id)))
      .catch(() => setError(true));
  };

  const archiveTask = (id: number) => {
    setError(false);
    client
      .mutate<Mutation>({
        mutation: gql`
        mutation {
          archiveTask(id: ${id}) {
            id
          }
        }
      `,
      })
      .then(() => setTasks(tasks.filter((t) => t.id !== id)))
      .catch(() => setError(true));
  };

  const deleteTask = (id: number) => {
    setError(false);
    client
      .mutate<Mutation>({
        mutation: gql`
        mutation {
          deleteTask(id: ${id}) {
            id
            name
          }
        }
      `,
      })
      .then(() => setTasks(tasks.filter((t) => t.id !== id)))
      .catch(() => setError(true));
  };

  const fetchTasks = () => {
    setError(false);
    client
      .query<Query>({
        query: gql`
          {
            tasks {
              id
              name
            }
          }
        `,
      })
      .then((result) => setTasks(result.data.tasks))
      .catch(() => setError(true));
  };

  useEffect(fetchTasks, []);

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
                setTask={(v: string) => setTaskName(index, v)}
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
