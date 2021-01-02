import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Task } from "../../App";

export const CalculatedTimes = ({ tasks }: { tasks: Task[] }) => {
  const [totalEstimateTime, setTotalEstimateTime] = useState(0);
  const [totalActualTime, setTotalActualTime] = useState(0);

  const calculateTimes = () => {
    const { totalEstimateTime, totalActualTime } = tasks.reduce(
      ({ totalEstimateTime, totalActualTime }, task) => ({
        totalEstimateTime: totalEstimateTime + (task?.estimate ?? 0),
        totalActualTime: totalActualTime + (task?.actual ?? 0),
      }),
      { totalEstimateTime: 0, totalActualTime: 0 }
    );
    setTotalEstimateTime(totalEstimateTime);
    setTotalActualTime(totalActualTime);
  };
  useEffect(calculateTimes, [tasks]);

  return (
    <>
      <TotalEstimateTime>
        Total Estimate Time: {totalEstimateTime} min
      </TotalEstimateTime>
      <TotalActualTime>
        Total Actual Time: {totalActualTime} min
      </TotalActualTime>
    </>
  );
};

const TotalEstimateTime = styled.div`
  width: min(1024px, 100%);
  margin: 4px auto;
  text-align: right;
`;

const TotalActualTime = styled.div`
  width: min(1024px, 100%);
  margin: 4px auto;
  text-align: right;
`;
