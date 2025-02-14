import { Drawer } from "antd";
import classes from "./Header.module.css";

import SideBar from "./SideBar";

export default function CustomDrawer({ collapsed, setDrawerOpen }: any) {
  return (
    <div className={classes.drawer}>
      <Drawer
        open={collapsed}
        placement="left"
        // size="250px"
        classNames={{
          mask: classes.mask,
          body: classes.body,
          //   content: classes.body,
          wrapper: classes.body,
        }}
        onClose={() => {
          setDrawerOpen(false);
        }}
        closeIcon={false}
        width={250}
        maskClosable={true}
        className={classes.drawerContainer}
      >
        <SideBar />
      </Drawer>
    </div>
  );
}
