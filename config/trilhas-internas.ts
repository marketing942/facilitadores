// Trilhas Internas: tutoriais e treinamentos feitos pelo time da CPPEM, vindos do Notion.
// O conteúdo (textos, vídeos, PDFs e acessos) fica SÓ no Notion: aqui vai o catálogo, com um resumo
// e o link da página de cada treinamento. Algumas páginas têm logins e senhas, por isso não são copiadas
// para este sistema, que abre sem login.

import type { Trilha } from "@/config/trilhas";

const notion = (id: string) => `https://app.notion.com/p/${id}`;

export const AREAS_INTERNAS = ["Comercial", "Marketing", "Pedagógico", "Geral"];

export const TRILHAS_INTERNAS: Trilha[] = [
  {
    slug: "comercial-vendas",
    nome: "Treinamentos de vendas",
    area: "Comercial",
    cursos: [
      { titulo: "Como fazer follow-ups", url: notion("2cbbbae8074c805d8dfbe9a1a9834254"), descricao: "O que é follow-up, por que ele fecha a maior parte das vendas e como fazer bem.", formatos: ["Texto"] },
      { titulo: "Como melhorar a conversão", url: notion("2cbbbae8074c8035ae2de936fcef8688"), descricao: "Diagnóstico para achar onde a venda está travando e o que ajustar.", formatos: ["Texto"] },
      { titulo: "Como aumentar o ticket médio", url: notion("2cbbbae8074c80ceb6c9d67e028686e9"), descricao: "Guia prático para vender mais por cliente, com a técnica de oferta irresistível.", formatos: ["Texto", "Imagens"] },
      { titulo: "Como fazer perguntas de condução", url: notion("2cbbbae8074c8029a297c54f7ef074d3"), descricao: "Perguntas que guiam o cliente ao próximo passo até a compra.", formatos: ["Texto", "Vídeo"] },
      { titulo: "Como conectar com o cliente", url: notion("2d6bbae8074c806198e0ec4bd1d01a6b"), descricao: "Material visual sobre criar conexão com o cliente.", formatos: ["Imagens"] },
      { titulo: "Etapas do funil de vendas", url: notion("2f3bbae8074c808dae75ef29e4cd4004"), descricao: "As etapas do funil de vendas da CPPEM.", formatos: ["Vídeo"] },
      { titulo: "Lições no processo de vendas", url: notion("309bbae8074c80f5b31cd8f3fed80f23"), descricao: "Lições práticas do processo de vendas, em imagens.", formatos: ["Imagens"] },
      { titulo: "Como fazer social selling", url: notion("309bbae8074c8063b321f5e7f5262391"), descricao: "Quadro no Miro e dois vídeos sobre vender pelas redes sociais.", formatos: ["Vídeo", "Quadro"] },
      { titulo: "Order bump, upsell e downsell", url: notion("309bbae8074c800f9233cf0511c07c74"), descricao: "Como oferecer produtos complementares, superiores ou alternativos na venda.", formatos: ["Vídeo"] },
      { titulo: "Mentalidade de vendas", url: notion("309bbae8074c80939dacc0f4833b4c0f"), descricao: "Os 3 pilares para ter sucesso em vendas, começando pela ambição.", formatos: ["Texto", "Imagens"] },
      { titulo: "Como fazer boas ligações", url: notion("33fbbae8074c80d28e78ef1a12a0a7d0"), descricao: "Para quem ligar primeiro e como conduzir a ligação.", formatos: ["Texto"] },
      { titulo: "Como utilizamos IA para vendas", url: notion("340bbae8074c80fab6c7c917f1abded3"), descricao: "Como vendedor e coordenador usam IA no dia a dia: objeções, follow-ups, dados e metas.", formatos: ["Texto"] },
      { titulo: "Vende-C", url: notion("39ebbae8074c80b394e8e8a3d881c71b"), descricao: "Material completo do Vende-C (arquivo grande, para baixar no Notion).", formatos: ["Arquivo"] },
    ],
  },
  {
    slug: "comercial-pos-venda",
    nome: "Treinamentos de pós-venda",
    area: "Comercial",
    cursos: [
      { titulo: "Passo a passo matrícula: Unicive", url: notion("309bbae8074c80bab750e24c1ad6d505"), descricao: "Do pagamento ao acesso do aluno na Unicive.", formatos: ["Texto"] },
      { titulo: "Como fazer provas e atividades", url: notion("309bbae8074c80b9b9c1f9571e10b178"), descricao: "Vídeo para orientar o aluno nas provas e atividades.", formatos: ["Vídeo"] },
      { titulo: "Como utilizar a plataforma de aluno: Unicive", url: notion("309bbae8074c800bb790ed620f87c092"), descricao: "Playlist sobre a plataforma do aluno Unicive.", formatos: ["Vídeo"] },
      { titulo: "Pagamento de boletos sem atraso", url: notion("309bbae8074c807682ade40856e9db61"), descricao: "Vídeo sobre como o aluno paga os boletos em dia.", formatos: ["Vídeo"] },
      { titulo: "Passo a passo matrícula: Turma Presencial CPPEM", url: notion("309bbae8074c80d194d4d64a44ff0549"), descricao: "Pagamento, formulário, contrato e cadastro do aluno da turma presencial.", formatos: ["Texto"] },
      { titulo: "Passo a passo matrícula: Mentoria CPPEM", url: notion("309bbae8074c808e976ef9bbbf9c8955"), descricao: "Pagamento, formulário e cadastro do aluno da mentoria na Tutory.", formatos: ["Texto"] },
      { titulo: "Como utilizar a plataforma de aluno: Tutory", url: notion("309bbae8074c8001bfadef2ebd2f89b1"), descricao: "Vídeo sobre a plataforma do aluno na Tutory.", formatos: ["Vídeo"] },
    ],
  },
  {
    slug: "comercial-processos",
    nome: "Treinamentos de processos comerciais",
    area: "Comercial",
    cursos: [
      { titulo: "Como criar cobranças no Asaas", url: notion("2e7bbae8074c80a882a9cfb32d0d5cb9"), descricao: "Vídeo do passo a passo para gerar cobranças no Asaas.", formatos: ["Vídeo"] },
      { titulo: "Como lançar venda no Conta Azul", url: notion("2e8bbae8074c8021bf84f3bd963f8538"), descricao: "Vídeo do lançamento de vendas no Conta Azul.", formatos: ["Vídeo"] },
      { titulo: "Como manter o chip aquecido e ativo", url: notion("2edbbae8074c80cf8e77c8c0731b069c"), descricao: "Cuidados com o chip do WhatsApp para evitar bloqueios, com o mapa do processo de banimento.", formatos: ["Texto", "PDF"] },
      { titulo: "Como utilizar o CRM Kentro: atendente", url: notion("309bbae8074c802596e0ee388a4739d8"), descricao: "Aulas em vídeo sobre o fluxo do CRM Kentro no dia a dia do comercial.", formatos: ["Vídeo"] },
      { titulo: "Como utilizar a plataforma de ligações Onvox", url: notion("330bbae8074c8019b532dc966e116f6a"), descricao: "Vídeo sobre a plataforma de ligações.", formatos: ["Vídeo"] },
      { titulo: "Disparo na API oficial do WhatsApp + CRM Kentro", url: notion("341bbae8074c80ba9cf6d4a969877eca"), descricao: "Como fazer disparos pela API oficial, com e sem emojis.", formatos: ["Vídeo"] },
    ],
  },
  {
    slug: "comercial-lideranca",
    nome: "Treinamentos de liderança comercial",
    area: "Comercial",
    cursos: [
      { titulo: "Como utilizar o CRM Kentro: administrador", url: notion("33fbbae8074c80dd98e3fb2d19816703"), descricao: "Quais módulos do curso da Kentro assistir, com o acesso da CPPEM.", formatos: ["Curso", "Imagens"] },
      { titulo: "Como analisar atendimentos", url: notion("341bbae8074c80a885a7ef7aef6be6d9"), descricao: "Checklist para avaliar os atendimentos do time: funil, argumentação e gatilhos.", formatos: ["Texto"] },
      { titulo: "Como incentivar seu time a usar o CRM", url: notion("36cbbae8074c802fb005d72948296c78"), descricao: "Dicas para o time preencher o CRM de forma correta e constante.", formatos: ["Texto"] },
    ],
  },
  {
    slug: "marketing-processos",
    nome: "Treinamentos de marketing",
    area: "Marketing",
    cursos: [
      { titulo: "Podcast", url: notion("303bbae8074c80f8afd2dd41082a91ed"), descricao: "Etapas do podcast, do agendamento do convidado à publicação.", formatos: ["Texto"] },
      { titulo: "Edição de elite & postagem 2026", url: notion("342bbae8074c804ea1c9e63869a2aa7f"), descricao: "Workflow de edição em 4 ondas para editar mais rápido e alcançar mais.", formatos: ["Texto"] },
      { titulo: "Curso de YouTube: Einerd", url: notion("378bbae8074c80809e8bf59a8f1ae686"), descricao: "Acesso ao curso Viver de YouTube.", formatos: ["Curso"] },
      { titulo: "Copywriting", url: notion("378bbae8074c8010b45ae32b1ec42d12"), descricao: "Vídeo sobre copywriting.", formatos: ["Vídeo"] },
      { titulo: "Oferta irresistível", url: notion("378bbae8074c80c7baa9d8e4980fedd2"), descricao: "PDF e vídeo sobre como montar uma oferta irresistível.", formatos: ["PDF", "Vídeo"] },
      { titulo: "Criação de links no Pixel", url: notion("390bbae8074c8086aea2f1138f097935"), descricao: "Passo a passo para criar links rastreados no Pixel X.", formatos: ["Texto", "Imagens"] },
      { titulo: "Premissas GADS", url: notion("399bbae8074c8069b957c05049d0ec56"), descricao: "Estrutura de rastreamento e de campanhas no Google Ads.", formatos: ["Texto", "Imagens"] },
    ],
  },
  {
    slug: "pedagogico-processos",
    nome: "Treinamentos do pedagógico",
    area: "Pedagógico",
    cursos: [
      { titulo: "Como usar a Tutory", url: notion("33cbbae8074c80f0858ddd636653e4d5"), descricao: "Acesso ao painel da Tutory usado pelo pedagógico.", formatos: ["Acesso"] },
      { titulo: "Como utilizar o Alpaclass", url: notion("33cbbae8074c806db404db3ee44c91ca"), descricao: "Página do treinamento do Alpaclass (ainda sem conteúdo no Notion).", formatos: [] },
      { titulo: "O que o pedagógico deve saber", url: notion("33cbbae8074c8064a880d7ef818906e2"), descricao: "Responsabilidades do pedagógico: plataformas, alunos, planos e aulas.", formatos: ["Texto"] },
      { titulo: "Google Meet para mentorias", url: notion("33cbbae8074c80c4b131e9aa7b7c14c8"), descricao: "Como conduzir mentorias e reuniões externas no Google Meet.", formatos: ["Vídeo"] },
      { titulo: "OBS Studio", url: notion("33cbbae8074c80418ba2f61aee54da05"), descricao: "Configurar o OBS para transmissões online e gravação de aulas.", formatos: ["Texto"] },
    ],
  },
  {
    slug: "geral-processos",
    nome: "Treinamentos gerais",
    area: "Geral",
    cursos: [
      { titulo: "Como utilizar o Rocket Chat", url: notion("330bbae8074c807a8da6fa301d9a5072"), descricao: "Vídeo e guia em PDF do chat interno.", formatos: ["Vídeo", "PDF"] },
      { titulo: "Como usar o Notion", url: notion("331bbae8074c80bba0ede6233be94e14"), descricao: "Vídeo básico para começar e uma playlist avançada opcional.", formatos: ["Vídeo"] },
      { titulo: "Como mapear processos", url: notion("3abbbae8074c80efb12fc3440baae8cc"), descricao: "Por que e como mapear os processos da sua área.", formatos: ["Texto", "Imagens"] },
    ],
  },
];
