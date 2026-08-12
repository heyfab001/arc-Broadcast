export interface NavItem {
  name: string;
  href: string;
  iconName: "LayoutDashboard" | "Send" | "KeyRound" | "History" | "Settings";
  badge?: string;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    href: "/",
    iconName: "LayoutDashboard",
  },
  {
    name: "Broadcast",
    href: "/broadcast",
    iconName: "Send",
    badge: "1-100",
  },
  {
    name: "Secret Pay",
    href: "/secret-pay",
    iconName: "KeyRound",
    badge: "Private",
  },
  {
    name: "History",
    href: "/history",
    iconName: "History",
  },
  {
    name: "Settings",
    href: "/settings",
    iconName: "Settings",
  },
];
