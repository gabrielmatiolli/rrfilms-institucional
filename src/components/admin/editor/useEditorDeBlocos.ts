"use client";

import { useCallback, useState } from "react";

import { criarBloco, type Bloco, type TipoDeBloco } from "@/lib/admin/blocos";

/** Estado e operações da lista de blocos. Sem efeito colateral — quem usa
 * serializa `blocos` num input escondido na hora de enviar o formulário. */
export function useEditorDeBlocos(iniciais: Bloco[]) {
  const [blocos, setBlocos] = useState<Bloco[]>(iniciais);
  const [abertoId, setAbertoId] = useState<string | null>(null);

  const adicionar = useCallback((tipo: TipoDeBloco, depoisDe?: string) => {
    const bloco = criarBloco(tipo);
    setBlocos((anterior) => {
      if (!depoisDe) return [...anterior, bloco];
      const indice = anterior.findIndex((b) => b.id === depoisDe);
      if (indice === -1) return [...anterior, bloco];
      return [...anterior.slice(0, indice + 1), bloco, ...anterior.slice(indice + 1)];
    });
    setAbertoId(bloco.id);
  }, []);

  const atualizar = useCallback((id: string, chave: string, valor: string) => {
    setBlocos((anterior) =>
      anterior.map((b) => (b.id === id ? { ...b, props: { ...b.props, [chave]: valor } } : b)),
    );
  }, []);

  const mover = useCallback((id: string, direcao: -1 | 1) => {
    setBlocos((anterior) => {
      const indice = anterior.findIndex((b) => b.id === id);
      const destino = indice + direcao;
      if (indice === -1 || destino < 0 || destino >= anterior.length) return anterior;
      const proximo = [...anterior];
      [proximo[indice], proximo[destino]] = [proximo[destino], proximo[indice]];
      return proximo;
    });
  }, []);

  const reordenar = useCallback((idArrastado: string, idAlvo: string) => {
    setBlocos((anterior) => {
      const de = anterior.findIndex((b) => b.id === idArrastado);
      const para = anterior.findIndex((b) => b.id === idAlvo);
      if (de === -1 || para === -1 || de === para) return anterior;
      const proximo = [...anterior];
      const [movido] = proximo.splice(de, 1);
      proximo.splice(para, 0, movido);
      return proximo;
    });
  }, []);

  const duplicar = useCallback((id: string) => {
    setBlocos((anterior) => {
      const indice = anterior.findIndex((b) => b.id === id);
      if (indice === -1) return anterior;
      const copia: Bloco = {
        ...anterior[indice],
        id: `${anterior[indice].tipo}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        props: { ...anterior[indice].props },
      };
      return [...anterior.slice(0, indice + 1), copia, ...anterior.slice(indice + 1)];
    });
  }, []);

  const remover = useCallback((id: string) => {
    setBlocos((anterior) => anterior.filter((b) => b.id !== id));
    setAbertoId((atual) => (atual === id ? null : atual));
  }, []);

  return {
    blocos,
    abertoId,
    setAbertoId,
    adicionar,
    atualizar,
    mover,
    reordenar,
    duplicar,
    remover,
  };
}
