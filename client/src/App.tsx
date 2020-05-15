import React from "react";
import ApolloClient from "apollo-boost";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { PlanList } from "./components/PlanList";

const client = new ApolloClient({
  uri: "http://localhost:5164",
});

export interface Task {
  id?: number;
  name?: string;
  estimate?: number;
}

export const App = () => (
  <HelmetProvider>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Base</title>
      <meta
        httpEquiv="Content-Security-Policy"
        content="script-src 'self' 'unsafe-inline';"
      />
    </Helmet>
    <PlanList client={client} />
  </HelmetProvider>
);
