"use client"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb"

interface AppTopbarProps {
  title?: string
  actionLabel?: string
  onAction?: () => void
  showAction?: boolean
}

export function AppTopbar({ 
  title, 
  actionLabel = "Novo", 
  onAction, 
  showAction = true 
}: AppTopbarProps) {

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 bg-background px-4 md:px-6 w-full">
      <SidebarTrigger className="-ml-1"/>
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      
      <div className="flex flex-1 items-center justify-between">
        
      <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Group 01</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Item 01</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
      </div>
    </header>
  )
}
