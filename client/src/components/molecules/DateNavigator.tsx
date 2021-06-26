import React from "react";
import styled from "styled-components";
import { ArrowLeft, ArrowRight } from "styled-icons/evaicons-solid";
import { moveDay } from "../../utils/date";
import { AppContext } from "../../App";
import { AppDate } from "../atoms/AppDate";

export const DateNavigator = () => {
  const { time, setTime } = React.useContext(AppContext);

  return (
    <>
      <StyledIcon>
        <ArrowLeft size="26" onClick={() => setTime(moveDay(time, -1))} />
      </StyledIcon>
      <StyledIcon>
        <ArrowRight size="26" onClick={() => setTime(moveDay(time, 1))} />
      </StyledIcon>
      <AppDate />
    </>
  );
};

const StyledIcon = styled.div`
  display: inline-block;
  cursor: pointer;
`;
