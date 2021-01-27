import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PlanTask } from "../../types/planTask";

export const CalculatedTimes = ({ tasks }: { tasks: PlanTask[] }) => {
  const [totalEstimateTime, setTotalEstimateTime] = useState(0);

  const calculateTimes = () => {
    const { totalEstimateTime } = tasks.reduce(
      ({ totalEstimateTime }, task) => ({
        totalEstimateTime: totalEstimateTime + (task?.estimate ?? 0),
      }),
      { totalEstimateTime: 0 }
    );
    setTotalEstimateTime(totalEstimateTime);
  };
  useEffect(calculateTimes, [tasks]);

  return (
    <>
      <TotalEstimateTime>
        Total Estimate Time: {totalEstimateTime} min
      </TotalEstimateTime>
    </>
  );
};

const TotalEstimateTime = styled.div`
  width: min(1024px, 100%);
  margin: 4px auto;
  text-align: right;
`;
