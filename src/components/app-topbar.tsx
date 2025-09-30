"use client";

import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

interface AppTopbarProps {
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
  showAction?: boolean;
}

export function AppTopbar({
  title: _title,
  actionLabel = "Novo",
  onAction,
  showAction = true,
}: AppTopbarProps) {
  const pathname = usePathname();

  // Gerar breadcrumbs baseado na rota atual
  const generateBreadcrumbs = () => {
    const breadcrumbs = [];

    // Sempre incluir Home como primeiro item
    breadcrumbs.push({
      label: "Home",
      href: "/",
      isActive: pathname === "/",
    });

    // Se não estiver na página inicial, adicionar breadcrumbs específicos
    if (pathname !== "/") {
      const segments = pathname.split("/").filter(Boolean);
      let currentPath = "";

      segments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const isLast = index === segments.length - 1;

        // Mapear segmentos para labels legíveis
        const segmentMap: Record<string, string> = {
          documentos: "Documentos",
          funcionarios: "Funcionários",
          empresa: "Empresa",
          relatorios: "Relatórios",
          "relatorio-tecnico": "Relatório Técnico",
        };

        const label =
          segmentMap[segment] ||
          segment.charAt(0).toUpperCase() + segment.slice(1);

        breadcrumbs.push({
          label,
          href: currentPath,
          isActive: isLast,
        });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 bg-background px-4 md:px-6 w-full">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />

      <div className="flex flex-1 items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={`${breadcrumb.href}-${index}`}>
                <BreadcrumbItem>
                  {breadcrumb.isActive ? (
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={breadcrumb.href}>
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {showAction && (
          <Button onClick={onAction} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </div>
    </header>
  );
}
