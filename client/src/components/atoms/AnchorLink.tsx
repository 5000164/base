import { Anchor, AnchorProps } from "grommet/components/Anchor";
import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";

export const AnchorLink: React.FC<AnchorLinkProps> = (props) => {
  return (
    <Anchor
      as={({ colorProp, hasIcon, hasLabel, focus, ...p }) => <NavLink {...p} />}
      {...props}
    />
  );
};

export type AnchorLinkProps = NavLinkProps &
  AnchorProps &
  Omit<JSX.IntrinsicElements["a"], "color">;
