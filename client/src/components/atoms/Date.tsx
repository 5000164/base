import React from "react";
import styled from "styled-components";
import { TextInput } from "grommet";
import { AppContext } from "../../App";

export const Date = () => {
  const { date, setDate } = React.useContext(AppContext);

  return (
    <StyledDate>
      <StyledTextInput
        type="date"
        value={date ?? ""}
        onChange={(e) => setDate(e.target.value)}
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
