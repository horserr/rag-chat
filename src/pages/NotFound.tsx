import { Link } from "react-router-dom";
import LayoutFactory from "../layouts/LayoutFactory";
import { Result } from "antd";

const NotFound = () => {
  return (
    <LayoutFactory>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Link to="/">Back Home</Link>}

      />
    </LayoutFactory>
  );
};

export default NotFound;
