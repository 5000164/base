import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { Anchor, AnchorProps } from "grommet/components/Anchor";

export type AnchorLinkProps = NavLinkProps &
  AnchorProps &
  Omit<JSX.IntrinsicElements["a"], "color">;

export const AnchorLink: React.FC<AnchorLinkProps> = (props) => (
  <Anchor
    as={({ colorProp, hasIcon, hasLabel, focus, ...p }) => <NavLink {...p} />}
    {...props}
  />
);
