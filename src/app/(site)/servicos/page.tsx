import type { Metadata } from "next";

import { CardDeServico } from "@/components/cards/Cartoes";
import { FaixaDeCta } from "@/components/sections/FaixaDeCta";
import { Galeria } from "@/components/sections/Galeria";
import { HeroSimples } from "@/components/sections/Heros";
import { CardDeBeneficio } from "@/components/ui/Elementos";
import { ListaDeFaq } from "@/components/ui/Faq";
import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import { galeriaPorChave } from "@/lib/dados/galerias";
import { listarServicos } from "@/lib/dados/servicos";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Seis películas para vidro e uma indicação por janela: controle solar, segurança antiestilhaço, privacidade, refletiva, proteção UV e manutenção.",
};


const comoEscolher = [
  {
    icone: "sol" as const,
    titulo: "Para onde o vidro está virado?",
    descricao:
      "A janela do oeste esquenta muito mais que a do sul no fim da tarde. A mesma película dá resultados bem diferentes em cada uma.",
  },
  {
    icone: "janela" as const,
    titulo: "Que vidro é esse?",
    descricao:
      "Cada tipo de vidro reage de um jeito ao calor. Película errada no vidro errado pode trincar — por isso a gente vai ver antes.",
  },
  {
    icone: "equipe" as const,
    titulo: "O que acontece nesse ambiente?",
    descricao:
      "Sala de reunião com projetor, quarto de bebê e loja de rua pedem transmissão luminosa diferente. Isso vem antes da estética.",
  },
];

const duvidas = [
  {
    pergunta: "A película escurece o ambiente?",
    resposta:
      "Não. A película segura o calor e deixa a luz passar. Dá para tirar quase todo o calor mantendo o ambiente claro e a vista lá fora — é exatamente isso que a nanocerâmica faz.",
  },
  {
    pergunta: "Quanto tempo dura?",
    resposta:
      "Entre 10 e 15 anos em aplicação interna, conforme a linha. A garantia de fábrica cobre descolamento, bolha e mudança de cor.",
  },
  {
    pergunta: "Preciso desocupar o ambiente?",
    resposta:
      "Não. A aplicação é seca, sem cheiro forte, e libera o ambiente no mesmo dia. Só pedimos 60 cm livres na frente do vidro.",
  },
  {
    pergunta: "Vocês atendem fora de Itatiba?",
    resposta:
      "Atendemos a região metropolitana sem custo de deslocamento. Para obra acima de 300 m² vamos a todo o estado.",
  },
];

export default async function Servicos() {
  const [servicos, galeria] = await Promise.all([
    listarServicos(),
    galeriaPorChave("servicos"),
  ]);

  return (
    <>
      <HeroSimples
        trilha={[{ rotulo: "Início", href: "/" }, { rotulo: "Serviços" }]}
        titulo="Seis películas. Uma indicação por vidro."
        lead="Não vendemos rolo, vendemos especificação. A película certa depende da orientação solar, do tipo de vidro e do que acontece dentro do ambiente."
        foto="srv-galeria-1"
      />

      {servicos.length > 0 && (
        <Secao fundo="pagina">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servicos.map((servico) => (
              <CardDeServico key={servico.titulo} servico={servico} />
            ))}
          </div>
        </Secao>
      )}

      {galeria && (
        <Galeria
          sobrancelha={galeria.sobrancelha}
          titulo={galeria.titulo}
          lead={galeria.lead}
          fundo="sutil"
          itens={galeria.itens}
        />
      )}

      <Secao fundo="sutil" id="como-escolher">
        <CabecalhoDeSecao
          sobrancelha="Como escolher"
          titulo="Três perguntas antes de olhar preço"
          lead="Se a proposta que você recebeu não responde a estas três, ela não foi feita para o seu vidro."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {comoEscolher.map((item) => (
            <CardDeBeneficio key={item.titulo} {...item} />
          ))}
        </div>
      </Secao>

      <Secao fundo="pagina" id="duvidas">
        <CabecalhoDeSecao
          sobrancelha="Dúvidas frequentes"
          titulo="O que a gente mais responde na visita"
        />
        <div className="mt-10">
          <ListaDeFaq duvidas={duvidas} />
        </div>
      </Secao>

      <FaixaDeCta />
    </>
  );
}
