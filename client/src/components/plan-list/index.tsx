import React, { useState } from "react";
import { PlanListItem } from "../plan-list-item";

export const PlanList = () => {
  const [items, addItem] = useState([] as string[]);

  return (
    <div>
      <ul>
        {items.map((item, index) => (
          <PlanListItem key={index} value={item} />
        ))}
      </ul>
      <button onClick={() => addItem([...items, ...[""]])}>Add</button>
    </div>
  );
};
