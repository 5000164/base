import React, { useEffect, useState } from "react";
import DefaultClient, { gql } from "apollo-boost";
import styled from "styled-components";
import { Query } from "../../generated/graphql";
import { Task } from "../../App";
import { RecordedListItem } from "../RecordedListItem";

export const RecordedList = ({
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
            recordedTasks {
              id
              name
              status
              estimate
              actual
            }
          }
        `,
      })
      .then((result) => setTasks(result.data.recordedTasks))
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
          <StyledRecordedList>
            {tasks.map((task, index) => (
              <RecordedListItem key={index} task={task} />
            ))}
          </StyledRecordedList>
        </>
      )}
    </>
  );
};

const StyledRecordedList = styled.ul`
  width: 1024px;
  margin: 80px auto;
  padding: 0;
`;
