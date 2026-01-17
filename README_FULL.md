# Documentação Completa do Projeto Synthonia

## 1. Visão Geral e Propósito

**Synthonia** é uma plataforma de monitoramento integrativo de saúde projetada para gerenciar e correlacionar dados de saúde mental (especificamente transtornos de humor como Bipolaridade e Depressão) com desempenho físico e tratamentos farmacológicos avançados (como Spravato/Esketamina).

### Objetivo Principal
Fornecer aos pacientes ("sujeitos"), médicos e treinadores uma visão unificada do estado do paciente, permitindo:
- **Detecção Precoce:** Identificar riscos de virada maníaca ou ideação suicida através de métricas diárias.
- **Otimização de Treino:** Ajustar cargas de treino baseadas na prontidão física e mental (Readiness).
- **Acompanhamento de Tratamento:** Registrar e monitorar sessões de Spravato e seus efeitos na neuroplasticidade e humor.

---

## 2. Estrutura Tecnológica

O projeto utiliza uma arquitetura moderna dividida em:
1.  **Frontend (React/Vite):** Interface do usuário responsiva e interativa.
2.  **Backend (Python/FastAPI):** Lógica de negócios avançada e processamento de dados (atualmente servindo como referência lógica, com potencial para expansão).
3.  **Banco de Dados (Supabase/PostgreSQL):** Armazenamento seguro, autenticação e regras de acesso (RLS).

### Estrutura de Diretórios
```
synthonia2/
├── backend/                 # Backend Python (FastAPI)
│   ├── app/
│   │   └── modules/         # Lógica de negócio modularizada
│   │       ├── home.py      # Resumo e alertas do dashboard
│   │       ├── spravato.py  # Gestão de sessões de esketamina
│   │       ├── training.py  # Lógica de treino e carga
│   │       └── tests.py     # Avaliações clínicas
│   └── main.py              # Ponto de entrada da API
│
├── src/                     # Frontend React
│   ├── components/          # Componentes reutilizáveis (UI, Auth, Charts)
│   ├── modules/             # Funcionalidades principais
│   │   ├── home/            # Dashboard do Paciente
│   │   ├── training/        # Registro de Treino
│   │   ├── spravato/        # Registro de Spravato
│   │   └── evaluation/      # Testes e Avaliações
│   ├── lib/                 # Configuração do Supabase e utilitários
│   └── pages/               # Roteamento de páginas
│
└── supabase/                # Definições de Banco de Dados
    └── full_schema.sql      # Schema completo (Tabelas, RLS, Triggers)
```

---

## 3. Módulos do Sistema

### 3.1. Dashboard Integrativo (`src/modules/home`)
O coração do sistema. Exibe um resumo diário para o paciente.
- **Funcionalidades:**
    - Botões de Ação Rápida: Registro de Treino, Sessão Spravato, Testes.
    - **Histórico de Prontidão:** Visualização da pontuação de prontidão (Readiness) para treino.
    - **Alertas de Segurança:** Avisos automáticos de Risco de Mania ou Suicídio baseados em inputs recentes.

### 3.2. Módulo de Treinamento (`src/modules/training`)
Focado em periodização e registro de exercícios.
- **Inputs:** Duração, RPE (Percepção Subjetiva de Esforço), Lista de Exercícios (Nome, Sets, Reps, Carga).
- **Lógica:** Calcula a carga interna da sessão (Duração x RPE) para monitorar TSB (Training Stress Balance).

### 3.3. Módulo Spravato (`src/modules/spravato`)
Específico para pacientes em tratamento com Esketamina intranasal.
- **Inputs:** Dose (mg), Pressão Arterial (Pré/Pós), Nível de Dissociação, Náusea, Qualidade da "Viagem" (Trip), Insights.
- **Propósito:** Monitorar segurança (PA) e eficácia subjetiva do tratamento.

### 3.4. Avaliação e Testes (`src/modules/evaluation`)
Testes físicos e clínicos.
- **Exemplo Implementado:** Teste de Salto Vertical para avaliar fadiga neuromuscular.
- **Lógica:** Compara o salto atual com a linha de base (ex: 40cm) para recomendar aumento ou redução de carga de treino (+10% / -10%).

---

## 4. Banco de Dados (Supabase)

O esquema (`supabase/full_schema.sql`) é robusto e utiliza Row Level Security (RLS) para proteção de dados.

### Tabelas Principais
1.  **`profiles`**: Dados cadastrais, tipo de usuário (subject, doctor, coach) e vínculos profissionais.
2.  **`daily_metrics_physical`**: Sono, fadiga, dor muscular, prontidão.
3.  **`daily_metrics_mental`**: Humor, ansiedade, energia, risco de mania/suicídio.
4.  **`training_sessions`**: Logs de treinos realizados (armazenados como JSONB para flexibilidade).
5.  **`spravato_sessions`**: Logs detalhados das sessões de tratamento.

### Segurança
- **RLS (Row Level Security):**
    - Pacientes só veem e editam seus próprios dados.
    - Médicos/Treinadores só veem dados de pacientes vinculados a eles (`is_professional_linked`).

---

## 5. Código Backend (Python)

O backend em Python (`backend/`) foi desenhado para processamento pesado e lógica clínica complexa, servindo como uma API REST.

### Exemplo de Lógica (`backend/app/modules/home.py`)
```python
def get_daily_summary(user: UserProfile, mental_score: int, physical_readiness: int):
    # Detecção de Risco de Mania
    if mental_score > 80:
        alerts.append("Risco Elevado de Mania Detectado")
    
    # Recomendação de Treino
    if physical_readiness > 8:
        recommendations.append("Alta prontidão! Dia para carga alta.")
    elif physical_readiness < 4:
        recommendations.append("Corpo fadigado. Descanse.")
```

---

## 6. Como Executar

### Frontend
```bash
npm install
npm run dev  # Desenvolvimento local
npm run build # Build para produção
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 7. Notas Finais
Este projeto representa um MVP funcional e seguro, pronto para escalar. A separação clara entre módulos de saúde mental e física, unificados no banco de dados, permite análises longitudinais ricas para medicina de precisão em psiquiatria esportiva.
