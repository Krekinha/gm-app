"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { RelatorioTecnicoData, FotoRelatorio } from "@/lib/relatorio-types";
import { DadosContrato } from "./DadosContrato";
import { Escopo } from "./Escopo";
import { ItensTecnicos } from "./ItensTecnicos";
import { DadosEmpresa } from "./DadosEmpresa";
import { DadosResponsavel } from "./DadosResponsavel";
import { DadosContato } from "./DadosContato";
import { BackgroundImageUpload } from "./BackgroundImageUpload";

interface RelatorioFormProps {
  form: UseFormReturn<RelatorioTecnicoData>;
  fotos: FotoRelatorio[];
  onAddItemTecnico: () => void;
  onRemoveItemTecnico: (itemId: string) => void;
  onLinkPhoto: (fotoId: string, itemId: string) => void;
  onUnlinkPhoto: (fotoId: string) => void;
}

export function RelatorioForm({
  form,
  fotos,
  onAddItemTecnico,
  onRemoveItemTecnico,
  onLinkPhoto,
  onUnlinkPhoto
}: RelatorioFormProps) {
  const { watch, setValue } = form;
  const formData = watch();

  // Criar mapa de fotos vinculadas por item
  const fotosVinculadasMap: { [itemId: string]: string[] } = {};
  fotos.forEach(foto => {
    if (foto.vinculadaA) {
      if (!fotosVinculadasMap[foto.vinculadaA]) {
        fotosVinculadasMap[foto.vinculadaA] = [];
      }
      fotosVinculadasMap[foto.vinculadaA].push(foto.id);
    }
  });

  return (
    <div className="space-y-6">
      {/* Dados do Contrato */}
      <DadosContrato
        data={{
          contrato: formData.contrato,
          valorInicial: formData.valorInicial,
          rq: formData.rq,
          os: formData.os,
          pedido: formData.pedido
        }}
        onChange={(field, value) => setValue(field as keyof RelatorioTecnicoData, value)}
      />

      {/* Escopo */}
      <Escopo
        escopo={formData.descricaoEscopo}
        onChange={(value) => setValue("descricaoEscopo", value)}
      />

      {/* Itens Técnicos */}
      <ItensTecnicos
        itens={formData.itensTecnicos.map(item => ({
          ...item,
          fotosVinculadas: fotosVinculadasMap[item.id] || []
        }))}
        onAddItem={onAddItemTecnico}
        onRemoveItem={onRemoveItemTecnico}
        onUpdateItem={(itemId, descricao) => {
          const updatedItens = formData.itensTecnicos.map(item =>
            item.id === itemId ? { ...item, descricao } : item
          );
          setValue("itensTecnicos", updatedItens);
        }}
        fotosVinculadas={fotosVinculadasMap}
      />

      {/* Dados da Empresa */}
      <DadosEmpresa
        data={{
          nomeRelatorio: formData.nomeRelatorio,
          nomeEmpresa: formData.nomeEmpresa,
          cnpjEmpresa: formData.cnpjEmpresa
        }}
        onChange={(field, value) => setValue(field as keyof RelatorioTecnicoData, value)}
      />

      {/* Dados do Responsável */}
      <DadosResponsavel
        data={{
          nomeResponsavel: formData.nomeElaborador,
          cargo1: formData.cargo1,
          cargo2: formData.cargo2,
          dataElaboracao: formData.dataElaboracao
        }}
        onChange={(field, value) => {
          const fieldMap: { [key: string]: keyof RelatorioTecnicoData } = {
            nomeResponsavel: "nomeElaborador",
            cargo1: "cargo1",
            cargo2: "cargo2",
            dataElaboracao: "dataElaboracao"
          };
          setValue(fieldMap[field], value);
        }}
      />

      {/* Dados de Contato */}
      <DadosContato
        data={{
          telefone: formData.telefone,
          email: formData.email,
          endereco: formData.nomeEmpresaRodape
        }}
        onChange={(field, value) => {
          const fieldMap: { [key: string]: keyof RelatorioTecnicoData } = {
            telefone: "telefone",
            email: "email",
            endereco: "nomeEmpresaRodape"
          };
          setValue(fieldMap[field], value);
        }}
      />

      {/* Upload de Imagem de Fundo */}
      <BackgroundImageUpload
        backgroundImage={formData.imagemFundo}
        onSetBackgroundImage={(dataUrl) => setValue("imagemFundo", dataUrl)}
        onRemoveBackgroundImage={() => setValue("imagemFundo", undefined)}
      />
    </div>
  );
}
