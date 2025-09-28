"use client"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Plus } from "lucide-react"
import { usePathname } from "next/navigation"

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
  const pathname = usePathname()
  
  // Mapear rotas para títulos
  const getPageTitle = () => {
    if (title) return title
    
    const routeMap: Record<string, string> = {
      '/': 'Dashboard',
      '/documentos/funcionarios': 'Funcionários',
      '/documentos/empresa': 'Empresa',
      '/relatorios/relatorio-tecnico': 'Relatório Técnico'
    }
    
    return routeMap[pathname] || 'Página'
  }

  // Gerar breadcrumbs baseado na rota atual
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = []

    // Sempre incluir Home como primeiro item
    breadcrumbs.push({
      label: 'Home',
      href: '/',
      isActive: pathname === '/'
    })

    // Se não estiver na página inicial, adicionar breadcrumbs específicos
    if (pathname !== '/') {
      let currentPath = ''
      
      segments.forEach((segment, index) => {
        currentPath += `/${segment}`
        
        // Mapear segmentos para labels legíveis
        const segmentMap: Record<string, string> = {
          'documentos': 'Documentos',
          'funcionarios': 'Funcionários',
          'empresa': 'Empresa',
          'relatorios': 'Relatórios',
          'relatorio-tecnico': 'Relatório Técnico',
        }
        
        const label = segmentMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
        const isLast = index === segments.length - 1
        
        breadcrumbs.push({
          label,
          href: currentPath,
          isActive: isLast
        })
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 bg-background px-4  md:px-6 w-full">
      <SidebarTrigger />
      
      <div className="flex flex-1 items-center justify-between min-w-0">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <div key={breadcrumb.href} className="flex items-center">
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
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          
        </div>
        
        {showAction && (
          <Button onClick={onAction} size="sm" className="gap-2 flex-shrink-0">
            <Plus className="h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </div>
    </header>
  )
}
