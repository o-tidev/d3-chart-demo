import React, { useState } from "react";
import styled from "styled-components";
import BarChart from "./components/BarChart";
import Controls from "./components/Controls";

const AppContainer = styled.div`
  background: white;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  min-width: 100vw;
`;

function App() {
  return (
    <BarChartProvider>
      <BarChartWrapper />
    </BarChartProvider>
  );
}

// eslint-disable-next-line react/display-name
const BarChartWrapper = React.memo(() => {
  return (
    <AppContainer>
      <BarChart />
      <Controls />
    </AppContainer>
  );
});

function BarChartProvider({ children }) {
  const [data, setData] = useState([]);
  const [currentData, setcurrentData] = useState({
    type: "GDP",
    URL:
      "https://gist.githubusercontent.com/arslanastral/07260a81a2a1a0f6f811ac16f573e3bc/raw/93e7503fb0e3b807454094105565f695fb5c995b/world-gdp.csv",
  });

  const [dataSources, setdataSources] = useState([
    {
      type: "GDP",
      URL:
        "https://gist.githubusercontent.com/arslanastral/07260a81a2a1a0f6f811ac16f573e3bc/raw/93e7503fb0e3b807454094105565f695fb5c995b/world-gdp.csv",
      isActive: true,
    },

    {
      type: "GDP Per Capita",
      URL:
        "https://gist.githubusercontent.com/arslanastral/ad5735653b14aa17d51c3560d7990de3/raw/4d792fbe9285fcf7bb6dcf5a32e80289ca7c7013/world-gdp-per-capita.csv",
      isActive: false,
    },
    {
      type: "GDP Growth",
      URL:
        "https://gist.githubusercontent.com/arslanastral/4aaed77039e8a0bcc6756ec5e13bd2bf/raw/fb834f153b72cfce95ab92b708d5b0a0c3b8d02c/world-gdp-growth.csv",
      isActive: false,
    },
  ]);

  return (
    <BarChartContext.Provider
      value={{
        data,
        setData,
        currentData,
        setcurrentData,
        dataSources,
        setdataSources,
      }}
    >
      {children}
    </BarChartContext.Provider>
  );
}

export const BarChartContext = React.createContext();
export default App;
