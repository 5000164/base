import React from "react";
import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import { Grid, Grommet, Main, Nav, Sidebar } from "grommet";
import ApolloClient from "apollo-boost";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { createGlobalStyle } from "styled-components";
import { TemplateList } from "./components/TemplateList";
import { PlanPage } from "./components/pages/PlanPage";

const client = new ApolloClient({
  uri: `http://localhost:${process.env.REACT_APP_BASE_PORT ?? "5164"}`,
});

export interface Task {
  id: number;
  name: string;
  status?: Status;
  estimate?: number;
  actual?: number;
}

export interface Template {
  id: number;
  name: string;
}

export interface TemplateTask {
  id: number;
  name: string;
  estimate?: number;
}

export enum Status {
  Normal = 0,
  Completed = 1,
  Archived = 2,
}

export const App = () => {
  return (
    <BrowserRouter>
      <Grommet plain themeMode="dark">
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
          <Grid
            rows={["fill"]}
            columns={["xsmall", "fill"]}
            gap="small"
            areas={[
              { name: "nav", start: [0, 0], end: [0, 0] },
              { name: "main", start: [1, 0], end: [1, 0] },
            ]}
          >
            <Sidebar gridArea="nav">
              <Nav gap="small">
                <NavLink to="/">Top</NavLink>
                <NavLink to="/plan">Plan</NavLink>
                <NavLink to="/templates">Templates</NavLink>
              </Nav>
            </Sidebar>
            <Main gridArea="main">
              <Switch>
                <Route path="/plan">
                  <PlanPage client={client} />
                </Route>
                <Route path="/templates">
                  <>
                    <TemplateList client={client} />
                  </>
                </Route>
              </Switch>
            </Main>
          </Grid>
        </HelmetProvider>
      </Grommet>
    </BrowserRouter>
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
