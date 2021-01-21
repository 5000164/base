import React from "react";
import styled from "styled-components";
import { Button } from "grommet";
import { Task } from "../../App";
import { RecordedListItem } from "../RecordedListItem";
import { RecordedDate } from "../RecordedDate";
import { CalculatedRecordedTimes } from "../CalculatedRecordedTimes";

export const RecordedList = ({
  recordedTasks,
  setRecordedTasks,
  recordedError,
  setRecordedError,
  date,
  setDate,
  fetchRecordedTasks,
  setName,
  setEstimate,
  setActual,
  updateTask,
  completeTask,
  archiveTask,
  deleteTask,
}: {
  recordedTasks: Task[];
  setRecordedTasks: Function;
  recordedError: boolean;
  setRecordedError: Function;
  date: string;
  setDate: Function;
  fetchRecordedTasks: Function;
  setName: Function;
  setEstimate: Function;
  setActual: Function;
  updateTask: Function;
  completeTask: Function;
  archiveTask: Function;
  deleteTask: Function;
}) => {
  return (
    <>
      {recordedError ? (
        <>
          <div>Error</div>
          <Button label="Retry" onClick={() => fetchRecordedTasks} />
        </>
      ) : (
        <>
          <RecordedDate date={date} setDate={setDate} />
          <StyledRecordedList>
            {recordedTasks.map((task, index) => (
              <RecordedListItem
                key={index}
                task={task}
                setName={(v: string) =>
                  setName(recordedTasks, setRecordedTasks, index, v)
                }
                setEstimate={(v: number) =>
                  setEstimate(recordedTasks, setRecordedTasks, index, v)
                }
                setActual={(v: number) =>
                  setActual(recordedTasks, setRecordedTasks, index, v)
                }
                updateTask={(t: Task) => updateTask(t, setRecordedError)}
                completeTask={(id: number) =>
                  completeTask(id, setRecordedError)
                }
                archiveTask={(id: number) => archiveTask(id, setRecordedError)}
                deleteTask={(id: number) => deleteTask(id, setRecordedError)}
              />
            ))}
          </StyledRecordedList>
          <CalculatedRecordedTimes tasks={recordedTasks} />
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
