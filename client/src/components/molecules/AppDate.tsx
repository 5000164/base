import React from "react";
import styled from "styled-components";
import { ArrowLeft, ArrowRight } from "styled-icons/evaicons-solid";
import { AppContext } from "../../App";
import { Date as DateAtom } from "../atoms/Date";

export const AppDate = () => {
  const { date, setDate } = React.useContext(AppContext);

  return (
    <>
      <StyledIcon>
        <ArrowLeft size="26" onClick={() => setDate(moveDate(date, -1))} />
      </StyledIcon>
      <StyledIcon>
        <ArrowRight size="26" onClick={() => setDate(moveDate(date, 1))} />
      </StyledIcon>
      <DateAtom />
    </>
  );
};

const StyledIcon = styled.div`
  display: inline-block;
  cursor: pointer;
`;

const moveDate = (dateString: string, moveDays: number): string => {
  const date = new Date(Date.parse(dateString));
  const movedDate = new Date(new Date(date).setDate(date.getDate() + moveDays));

  return [
    movedDate.getFullYear().toString().padStart(4, "0"),
    "-",
    (movedDate.getMonth() + 1).toString().padStart(2, "0"),
    "-",
    movedDate.getDate().toString().padStart(2, "0"),
  ].join("");
};
