import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime, date

st.set_page_config(page_title="Dashboard | Synthonia", page_icon="📈", layout="wide")

BG_URL = "https://raw.githubusercontent.com/v4ld3m4rjr/synthonia2/main/download%20(30).png"

# --- CUSTOM CSS ---
st.markdown(f"""
<style>
    /* Hide Streamlit Toolbar */
    [data-testid="stToolbar"] {{visibility: hidden;}}
    footer {{visibility: hidden;}}
    
    /* Background */
    [data-testid="stAppViewContainer"] {{
        background-image: linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), 
                          url("{BG_URL}");
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
    }}

    div.stButton > button {{
        background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
        color: white;
        border: none;
        padding: 10px 24px;
        border-radius: 12px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }}
</style>
""", unsafe_allow_html=True)

st.title("📈 Dashboard Clínico Integrado")
st.markdown("Visualização longitudinal de questionários e escalas.")

# --- MOCK DATA ---
@st.cache_data
def get_data():
    # Fix: Ensure no 2025 data if it's considered "incorrect" or "future" by user context.
    # Assuming user wants 2026 onwards or simply "current valid data".
    # We will generate data from Jan 1st 2026 to Today.
    start_date = "2026-01-01" 
    dates = pd.date_range(start=start_date, end=datetime.today(), freq="D") # Changed to Daily for more resolution
    
    data = {
        "Data": dates,
        "PHQ-9 (Depressão)": np.random.randint(0, 27, size=len(dates)),
        "GAD-7 (Ansiedade)": np.random.randint(0, 21, size=len(dates)),
        "ASRM (Mania)": np.random.randint(0, 15, size=len(dates)),
        "Qualidade de Vida (0-100)": np.random.randint(40, 90, size=len(dates)),
        "Dissociação (Spravato)": np.random.randint(0, 10, size=len(dates)),
        # Restore Daily Metrics (Prontidão, Estresse)
        "Prontidão Física (0-10)": np.random.randint(3, 10, size=len(dates)),
        "Estresse (0-10)": np.random.randint(1, 9, size=len(dates))
    }
    # Apply smoothing/trend
    trend = np.linspace(10, 0, len(dates))
    data["PHQ-9 (Depressão)"] = [max(0, int(x - t/2)) for x, t in zip(data["PHQ-9 (Depressão)"], trend)]
    
    df = pd.DataFrame(data)
    
    # Validação Adicional: Remover dados futuros (caso datetime.today inclua hora e gere bug)
    df = df[df["Data"] <= pd.Timestamp.now()]
    
    return df.set_index("Data")

df = get_data()

# --- SIDEBAR & FILTERS ---
with st.sidebar:
    st.image(LOGO_URL, width=77)
    st.write("---")
    st.header("Visualização")
    
    # Date Filter
    min_date = df.index.min().date()
    max_date = df.index.max().date()
    
    try:
        date_range = st.date_input("Período", [min_date, max_date], min_value=min_date, max_value=max_date)
    except:
        date_range = [min_date, max_date]
        
    selected_vars = st.multiselect(
        "Selecionar Métricas", 
        df.columns.tolist(),
        default=["PHQ-9 (Depressão)", "Qualidade de Vida (0-100)", "Prontidão Física (0-10)"]
    )
    
    st.download_button("📥 Exportar Dados (CSV)", df.to_csv(), "synthonia_data.csv", "text/csv")

# Filter Data based on Date Input
if len(date_range) == 2:
    mask = (df.index.date >= date_range[0]) & (df.index.date <= date_range[1])
    df_filtered = df.loc[mask]
else:
    df_filtered = df

# --- CHART ---
st.subheader("Evolução Temporal (Smooth Lines)")

if selected_vars:
    # Plotly with Spline (Smooth) interpolation & Interactive Features
    fig = px.line(df_filtered, y=selected_vars, markers=True, template="plotly_dark")
    
    fig.update_traces(
        line_shape='spline', 
        mode='lines+markers',
        hovertemplate='%{y:.1f} (Data: %{x})' # Tooltip detalhado
    ) 
    
    fig.update_layout(
        height=500, 
        xaxis_title="Data", 
        yaxis_title="Score",
        hovermode="x unified", # Tooltip unificado
        xaxis=dict(
            rangeslider=dict(visible=True), # Zoom slider
            type="date"
        )
    )
    
    st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': True, 'scrollZoom': True})
else:
    st.info("Selecione variáveis no menu lateral.")

# --- KPIS ---
st.markdown("---")
col1, col2, col3, col4 = st.columns(4)

def get_metric(col, label, key, inverse=False):
    if key in df_filtered.columns:
        last = df_filtered[key].iloc[-1]
        prev = df_filtered[key].iloc[-2] if len(df_filtered) > 1 else last
        delta = last - prev
        if inverse: delta = -delta
        col.metric(label, f"{last:.1f}", f"{delta:.1f}", delta_color="inverse" if inverse else "normal")

get_metric(col1, "Depressão (PHQ-9)", "PHQ-9 (Depressão)", inverse=True)
get_metric(col2, "Qualidade de Vida", "Qualidade de Vida (0-100)")
get_metric(col3, "Prontidão Física", "Prontidão Física (0-10)")
get_metric(col4, "Estresse", "Estresse (0-10)", inverse=True)
