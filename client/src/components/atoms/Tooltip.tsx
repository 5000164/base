import React from "react";
import styled from "styled-components";
import { EventDetail } from "../../types/eventDetail";
import { theme } from "../../theme";

export const Tooltip = ({
  top,
  left,
  eventDetail,
}: {
  top: number;
  left: number;
  eventDetail: EventDetail;
}) => (
  <StyledTooltip top={top} left={left}>
    <div>
      {eventDetail.start} - {eventDetail.end}
    </div>
    <div>{eventDetail.title}</div>
  </StyledTooltip>
);

const StyledTooltip = styled.div<{ top: number; left: number }>`
  z-index: 2;
  position: absolute;
  top: ${({ top }) => `${top}px`};
  left: ${({ left }) => `${left}px`};
  padding: 4px 16px 8px 16px;
  background: ${theme.global.colors.background};
  box-shadow: 0 0 2px rgba(255, 255, 255, 0.2);
`;
