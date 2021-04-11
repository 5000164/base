import React from "react";
import styled from "styled-components";

export const ElapsedTime = ({ seconds }: { seconds: number }) => {
  const elapsedTime = Math.floor(seconds / 60).toString();

  return (
    <>
      <StyledElapsedTime>{elapsedTime} min</StyledElapsedTime>
    </>
  );
};

const StyledElapsedTime = styled.div`
  text-align: right;
`;
