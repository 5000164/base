import React, { useState } from "react";
import ApolloClient from "apollo-boost";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { createGlobalStyle } from "styled-components";
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
      <GlobalStyle />
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

const GlobalStyle = createGlobalStyle`
  html {
    width: 100%;
    height: 100%;
    margin: 0;
    font-family: serif;
    font-weight: lighter;
    font-size: 10px;
    font-kerning: normal; // フォントのカーニングを常に有効にする
    font-feature-settings: "palt"; // 自動カーニングさせる
    letter-spacing: 0.03rem; // 字間を調整
    -webkit-font-smoothing: antialiased; // フォントにアンチエイリアスをかける (少し細く見える)
    -moz-osx-font-smoothing: grayscale;
  }
  body {
    width: 100%;
    height: 100%;
    margin: 0;
    font-size: 1.8rem;
    line-height: 1.55;
    color: hsl(235, 10%, 28%);
    background-color: hsl(0, 100%, 100%);
  }
  a {
    color: hsl(235, 10%, 50%);
  }
  a:visited {
    color: hsl(235, 10%, 50%);
  }
  * {
    box-sizing: border-box;
  }
`;
