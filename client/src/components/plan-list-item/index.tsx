import React from "react";

export const PlanListItem = ({
  value,
  setItem,
}: {
  value: string;
  setItem: Function;
}) => (
  <li>
    <input
      type="text"
      value={value}
      onChange={(e) => setItem(e.target.value)}
    />
  </li>
);
