import streamlit as st
import os

# Configuração da Página
st.set_page_config(
    page_title="Synthonia",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="collapsed", 
)

# --- CUSTOM CSS ---
st.markdown("""
<style>
    /* Remover padding padrão */
    .block-container { padding-top: 2rem; padding-bottom: 2rem; }
    
    /* Background */
    [data-testid="stAppViewContainer"] {
        background-image: linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95)), 
                          url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop");
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
    }
    
    /* Botões */
    div.stButton > button {
        background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
        color: white;
        border: none;
        padding: 10px 24px;
        border-radius: 12px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 100%;
    }
    div.stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2);
        background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%);
    }
    
    /* Logo Container */
    .logo-container {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }
    
    /* Titles */
    h1, h2, h3 { color: #f8fafc !important; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
    
    /* Sidebar */
    [data-testid="stSidebar"] {
        background-color: rgba(15, 23, 42, 0.9);
        border-right: 1px solid rgba(148, 163, 184, 0.1);
    }
</style>
""", unsafe_allow_html=True)

# --- HEADER ---
col1, col2 = st.columns([1, 4])
with col1:
    # Logo Logic: Tries to find assets/logo.png
    if os.path.exists("assets/logo.png"):
        st.image("assets/logo.png", width=120)
    else:
        # Fallback if image not found
        st.markdown("<div style='font-size: 4rem; text-align: center;'>🧠</div>", unsafe_allow_html=True)
        
with col2:
    st.title("Synthonia")
    st.markdown("### Monitoramento Integrativo & Diário")

st.markdown("---")

# --- NAVIGATION GRID ---
st.subheader("Módulos Principais")

c1, c2, c3, c4 = st.columns(4)

with c1:
    with st.container(border=True):
        st.markdown("## 📖")
        st.markdown("**Diário Pessoal**")
        st.caption("Registre suas experiências e memórias.")
        st.page_link("pages/1_Diario.py", label="Abrir Diário", icon="👉", use_container_width=True)

with c2:
    with st.container(border=True):
        st.markdown("## 📋")
        st.markdown("**Questionários**") # Label mantido como solicitado
        st.caption("Semanal, Mensal e Trimestral.")
        st.page_link("pages/2_Questionarios.py", label="Questionários", icon="👉", use_container_width=True)

with c3:
    with st.container(border=True):
        st.markdown("## 💊")
        st.markdown("**Spravato**")
        st.caption("Sessões e fenomenologia.")
        st.page_link("pages/3_Spravato.py", label="Acessar Módulo", icon="👉", use_container_width=True)

with c4:
    with st.container(border=True):
        st.markdown("## 📈")
        st.markdown("**Dashboard**")
        st.caption("Análise de dados integrados.")
        st.page_link("pages/4_Dashboard.py", label="Ver Gráficos", icon="👉", use_container_width=True)

# --- FOOTER ---
st.markdown("<br><br>", unsafe_allow_html=True)
st.caption("© 2026 Synthonia v3.0")

# --- SIDEBAR ---
with st.sidebar:
    if os.path.exists("assets/logo.png"):
        # Centralized sidebar logo
        st.markdown('<div class="logo-container">', unsafe_allow_html=True)
        st.image("assets/logo.png", width=150)
        st.markdown('</div>', unsafe_allow_html=True)
        
    st.write("---")
    if st.button("Sair", icon="🚪"):
        st.session_state.clear()
        st.rerun()
