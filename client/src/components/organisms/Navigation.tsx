import React from "react";
import styled from "styled-components";
import { CalendarTodo } from "styled-icons/remix-line";
import { Today } from "styled-icons/material";
import { Template } from "styled-icons/heroicons-solid";
import { ClockFill, ListTask } from "styled-icons/bootstrap";
import { DateNavigator } from "../molecules/DateNavigator";
import { AnchorLink } from "../atoms/AnchorLink";

export const Navigation = () => {
  return (
    <StyledNavigation>
      <Draggable />
      <StyledDateNavigator>
        <DateNavigator />
      </StyledDateNavigator>
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
      <hr />
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

const StyledDateNavigator = styled.div`
  width: 100%;
  height: 40px;
  margin-top: 40px;
  margin-bottom: 24px;
`;

const NavigationItem = styled(AnchorLink)`
  display: block;
  width: 100%;
  height: 40px;
`;

const StyledIcon = styled.div`
  display: inline-block;
  width: 32px;
  margin: 8px 0 0 8px;
  padding: 0;
  text-align: center;
`;

const StyledTitle = styled.div`
  display: inline-block;
  margin-left: 8px;
`;
