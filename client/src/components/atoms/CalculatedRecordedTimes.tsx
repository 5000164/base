import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PlanTask } from "../../types/planTask";
import { Status } from "../../types/status";

export const CalculatedRecordedTimes = ({ tasks }: { tasks: PlanTask[] }) => {
  const [totalCompletedEstimateTime, setTotalCompletedEstimateTime] = useState(
    0
  );
  const [totalArchivedEstimateTime, setTotalArchivedEstimateTime] = useState(0);
  const [totalActualTime, setTotalActualTime] = useState(0);

  const calculateTimes = () => {
    const {
      totalCompletedEstimateTime,
      totalArchivedEstimateTime,
      totalActualTime,
    } = tasks.reduce(
      (
        {
          totalCompletedEstimateTime,
          totalArchivedEstimateTime,
          totalActualTime,
        },
        task
      ) => ({
        totalCompletedEstimateTime:
          task.status === Status.Completed
            ? totalCompletedEstimateTime + (task?.estimate ?? 0)
            : totalCompletedEstimateTime,
        totalArchivedEstimateTime:
          task.status === Status.Archived
            ? totalArchivedEstimateTime + (task?.estimate ?? 0)
            : totalArchivedEstimateTime,
        totalActualTime: totalActualTime + (task?.actual ?? 0),
      }),
      {
        totalCompletedEstimateTime: 0,
        totalArchivedEstimateTime: 0,
        totalActualTime: 0,
      }
    );
    setTotalCompletedEstimateTime(totalCompletedEstimateTime);
    setTotalArchivedEstimateTime(totalArchivedEstimateTime);
    setTotalActualTime(totalActualTime);
  };
  useEffect(calculateTimes, [tasks]);

  return (
    <>
      <Time>
        Total Completed Estimate Time: {totalCompletedEstimateTime} min
      </Time>
      <Time>Total Archived Estimate Time: {totalArchivedEstimateTime} min</Time>
      <Time>Total Actual Time: {totalActualTime} min</Time>
    </>
  );
};

const Time = styled.div`
  width: min(1024px, 100%);
  margin: 4px auto;
  text-align: right;
`;
