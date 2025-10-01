"use client";

import { toast } from "sonner";

/**
 * Tipos de notificação disponíveis
 */
export type NotificationType = "error" | "warning" | "success" | "info";

/**
 * Hook personalizado para tratamento de notificações com toast
 * Integra com Sonner para exibir mensagens com cores e designs específicos
 */
export function useErrorHandler() {
  /**
   * Exibe uma mensagem de erro usando toast
   * @param error - Erro a ser exibido (pode ser Error, string ou objeto com message)
   * @param title - Título opcional para o toast
   */
  const showError = (error: unknown, title?: string) => {
    let errorMessage = "Ocorreu um erro inesperado";
    
    if (typeof error === "string") {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = String(error.message);
    } else if (error && typeof error === "object" && "error" in error) {
      errorMessage = String(error.error);
    }

    toast.error(title || "Erro", {
      description: errorMessage,
      duration: 5000,
      className: "border-red-500 bg-red-50 text-red-900",
      style: {
        borderLeft: "4px solid #ef4444",
      },
    });
  };

  /**
   * Exibe uma mensagem de sucesso usando toast
   * @param message - Mensagem de sucesso
   * @param title - Título opcional para o toast
   */
  const showSuccess = (message: string, title?: string) => {
    toast.success(title || "Sucesso", {
      description: message,
      duration: 3000,
      className: "border-green-500 bg-green-50 text-green-900",
      style: {
        borderLeft: "4px solid #22c55e",
      },
    });
  };

  /**
   * Exibe uma mensagem de informação usando toast
   * @param message - Mensagem informativa
   * @param title - Título opcional para o toast
   */
  const showInfo = (message: string, title?: string) => {
    toast.info(title || "Informação", {
      description: message,
      duration: 4000,
      className: "border-blue-500 bg-blue-50 text-blue-900",
      style: {
        borderLeft: "4px solid #3b82f6",
      },
    });
  };

  /**
   * Exibe uma mensagem de aviso usando toast
   * @param message - Mensagem de aviso
   * @param title - Título opcional para o toast
   */
  const showWarning = (message: string, title?: string) => {
    toast.warning(title || "Aviso", {
      description: message,
      duration: 4000,
      className: "border-yellow-500 bg-yellow-50 text-yellow-900",
      style: {
        borderLeft: "4px solid #eab308",
      },
    });
  };

  /**
   * Exibe uma notificação personalizada com tipo específico
   * @param type - Tipo da notificação
   * @param message - Mensagem a ser exibida
   * @param title - Título opcional para o toast
   */
  const showNotification = (type: NotificationType, message: string, title?: string) => {
    switch (type) {
      case "error":
        showError(message, title);
        break;
      case "warning":
        showWarning(message, title);
        break;
      case "success":
        showSuccess(message, title);
        break;
      case "info":
        showInfo(message, title);
        break;
    }
  };

  /**
   * Wrapper para funções assíncronas que trata erros automaticamente
   * @param asyncFn - Função assíncrona a ser executada
   * @param errorTitle - Título opcional para erros
   * @returns Resultado da função ou undefined em caso de erro
   */
  const handleAsync = async <T>(
    asyncFn: () => Promise<T>,
    errorTitle?: string
  ): Promise<T | undefined> => {
    try {
      return await asyncFn();
    } catch (error) {
      showError(error, errorTitle);
      return undefined;
    }
  };

  return {
    showError,
    showSuccess,
    showInfo,
    showWarning,
    showNotification,
    handleAsync,
  };
}
