import React from "react";
import styled from "styled-components";

export const RecordedDate = ({
  date,
  setDate,
}: {
  date: string;
  setDate: Function;
}) => (
  <StyledRecordedDate>
    <span>Recorded Tasks at</span>
    <Date
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

const Date = styled.input`
  margin-left: 4px;
  font-size: 1.5rem;
`;
