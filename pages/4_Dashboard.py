import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime

st.set_page_config(page_title="Dashboard | Synthonia", page_icon="📈", layout="wide")

# --- CUSTOM CSS ---
st.markdown("""
<style>
    div.stButton > button {
        background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
        color: white;
        border: none;
        padding: 10px 24px;
        border-radius: 12px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
</style>
""", unsafe_allow_html=True)

st.title("📈 Dashboard Clínico Integrado")
st.markdown("Visualização longitudinal de questionários e escalas.")

# --- MOCK DATA ---
@st.cache_data
def get_data():
    dates = pd.date_range(start="2024-01-01", end=datetime.today(), freq="W")
    data = {
        "Data": dates,
        "PHQ-9 (Depressão)": np.random.randint(0, 27, size=len(dates)),
        "GAD-7 (Ansiedade)": np.random.randint(0, 21, size=len(dates)),
        "ASRM (Mania)": np.random.randint(0, 15, size=len(dates)),
        "Qualidade de Vida (0-100)": np.random.randint(40, 90, size=len(dates)),
        "Dissociação (Spravato)": np.random.randint(0, 10, size=len(dates))
    }
    # Apply smoothing/trend
    trend = np.linspace(10, 0, len(dates))
    data["PHQ-9 (Depressão)"] = [max(0, int(x - t/2)) for x, t in zip(data["PHQ-9 (Depressão)"], trend)]
    
    return pd.DataFrame(data).set_index("Data")

df = get_data()

# --- SIDEBAR ---
with st.sidebar:
    st.header("Visualização")
    selected_vars = st.multiselect(
        "Selecionar Métricas", 
        df.columns.tolist(),
        default=["PHQ-9 (Depressão)", "Qualidade de Vida (0-100)"]
    )

# --- CHART ---
st.subheader("Evolução Temporal (Smooth Lines)")

if selected_vars:
    # Plotly with Spline (Smooth) interpolation
    fig = px.line(df, y=selected_vars, markers=True, template="plotly_dark")
    fig.update_traces(line_shape='spline', mode='lines+markers') # BEZIER/SPLINE CURVES
    fig.update_layout(height=500, xaxis_title="Data", yaxis_title="Score")
    
    st.plotly_chart(fig, use_container_width=True)
else:
    st.info("Selecione variáveis no menu lateral.")

# --- KPIS ---
st.markdown("---")
col1, col2, col3 = st.columns(3)
last = df.iloc[-1]
prev = df.iloc[-2]

col1.metric("Depressão (PHQ-9)", f"{last['PHQ-9 (Depressão)']}", f"{last['PHQ-9 (Depressão)'] - prev['PHQ-9 (Depressão)']}", delta_color="inverse")
col2.metric("Qualidade de Vida", f"{last['Qualidade de Vida (0-100)']}", f"{last['Qualidade de Vida (0-100)'] - prev['Qualidade de Vida (0-100)']}")
col3.metric("Dissociação (Média)", f"{last['Dissociação (Spravato)']}", "Estável")
