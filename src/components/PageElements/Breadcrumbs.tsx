import React from "react";
import { Breadcrumb } from "antd";

interface BreadcrumbsProps {
  items: string[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      {items.map((item, index) => (
        <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
