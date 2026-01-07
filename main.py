import streamlit as st
import os
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime, timedelta

# Configuração da Página
st.set_page_config(
    page_title="Synthonia",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="collapsed", 
)

# URLs dos Assets (Github Raw)
LOGO_URL = "https://raw.githubusercontent.com/v4ld3m4rjr/synthonia2/main/BAIXA_RESOLUCAO_ICONE_VALDEMARJR_COR_FUNDOTRANSPARENTE.png"
BG_URL = "https://raw.githubusercontent.com/v4ld3m4rjr/synthonia2/main/download%20(30).png"

# --- CUSTOM CSS ---
st.markdown(f"""
<style>
    /* Hide Streamlit Toolbar (Menu Superior Direito) */
    [data-testid="stToolbar"] {{visibility: hidden;}}
    footer {{visibility: hidden;}}
    
    /* Remover padding padrão */
    .block-container {{ padding-top: 2rem; padding-bottom: 2rem; }}
    
    /* Background */
    [data-testid="stAppViewContainer"] {{
        background-image: linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), 
                          url("{BG_URL}");
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
    }}
    
    /* Botões */
    div.stButton > button {{
        background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
        color: white;
        border: 1px solid #FFFFFF;
        padding: 10px 24px;
        border-radius: 25px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 100%;
        font-weight: 600;
    }}
    div.stButton > button:hover {{
        transform: translateY(-2px);
        box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2);
        background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%);
        border-color: #f8fafc;
    }}
    
    /* Logo Container */
    .logo-container {{
        display: flex;
        justify-content: flex-start; /* Alinhado a esquerda */
        margin-bottom: 20px;
    }}
    
    /* Titles */
    h1, h2, h3 {{ color: #f8fafc !important; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }}
    
    /* Sidebar */
    [data-testid="stSidebar"] {{
        background-color: rgba(15, 23, 42, 0.9);
        border-right: 1px solid rgba(148, 163, 184, 0.1);
    }}
    
    /* Sidebar Logo Responsiveness */
    [data-testid="stSidebar"] img {{
        max-width: 100%;
        height: auto;
    }}
    
    /* Mobile/Tablet Adjustments */
    @media (max-width: 768px) {{
        .logo-container img {{
            width: 50px !important;
        }}
    }}
</style>
""", unsafe_allow_html=True)

# --- SESSION STATE INITIALIZATION ---
if 'logged_in' not in st.session_state:
    st.session_state.logged_in = False
if 'role' not in st.session_state:
    st.session_state.role = None
if 'user_name' not in st.session_state:
    st.session_state.user_name = None

# --- SIDEBAR (GLOBAL) ---
# Remove dividers and place logo first
with st.sidebar:
    st.markdown('<div class="logo-container">', unsafe_allow_html=True)
    st.image(LOGO_URL, width=77)
    st.markdown('</div>', unsafe_allow_html=True)
    
    if st.session_state.logged_in:
        if st.button("Sair", icon="🚪"):
            st.session_state.logged_in = False
            st.session_state.role = None
            st.session_state.user_name = None
            st.rerun()

# --- LOGIN SCREEN ---
def login_screen():
    st.title("Synthonia")
    st.markdown("### Acesso ao Sistema")
    
    tab1, tab2 = st.tabs(["Sou Paciente", "Sou Médico"])
    
    with tab1:
        with st.form("login_paciente"):
            st.write("Selecione seu médico responsável:")
            medicos = ["Selecione...", "Dr. Silva (Psiquiatra)", "Dra. Santos (Neurologista)", "Dr. Oliveira (Terapeuta)"]
            medico_selecionado = st.selectbox("Médico", medicos)
            
            nome_paciente = st.text_input("Seu Nome")
            
            submit_paciente = st.form_submit_button("Entrar como Paciente", use_container_width=True)
            
            if submit_paciente:
                if medico_selecionado == "Selecione...":
                    st.error("⚠️ Você deve selecionar um médico responsável para continuar.")
                elif not nome_paciente:
                    st.error("⚠️ Por favor, insira seu nome.")
                else:
                    st.session_state.logged_in = True
                    st.session_state.role = "patient"
                    st.session_state.user_name = nome_paciente
                    st.session_state.medico = medico_selecionado
                    st.success("Login realizado com sucesso!")
                    st.rerun()
                    
    with tab2:
        with st.form("login_medico"):
            st.write("Acesso Profissional")
            crm = st.text_input("CRM / Registro Profissional")
            senha = st.text_input("Senha", type="password")
            
            submit_medico = st.form_submit_button("Acessar Dashboard Médico", use_container_width=True)
            
            if submit_medico:
                if crm and senha == "admin": # Mock password
                    st.session_state.logged_in = True
                    st.session_state.role = "doctor"
                    st.session_state.user_name = f"Dr(a). {crm}"
                    st.success("Acesso autorizado!")
                    st.rerun()
                else:
                    st.error("Credenciais inválidas (Dica: senha 'admin')")

# --- PATIENT HOME ---
def patient_home():
    col1, col2 = st.columns([1, 4])
    with col1:
        # Logo already in sidebar, but kept here for header style if needed, or remove.
        # Keeping consistent with previous design but maybe smaller
        pass 
            
    with col2:
        st.title(f"Olá, {st.session_state.user_name}")
        st.markdown(f"**Médico Responsável:** {st.session_state.get('medico', 'N/A')}")
        st.markdown("### Monitoramento Integrativo & Diário")

    st.markdown("---")

    # --- NAVIGATION GRID ---
    st.subheader("Módulos Principais")

    c1, c2, c3, c4, c5 = st.columns(5)

    with c1:
        with st.container(border=True):
            st.markdown("## ✅")
            st.markdown("**Check-in**")
            st.caption("Métricas diárias rápidas.")
            st.page_link("pages/1_Checkin.py", label="Registrar", icon="👉", use_container_width=True)

    with c2:
        with st.container(border=True):
            st.markdown("## 📖")
            st.markdown("**Diário**")
            st.caption("Notas e memórias.")
            st.page_link("pages/1_Diario.py", label="Abrir Diário", icon="👉", use_container_width=True)

    with c3:
        with st.container(border=True):
            st.markdown("## 📋")
            st.markdown("**Questionários**")
            st.caption("Avaliações periódicas.")
            st.page_link("pages/2_Questionarios.py", label="Avaliar", icon="👉", use_container_width=True)

    with c4:
        with st.container(border=True):
            st.markdown("## 💊")
            st.markdown("**Spravato**")
            st.caption("Sessões e efeitos.")
            st.page_link("pages/3_Spravato.py", label="Acessar", icon="👉", use_container_width=True)

    with c5:
        with st.container(border=True):
            st.markdown("## 📈")
            st.markdown("**Dashboard**")
            st.caption("Análise de dados.")
            st.page_link("pages/4_Dashboard.py", label="Visualizar", icon="👉", use_container_width=True)

# --- DOCTOR DASHBOARD ---
def doctor_dashboard():
    st.title("🩺 Painel Médico")
    st.markdown(f"Bem-vindo, {st.session_state.user_name}")
    
    # --- FILTERS ---
    with st.expander("Filtros de Pacientes e Variáveis", expanded=True):
        c1, c2, c3 = st.columns(3)
        with c1:
            paciente = st.selectbox("Selecione o Paciente", ["João Silva", "Maria Oliveira", "Carlos Santos", "Ana Pereira"])
        with c2:
            periodo = st.select_slider("Período de Análise", options=["7 dias", "14 dias", "21 dias", "28 dias"], value="7 dias")
        with c3:
            metricas = st.multiselect("Variáveis Clínicas", 
                                      ["Humor", "Ansiedade", "Sono", "Adesão Medicamentosa", "Ideação Suicida"],
                                      default=["Humor", "Ansiedade"])
            
    # --- MOCK DATA GENERATION ---
    days_map = {"7 dias": 7, "14 dias": 14, "21 dias": 21, "28 dias": 28}
    days = days_map[periodo]
    dates = pd.date_range(end=datetime.today(), periods=days)
    
    data = pd.DataFrame({
        "Data": dates,
        "Humor": np.random.randint(3, 9, size=days),
        "Ansiedade": np.random.randint(1, 8, size=days),
        "Sono": np.random.randint(4, 10, size=days),
        "Ideação Suicida": np.random.randint(0, 2, size=days)
    })
    
    # --- CHARTS ---
    st.subheader(f"Evolução Clínica: {paciente}")
    
    if metricas:
        fig = px.line(data, x="Data", y=metricas, markers=True, template="plotly_dark", title=f"Últimos {days} dias")
        fig.update_traces(line_shape='spline', mode='lines+markers')
        fig.update_layout(xaxis_title="Data", yaxis_title="Score / Nível")
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("Selecione variáveis para visualizar o gráfico.")
        
    # --- EXPORT ---
    st.download_button("📥 Exportar Prontuário (CSV)", data.to_csv(), f"prontuario_{paciente.lower().replace(' ', '_')}.csv", "text/csv")


# --- MAIN CONTROLLER ---
if not st.session_state.logged_in:
    login_screen()
else:
    if st.session_state.role == "patient":
        patient_home()
    elif st.session_state.role in ["doctor", "admin"]:
        doctor_dashboard()

# --- FOOTER ---
st.markdown("<br><br>", unsafe_allow_html=True)
st.caption("© 2026 Synthonia v3.2")
