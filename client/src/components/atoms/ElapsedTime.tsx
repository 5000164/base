import React from "react";
import styled from "styled-components";

export const ElapsedTime = ({
  startAt,
  stopAt,
}: {
  startAt: number;
  stopAt?: number;
}) => {
  const elapsedTime = stopAt
    ? Math.floor((stopAt - startAt) / 60).toString()
    : "";

  return (
    <>
      <StyledElapsedTime>{elapsedTime} min</StyledElapsedTime>
    </>
  );
};

const StyledElapsedTime = styled.div`
  text-align: right;
`;
