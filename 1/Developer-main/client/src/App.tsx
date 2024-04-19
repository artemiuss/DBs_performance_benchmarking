import './App.css'
import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LoginPage from "./components/auth/LoginPage.tsx";
import RequestAccess from "./components/auth/RequestAccess.tsx";
import Sandbox from "./components/sandbox/Sandbox.tsx";
import PrivateRoutes from "./components/auth/PrivateRoutes.tsx";
import AnonymousRoutes from "./components/auth/AnonymousRoutes.tsx";

// registers the stoplight elements web component with react
// Stoplight *has* a React component, but it's a bit painful to work with when not using webpack and create react app.
// The web component they offer is much easier to deal with.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'elements-api': ElementsApiProps
        }
    }
}

interface ElementsApiProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
    router: string;
    hideSchemas: string;
    basePath: string;
    hideExport: string;
    apiDescriptionUrl: string;
}

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route element={<AnonymousRoutes/>}>
                  <Route path="/" element={<LoginPage/>}></Route>
                  <Route path="/signup" element={<RequestAccess/>}></Route>
              </Route>
              <Route element={<PrivateRoutes/>}>
                  <Route path="/sandbox/*" element={<Sandbox/>}></Route>
              </Route>
              <Route path="*" element={<Navigate to="/"/>}></Route>
          </Routes>
      </BrowserRouter>
  )
}

export default App
