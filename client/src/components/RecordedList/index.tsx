import React, { useEffect, useState } from "react";
import DefaultClient, { gql } from "apollo-boost";
import styled from "styled-components";
import { Query } from "../../generated/graphql";
import { Task } from "../../App";
import { RecordedListItem } from "../RecordedListItem";
import { RecordedDate } from "../RecordedDate";
import { CalculatedTimes } from "../CalculatedTimes";

export const RecordedList = ({
  client,
  reload,
}: {
  client: DefaultClient<any>;
  reload: number;
}) => {
  const [tasks, setTasks] = useState([] as Task[]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState(false);

  const fetchTasks = () => {
    setError(false);
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
      .then((result) => setTasks(result.data.plan.recordedTasks ?? []))
      .catch(() => setError(true));
  };
  useEffect(fetchTasks, [reload, date]);

  return (
    <>
      {error ? (
        <>
          <div>Error</div>
          <button onClick={fetchTasks}>Retry</button>
        </>
      ) : (
        <>
          <RecordedDate date={date} setDate={setDate} />
          <StyledRecordedList>
            {tasks.map((task, index) => (
              <RecordedListItem key={index} task={task} />
            ))}
          </StyledRecordedList>
          <CalculatedTimes tasks={tasks} />
        </>
      )}
    </>
  );
};

const StyledRecordedList = styled.ul`
  width: 1024px;
  margin: 4px auto;
  padding: 0;
`;
