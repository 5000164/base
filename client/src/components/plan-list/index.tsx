import React, { useEffect, useState } from "react";
import ApolloClient, { gql } from "apollo-boost";
import { PlanListItem } from "../plan-list-item";
import { Query } from "../../generated/graphql";

const client = new ApolloClient({
  uri: "http://localhost:4000",
});

export const PlanList = () => {
  const [items, setItems] = useState([] as string[]);
  const [error, setError] = useState(false);

  const setItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, ...[""]]);
  };

  const fetchItems = () => {
    setError(false);
    client
      .query<Query>({
        query: gql`
          {
            plan
          }
        `,
      })
      .then((result) => setItems(result.data.plan))
      .catch(() => setError(true));
  };

  useEffect(fetchItems, []);

  return (
    <div>
      {error ? (
        <>
          <div>Error</div>
          <button onClick={fetchItems}>Retry</button>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};
