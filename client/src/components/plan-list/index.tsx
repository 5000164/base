import React, { useState } from "react";
import { PlanListItem } from "../plan-list-item";

export const PlanList = () => {
  const [items, setItems] = useState([] as string[]);

  const setItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, ...[""]]);
  };

  return (
    <div>
      <ul>
        {items.map((item, index) => (
          <PlanListItem
            key={index}
            value={item}
            setItem={(v: string) => setItem(index, v)}
          />
        ))}
      </ul>
      <button onClick={addItem}>Add</button>
    </div>
  );
};
