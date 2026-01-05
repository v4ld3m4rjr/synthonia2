# Documentação do Plano de Migração para Python (Python-First)

Este documento detalha a estratégia para transformar o Synthonia em uma aplicação centrada em Python, utilizando **Streamlit** como interface de usuário para rápida iteração e foco em dados, mantendo a robustez do backend e banco de dados já estabelecidos.

## 1. Visão Geral da Nova Arquitetura

O objetivo é simplificar a stack tecnológica, removendo a complexidade do React/Vite para uma equipe focada em ciência de dados e lógica clínica em Python.

**Stack Anterior:**
*   Frontend: React + Vite + Tailwind (Complexo, requer JS/TS)
*   Backend: Python FastAPI (Separado)
*   DB: Supabase

**Nova Stack (Python-First):**
*   **Aplicação Fullstack:** Python + Streamlit
    *   Interface construída inteiramente em Python.
    *   Conexão direta com Supabase via `supabase-py`.
    *   Gráficos e Dashboards nativos (Pandas/Altair/Plotly).
*   **Banco de Dados:** Supabase (Mantido inalterado).

---

## 2. Estrutura de Diretórios Proposta

```
synthonia2/
├── .streamlit/              # Configurações de tema e servidor do Streamlit
│   └── config.toml
├── app/                     # Código Fonte da Aplicação
│   ├── modules/             # Módulos de negócio (reaproveitados do backend antigo)
│   │   ├── home.py          # Lógica do Dashboard
│   │   ├── training.py      # Lógica de Treino
│   │   ├── spravato.py      # Lógica de Spravato
│   │   └── evaluation.py    # Lógica de Testes
│   ├── ui/                  # Componentes de Interface (Widgets Streamlit)
│   │   ├── auth.py          # Tela de Login/Cadastro
│   │   ├── sidebar.py       # Menu lateral
│   │   └── cards.py         # Cards de métricas
│   └── utils/               # Utilitários (DB, Cálculos)
│       ├── db.py            # Conexão Singleton com Supabase
│       └── calculations.py  # Algoritmos de risco
├── legacy_react/            # Arquivo morto do frontend antigo (Backup)
├── requirements.txt         # Dependências Python
├── Home.py                  # Ponto de entrada (Página Principal)
└── pages/                   # Páginas do Streamlit (Roteamento Automático)
    ├── 1_Dashboard.py
    ├── 2_Treino.py
    ├── 3_Spravato.py
    └── 4_Avaliacao.py
```

---

## 3. Plano de Implementação

### Fase 1: Configuração Inicial (Imediata)
1.  Limpar a raiz do projeto (Mover React para `legacy_react`).
2.  Criar ambiente virtual Python e `requirements.txt`.
3.  Configurar conexão com Supabase em `app/utils/db.py`.

### Fase 2: Migração de Lógica
1.  Adaptar os scripts de `backend/app/modules/*.py` para serem funções puras que retornam dados ou DataFrames, sem dependência do FastAPI.
2.  Implementar autenticação simples usando Streamlit Session State + Supabase Auth.

### Fase 3: Construção da Interface (Streamlit)
1.  **Home.py:** Tela de Login e Redirecionamento.
2.  **Dashboard:** Visualização de métricas e alertas (Risco de Mania/Suicídio).
3.  **Formulários:** Recriar os formulários de Treino e Spravato usando `st.form`, `st.number_input`, etc.

---

## 4. Benefícios Esperados
*   **Velocidade de Desenvolvimento:** Criar novas features de análise de dados é 10x mais rápido em Streamlit do que em React.
*   **Código Unificado:** Tudo em Python. Mesma linguagem para análise, backend e frontend.
*   **Foco no Produto:** Menos tempo gastando com CSS/Responsividade, mais tempo refinando algoritmos clínicos.
