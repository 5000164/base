import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Status } from "shared/src/types/status";
import { Task } from "../../types/task";

export const CalculatedRecordedTimes = ({ tasks }: { tasks: Task[] }) => {
  const [totalCompletedEstimateTime, setTotalCompletedEstimateTime] = useState(
    0
  );
  const [totalArchivedEstimateTime, setTotalArchivedEstimateTime] = useState(0);

  const calculateTimes = () => {
    const {
      totalCompletedEstimateTime,
      totalArchivedEstimateTime,
    } = tasks.reduce(
      ({ totalCompletedEstimateTime, totalArchivedEstimateTime }, task) => ({
        totalCompletedEstimateTime:
          task.status === Status.Completed
            ? totalCompletedEstimateTime + (task?.estimate ?? 0)
            : totalCompletedEstimateTime,
        totalArchivedEstimateTime:
          task.status === Status.Archived
            ? totalArchivedEstimateTime + (task?.estimate ?? 0)
            : totalArchivedEstimateTime,
      }),
      {
        totalCompletedEstimateTime: 0,
        totalArchivedEstimateTime: 0,
      }
    );
    setTotalCompletedEstimateTime(totalCompletedEstimateTime);
    setTotalArchivedEstimateTime(totalArchivedEstimateTime);
  };
  useEffect(calculateTimes, [tasks]);

  return (
    <>
      <Time>
        Total Completed Estimate Time: {totalCompletedEstimateTime} min
      </Time>
      <Time>Total Archived Estimate Time: {totalArchivedEstimateTime} min</Time>
    </>
  );
};

const Time = styled.div`
  width: min(1024px, 100%);
  margin: 4px auto;
  text-align: right;
`;
