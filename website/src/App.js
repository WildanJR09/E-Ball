import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Eball from "./components/Eball/main.eball";
import MainLayouts from "./components/Layouts/main.layouts";
import { Sidebar } from "./components/Layouts/sidebar.layouts";
import Octocat from "./components/Utilities/octocat";
import Home from "./components/Home/main.home";
import FAQ from "./components/FAQ/main.faq";

const App = () => {
  return (
    <MainLayouts>
      <BrowserRouter>
        <Octocat />
        <div className="flex">
          <Sidebar />
          <main className="p-7 flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    title="Embrace Your Uniqueness."
                    description='"Empower Your Uniqueness: Where Your Emotions Find Strength"'
                  />
                }
              />
              <Route
                path="/eball"
                element={
                  <Eball
                    title="E Ball"
                    description="Embrace and open up your unique mental health journey."
                  />
                }
              />
              <Route path="/question" element={<FAQ />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </MainLayouts>
  );
};

export default App;
