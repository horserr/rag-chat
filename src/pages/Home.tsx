import React from "react";
import LayoutFactory from "../layouts/LayoutFactory";

const Home: React.FC = () => {
  return <LayoutFactory breadcrumbs={["Home"]}>content</LayoutFactory>;
};

export default Home;
