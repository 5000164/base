import React from "react";
import styled from "styled-components";
import { Button, Layer } from "grommet";
import { Template } from "../../App";
import DefaultClient from "apollo-boost";
import { TemplateTaskList } from "../TemplateTaskList";

export const TemplateTaskListLayer = ({
  client,
  template,
  setShow,
}: {
  client: DefaultClient<any>;
  template: Template;
  setShow: Function;
}) => {
  return (
    <StyledLayer
      full={"vertical"}
      margin={"large"}
      onEsc={() => setShow(false)}
      onClickOutside={() => setShow(false)}
    >
      <TemplateTaskList client={client} template={template} />
      <Button label="close" onClick={() => setShow(false)} />
    </StyledLayer>
  );
};

const StyledLayer = styled(Layer)`
  width: min(1024px, 100%);
`;
