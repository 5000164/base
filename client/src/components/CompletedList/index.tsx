import React, { useEffect, useState } from "react";
import DefaultClient, { gql } from "apollo-boost";
import styled from "styled-components";
import { Query } from "../../generated/graphql";
import { Task } from "../../App";
import { CompletedListItem } from "../CompletedListItem";

export const CompletedList = ({
  client,
  reload,
}: {
  client: DefaultClient<any>;
  reload: number;
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
            completedTasks {
              id
              name
              estimate
            }
          }
        `,
      })
      .then((result) => setTasks(result.data.completedTasks))
      .catch(() => setError(true));
  };
  useEffect(fetchTasks, [reload]);

  return (
    <>
      {error ? (
        <>
          <div>Error</div>
          <button onClick={fetchTasks}>Retry</button>
        </>
      ) : (
        <>
          <StyledCompletedList>
            {tasks.map((task, index) => (
              <CompletedListItem key={index} task={task} />
            ))}
          </StyledCompletedList>
        </>
      )}
    </>
  );
};

const StyledCompletedList = styled.ul`
  width: 1024px;
  margin: 20px auto;
  padding: 0;
`;
