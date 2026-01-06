import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta

st.set_page_config(page_title="Dashboard Clínico | Synthonia", page_icon="📈", layout="wide")

st.title("📈 Dashboard Clínico Integrado")
st.markdown("Visualização longitudinal de todas as variáveis monitoradas.")

# --- SIMULAÇÃO DE DADOS (MOCK DATA) ---
# Como não temos banco de dados persistente ainda, vamos gerar dados para visualização
@st.cache_data
def get_mock_data():
    dates = pd.date_range(start="2024-01-01", end=datetime.today(), freq="W")
    
    data = {
        "Data": dates,
        # Humor & Energia
        "Humor (0-10)": np.random.randint(3, 9, size=len(dates)),
        "Energia (0-10)": np.random.randint(4, 10, size=len(dates)),
        "Ansiedade (0-10)": np.random.randint(1, 6, size=len(dates)),
        
        # Escalas Clínicas
        "PHQ-9 (Depressão)": np.random.randint(5, 20, size=len(dates)),
        "GAD-7 (Ansiedade)": np.random.randint(3, 15, size=len(dates)),
        "ASRM (Mania)": np.random.randint(0, 8, size=len(dates)),
        "OCI-R (TOC)": np.random.randint(0, 15, size=len(dates)),
        
        # Spravato
        "Dissociação (CADSS-6)": np.random.randint(0, 15, size=len(dates)),
        "PA Sistólica": np.random.randint(110, 140, size=len(dates)),
        "PA Diastólica": np.random.randint(70, 90, size=len(dates)),
        
        # Funcionalidade & QoL
        "Qualidade de Vida (1-5)": np.random.uniform(2.5, 4.8, size=len(dates)),
        "Funcionalidade (FAST)": np.random.randint(5, 40, size=len(dates)),
    }
    
    # Adicionar tendência de melhora (simulando tratamento eficaz)
    # Diminuir depressão ao longo do tempo
    trend = np.linspace(5, 0, len(dates))
    data["PHQ-9 (Depressão)"] = [max(0, int(x - t)) for x, t in zip(data["PHQ-9 (Depressão)"], trend)]
    
    return pd.DataFrame(data).set_index("Data")

df = get_mock_data()

# --- SIDEBAR DE CONFIGURAÇÃO ---
with st.sidebar:
    st.header("⚙️ Configurar Visualização")
    st.info("Selecione as variáveis que deseja cruzar no gráfico.")
    
    all_vars = list(df.columns)
    selected_vars = st.multiselect(
        "Variáveis para o Gráfico", 
        options=all_vars,
        default=["Humor (0-10)", "PHQ-9 (Depressão)", "Qualidade de Vida (1-5)"]
    )
    
    st.markdown("---")
    st.caption("Filtro de Período")
    periodo = st.select_slider("Janela de Tempo", options=["1 Mês", "3 Meses", "6 Meses", "Tudo"], value="Tudo")

# --- FILTRAGEM DE DADOS ---
if periodo == "1 Mês":
    df_filtered = df.last("30D")
elif periodo == "3 Meses":
    df_filtered = df.last("90D")
elif periodo == "6 Meses":
    df_filtered = df.last("180D")
else:
    df_filtered = df

# --- DASHBOARD ---

# 1. Gráfico Principal
st.subheader("Evolução Temporal")
if selected_vars:
    # Normalizar para visualização conjunta (Opcional, mas ajuda se escalas forem muito diferentes)
    normalize = st.checkbox("Normalizar escalas (0-100%) para comparação", value=False)
    
    chart_df = df_filtered[selected_vars].copy()
    
    if normalize:
        for col in chart_df.columns:
            max_val = chart_df[col].max()
            if max_val > 0:
                chart_df[col] = (chart_df[col] / max_val) * 100
                
    fig = px.line(chart_df, markers=True, title="Cruzamento de Variáveis Clínicas")
    fig.update_layout(height=500, xaxis_title="Data", yaxis_title="Score / Valor", template="plotly_dark")
    st.plotly_chart(fig, use_container_width=True)
else:
    st.warning("Selecione pelo menos uma variável na barra lateral.")

# 2. Métricas de Resumo (KPIs)
st.subheader("Indicadores Chave (Último Registro)")
kpi1, kpi2, kpi3, kpi4 = st.columns(4)

last_row = df.iloc[-1]
prev_row = df.iloc[-2] if len(df) > 1 else last_row

def display_kpi(col, label, key, inverse=False):
    val = last_row[key]
    delta = val - prev_row[key]
    if inverse: delta = -delta # Para escalas onde "menos é melhor" (ex: Depressão)
    
    col.metric(label, f"{val:.1f}", f"{delta:.1f}")

display_kpi(kpi1, "Depressão (PHQ-9)", "PHQ-9 (Depressão)", inverse=True)
display_kpi(kpi2, "Ansiedade (GAD-7)", "GAD-7 (Ansiedade)", inverse=True)
display_kpi(kpi3, "Qualidade de Vida", "Qualidade de Vida (1-5)")
display_kpi(kpi4, "Humor Atual", "Humor (0-10)")

# 3. Análise de Correlação
with st.expander("🔬 Análise de Correlação (Heatmap)"):
    st.markdown("Identifique quais variáveis estão caminhando juntas (ex: Humor sobe quando Ansiedade desce).")
    corr = df_filtered.corr()
    fig_corr = px.imshow(corr, text_auto=True, color_continuous_scale="RdBu_r", aspect="auto")
    st.plotly_chart(fig_corr, use_container_width=True)

# 4. Tabela de Dados Brutos
with st.expander("📄 Ver Dados Brutos"):
    st.dataframe(df_filtered.sort_index(ascending=False), use_container_width=True)
