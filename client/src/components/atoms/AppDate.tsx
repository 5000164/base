import React from "react";
import styled from "styled-components";
import { TextInput } from "grommet";
import {
  dateStringToLocalMidnightTime,
  timeToDateString,
} from "../../utils/date";
import { AppContext } from "../../App";

export const AppDate = () => {
  const { time, setTime } = React.useContext(AppContext);

  return (
    <StyledDate>
      <StyledTextInput
        type="date"
        value={timeToDateString(time)}
        onChange={(e) => setTime(dateStringToLocalMidnightTime(e.target.value))}
      />
    </StyledDate>
  );
};

const StyledDate = styled.div`
  display: inline-block;
`;

const StyledTextInput = styled(TextInput)`
  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
`;
