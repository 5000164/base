import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { PlanList } from "./components/PlanList";

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
    <PlanList />
  </HelmetProvider>
);
