import React from "react";
import styled from "styled-components";
import { TextInput } from "grommet";

export const TaskTracksDate = ({
  date,
  setDate,
}: {
  date: string;
  setDate: (date: string) => void;
}) => (
  <StyledRecordedDate>
    <span>Task Tracks at</span>
    <TextInput
      type="date"
      value={date ?? ""}
      onChange={(e) => setDate(e.target.value)}
    />
  </StyledRecordedDate>
);

const StyledRecordedDate = styled.div`
  width: min(1024px, 100%);
  margin: 80px auto 4px;
`;
