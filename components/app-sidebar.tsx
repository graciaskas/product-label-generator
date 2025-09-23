"use client";

import { useTranslation } from "react-i18next";
import {
  Package,
  History,
  Settings,
  FileText,
  BarChart3,
  Home,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Tableau de bord",
    url: "/web",
    icon: Home,
  },
  {
    title: "Générer étiquettes",
    url: "/web/generate",
    icon: FileText,
  },
  {
    title: "Gestion produits",
    url: "/web/products",
    icon: Package,
  },
  {
    title: "Utilisateurs",
    url: "/web/users",
    icon: Users,
  },
  {
    title: "Historique",
    url: "/web/history",
    icon: History,
  },
  {
    title: "Statistiques",
    url: "/web/stats",
    icon: BarChart3,
  },
  {
    title: "Paramètres",
    url: "/web/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div
            style={{ backgroundColor: "oklch(40.40% 0.042 160.33)" }}
            className="w-8 h-8  rounded-lg flex items-center justify-center"
          >
            <Package className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">PHARMAKINA</h2>
            <p className="text-sm text-muted-foreground">
              {t('labelGenerator')}
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => {
                const translationKeys = [
                  'dashboard',
                  'generateLabels', 
                  'productManagement',
                  'users',
                  'history',
                  'statistics',
                  'settings'
                ];
                return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{t(translationKeys[index])}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )})}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
