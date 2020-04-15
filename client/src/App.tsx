import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>base</title>
        <meta
          httpEquiv="Content-Security-Policy"
          content="script-src 'self' 'unsafe-inline';"
        />
      </Helmet>
      <h1>Hello World!</h1>
    </HelmetProvider>
  );
}

export default App;
