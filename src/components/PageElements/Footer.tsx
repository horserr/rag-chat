import styles from "@styles/layouts/NormalLayout.module.scss";

const Footer = () => {
  return (
    <div className={styles.footer}>
      Powered by Ant Design ©{new Date().getFullYear()} Created by yz L
    </div>
  );
};

export default Footer;
