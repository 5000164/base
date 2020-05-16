import React, { useState } from "react";
import ApolloClient from "apollo-boost";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { PlanList } from "./components/PlanList";
import { CompletedList } from "./components/CompletedList";

const client = new ApolloClient({
  uri: "http://localhost:5164",
});

export interface Task {
  id?: number;
  name?: string;
  estimate?: number;
}

export const App = () => {
  const [reload, setReload] = useState(0);
  const countUpReload = () => setReload(reload + 1);

  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Base</title>
        <meta
          httpEquiv="Content-Security-Policy"
          content="script-src 'self' 'unsafe-inline';"
        />
      </Helmet>
      <PlanList client={client} countUpReload={countUpReload} />
      <CompletedList client={client} reload={reload} />
    </HelmetProvider>
  );
};
