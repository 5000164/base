import React from "react";
import styled from "styled-components";

export const Timer = ({ startAt }: { startAt: number }) => {
  const startAtDate = new Date(startAt);
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(intervalId);
  }, [startAt, now]);
  const timer = Math.floor((now.getTime() - startAtDate.getTime()) / 60000);

  return (
    <>
      <StyledTimer>{timer.toString()} min</StyledTimer>
    </>
  );
};

const StyledTimer = styled.div`
  text-align: right;
`;
