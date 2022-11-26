import React from "react";
import Button from "./Button";
import styled from "styled-components";
import { BarChartContext } from "../App";

const ControlsContainer = styled.div`
  margin-top: 80px;
`;

const Controls = () => {
  const { dataSources } = React.useContext(BarChartContext);
  return (
    <ControlsContainer>
      {dataSources.map((data, i) => (
        <Button
          isActive={data.isActive}
          key={i}
          type={data.type}
          url={data.URL}
        />
      ))}
    </ControlsContainer>
  );
};

export default Controls;
