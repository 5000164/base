import React from "react";
import styled from "styled-components";
import { ArrowLeft, ArrowRight } from "styled-icons/evaicons-solid";
import { moveDay } from "../../utils/date";
import { AppContext } from "../../App";
import { AppDate } from "../atoms/AppDate";

export const DateNavigator = () => {
  const { time, setTime } = React.useContext(AppContext);

  return (
    <StyledDateNavigator>
      <StyledAppDate />
      <StyledIcon>
        <ArrowLeft size="26" onClick={() => setTime(moveDay(time, -1))} />
      </StyledIcon>
      <StyledIcon>
        <ArrowRight size="26" onClick={() => setTime(moveDay(time, 1))} />
      </StyledIcon>
    </StyledDateNavigator>
  );
};

const StyledDateNavigator = styled.div`
  display: grid;
  grid-template-columns: 1fr 32px 32px;
  align-items: center;
`;

const StyledAppDate = styled(AppDate)``;

const StyledIcon = styled.div`
  width: 32px;
  text-align: center;
  cursor: pointer;
`;
