import React, { useEffect, useState } from "react";
import ApolloClient, { gql } from "apollo-boost";
import { PlanListItem } from "../plan-list-item";

const client = new ApolloClient({
  uri: "http://localhost:4000",
});

interface Plan {
  plan: string[];
}

export const PlanList = () => {
  const [items, setItems] = useState([] as string[]);
  useEffect(() => {
    client
      .query<Plan>({
        query: gql`
          {
            plan
          }
        `,
      })
      .then((result) => setItems(result.data.plan));
  }, []);

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
