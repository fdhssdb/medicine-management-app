import React, { useState, useEffect } from "react";
import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  Dropdown,
  message,
  Breadcrumb,
} from "antd";
import type { MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { defaultImg as logo } from "../utils/tools";

const { Header, Sider, Content } = Layout;

const sideMenuData = [
  {
    key: "/admin/dashboard",
    icon: <DashboardOutlined />,
    label: "看板",
  },
  {
    key: "/admin/medicine",
    icon: <VideoCameraOutlined />,
    label: "药品管理",
    children: [
      {
        key: "/admin/medicine/categories",
        icon: <VideoCameraOutlined />,
        label: "药品分类",
      },
      {
        key: "/admin/medicine/list",
        icon: <VideoCameraOutlined />,
        label: "药品信息"
      },
    ],
  },
  {
    key: "/admin/articles",
    icon: <UploadOutlined />,
    label: "文章管理",
    children: [
      {
        key: "/admin/articles/categories",
        icon: <VideoCameraOutlined />,
        label: "文章分类",
      },
      {
        key: "/admin/articles/list",
        icon: <VideoCameraOutlined />,
        label: "文章信息",
      },
    ],
  },
  {
    key: "/admin/users",
    icon: <UserOutlined />,
    label: "会员信息",
  },
];

/**
 *
 * @param key 查找当前选中的menu菜单的值
 * @returns
 */
const findOpenKeys = (key: string) => {
  const result: string[] = [];
  const findInfo = (arr: any) => {
    arr.forEach((item: any) => {
      if (key.includes(item.key)) {
        result.push(item.key);
        if (item.children) {
          findInfo(item.children);
        }
      }
    });
  };

  findInfo(sideMenuData);
  return result;
};

/**
 *
 * @param key 获取当前选中数据的所有父节点
 * @returns
 */
const findDeepPath = (key: string) => {
  const result: any = [];

  const findInfo = (arr: any) => {
    arr.forEach((item: any) => {
      const { children, ...info } = item;
      result.push(info);
      if (children) {
        findInfo(children); //递归处理子节点
      }
    });
  };

  findInfo(sideMenuData);

  const tmpData = result.filter((item: any) => key.includes(item.key));
  if (tmpData.length > 0) {
    return [{ label: "首页", key: "/admin/dashboard" }, ...tmpData];
  }
  return [];
};

const MyLayout = ({ children }: any) => {
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<any>([]);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tmpOpenKeys = findOpenKeys(pathname);

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logOut") {
      navigate("/");
    } else {
      message.info("暂未开通");
    }
  };
  const items: MenuProps["items"] = [
    {
      label: "个人中心",
      key: "userCenter",
    },
    {
      label: "退出",
      key: "logOut",
    },
  ];

  useEffect(() => {
    setBreadcrumbs(findDeepPath(pathname));
  }, [pathname]);

  return (
    <Layout style={{ width: "100vw", height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical">
          <img src={logo} alt="好大夫" />
        </div>
        <Menu
          onClick={({ key }) => {
            navigate(key);
          }}
          theme="light"
          mode="inline"
          defaultSelectedKeys={tmpOpenKeys}
          defaultOpenKeys={tmpOpenKeys}
          items={sideMenuData}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <span className="app-title">好大夫平台管理系统</span>
          <Dropdown menu={{ items, onClick }}>
            <img
              src={logo}
              alt="管理员头像"
              style={{
                width: "30px",
                borderRadius: "50%",
                float: "right",
                marginTop: "16px",
                marginRight: "20px",
              }}
            />
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Breadcrumb
            items={breadcrumbs.map((item: any) => {
              return { title: item.label };
            })}
          />

          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MyLayout;
