import React, { useEffect, useState } from "react";
import ApolloClient, { gql } from "apollo-boost";
import { PlanListItem } from "../plan-list-item";
import { Query } from "../../generated/graphql";

const client = new ApolloClient({
  uri: "http://localhost:4000",
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

  const addTask = () => {
    setTasks([...tasks, {}]);
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
              />
            ))}
          </ul>
          <button onClick={addTask}>Add</button>
        </>
      )}
    </div>
  );
};
