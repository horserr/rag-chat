import { Breadcrumb } from "antd";
import types from "./LayoutTypes"; // 引入布局类型枚举
// styles
import styles from "@styles/layouts/NormalLayout.module.scss";
import chatStyles from "@styles/layouts/ChatContentLayout.module.scss";
import evalStyles from "@styles/layouts/EvalContentLayout.module.scss";

interface LayoutFactoryProps {
  breadcrumbs?: string[];
  children: React.ReactNode;
  layoutType?: types; // 可选的布局类型
}
const layoutTypeMaps = {
  [types.normalLayout]: styles.contentLayout,
  [types.chatLayout]: chatStyles.chatContentLayout,
  [types.evalLayout]: evalStyles.evalContentLayout,
};

const LayoutFactory: React.FC<LayoutFactoryProps> = ({
  breadcrumbs,
  children,
  layoutType = types.normalLayout, // 默认使用 normalLayout
}) => {
  // 根据 layoutType 动态选择样式
  const layoutClass = layoutTypeMaps[layoutType] || styles.contentLayout; // 默认使用 normalLayout 的样式

  console.log("layoutType: ", layoutType);

  return (
    <div className={styles.normalInnerLayout}>
      {/* no custom style for breadcrumbs */}
      {breadcrumbs && (
        <Breadcrumb
          style={{
            height: "4rem",
            display: "flex",
            alignItems: "center",
            paddingBottom: "2rem",
            paddingLeft: "1rem",
          }}
        >
          {breadcrumbs.map((breadcrumb, index) => (
            <Breadcrumb.Item key={index}>{breadcrumb}</Breadcrumb.Item>
          ))}
        </Breadcrumb>
      )}

      <div className={layoutClass}>{children}</div>
    </div>
  );
};

export default LayoutFactory;
