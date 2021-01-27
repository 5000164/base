import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  PlanTask,
  setActual,
  setEstimate,
  setName,
} from "../../types/planTask";
import { fetchRecordedTasks } from "../../repositories/planTasks";
import { AppContext } from "../../App";
import { PlanPageContext } from "../pages/PlanPage";
import { RecordedListItem } from "../molecules/RecordedListItem";
import { RecordedDate } from "../atoms/RecordedDate";
import { CalculatedRecordedTimes } from "../atoms/CalculatedRecordedTimes";

export const RecordedList = () => {
  const { client } = React.useContext(AppContext);
  const { reloadCount } = React.useContext(PlanPageContext);

  const [recordedTasks, setRecordedTasks] = useState([] as PlanTask[]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  useEffect(() => {
    fetchRecordedTasks(client, date).then((recordedTasks) =>
      setRecordedTasks(recordedTasks)
    );
  }, [client, reloadCount, date]);

  return (
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
          />
        ))}
      </StyledRecordedList>
      <CalculatedRecordedTimes tasks={recordedTasks} />
    </>
  );
};

const StyledRecordedList = styled.ul`
  width: min(1024px, 100%);
  margin: 4px auto;
  padding: 0;
`;
