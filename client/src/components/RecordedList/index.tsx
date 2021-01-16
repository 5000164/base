import React from "react";
import styled from "styled-components";
import { Task } from "../../App";
import { RecordedListItem } from "../RecordedListItem";
import { RecordedDate } from "../RecordedDate";
import { CalculatedTimes } from "../CalculatedTimes";

export const RecordedList = ({
  recordedTasks,
  recordedError,
  date,
  setDate,
  fetchRecordedTasks,
}: {
  recordedTasks: Task[];
  recordedError: boolean;
  date: string;
  setDate: Function;
  fetchRecordedTasks: Function;
}) => {
  return (
    <>
      {recordedError ? (
        <>
          <div>Error</div>
          <button onClick={() => fetchRecordedTasks}>Retry</button>
        </>
      ) : (
        <>
          <RecordedDate date={date} setDate={setDate} />
          <StyledRecordedList>
            {recordedTasks.map((task, index) => (
              <RecordedListItem key={index} task={task} />
            ))}
          </StyledRecordedList>
          <CalculatedTimes tasks={recordedTasks} />
        </>
      )}
    </>
  );
};

const StyledRecordedList = styled.ul`
  width: min(1024px, 100%);
  margin: 4px auto;
  padding: 0;
`;
