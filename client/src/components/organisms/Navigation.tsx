import React from "react";
import styled from "styled-components";
import { Calendar } from "styled-icons/boxicons-regular";
import { CalendarTodo } from "styled-icons/remix-line";
import { Today } from "styled-icons/material";
import { Template } from "styled-icons/heroicons-solid";
import { ClockFill, ListTask } from "styled-icons/bootstrap";
import { theme } from "../../theme";
import { DateNavigator } from "../molecules/DateNavigator";
import { AnchorLink } from "../atoms/AnchorLink";

export const Navigation = () => {
  return (
    <StyledNavigation>
      <Draggable />
      <DateNavigatorWrapper>
        <StyledIcon>
          <Calendar size="30" />
        </StyledIcon>
        <StyledDateNavigator>
          <DateNavigator />
        </StyledDateNavigator>
      </DateNavigatorWrapper>
      <NavigationItem to="/">
        <StyledIcon>
          <CalendarTodo size="30" />
        </StyledIcon>
        <StyledTitle>Backlog</StyledTitle>
      </NavigationItem>
      <NavigationItem to="/review">
        <StyledIcon>
          <Today size="30" />
        </StyledIcon>
        <StyledTitle>Review</StyledTitle>
      </NavigationItem>
      <NavigationItem to="/templates">
        <StyledIcon>
          <Template size="32" />
        </StyledIcon>
        <StyledTitle>Templates</StyledTitle>
      </NavigationItem>
      <NavigationItem to="/task-tracks">
        <StyledIcon>
          <ClockFill size="24" />
        </StyledIcon>
        <StyledTitle>Tracks</StyledTitle>
      </NavigationItem>
      <StyledHr />
      <NavigationItem to="/tasks">
        <StyledIcon>
          <ListTask size="30" />
        </StyledIcon>
        <StyledTitle>All Tasks</StyledTitle>
      </NavigationItem>
    </StyledNavigation>
  );
};

const Draggable = styled.div`
  -webkit-app-region: drag;
  width: 100%;
  height: 32px;
`;

const StyledNavigation = styled.div`
  background: hsla(0, 0%, 0%, 0);
`;

const DateNavigatorWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  margin-left: 8px;
`;

const StyledDateNavigator = styled.div`
  width: calc(100% - 32px);
  margin-left: 8px;
`;

const NavigationItem = styled(AnchorLink)`
  display: flex;
  align-items: center;
  width: 100%;
  height: 32px;
  margin-top: 8px;
  margin-left: 8px;
`;

const StyledIcon = styled.div`
  display: inline-block;
  width: 32px;
  text-align: center;
`;

const StyledTitle = styled.div`
  margin-left: 8px;
`;

const StyledHr = styled.hr`
  height: 1px;
  margin: 16px 0 16px 48px;
  background: ${theme.global.colors.border};
  border: none;
`;
