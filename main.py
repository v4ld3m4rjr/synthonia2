import streamlit as st
import os

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
        justify-content: center;
        margin-bottom: 20px;
    }}
    
    /* Titles */
    h1, h2, h3 {{ color: #f8fafc !important; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }}
    
    /* Sidebar */
    [data-testid="stSidebar"] {{
        background-color: rgba(15, 23, 42, 0.9);
        border-right: 1px solid rgba(148, 163, 184, 0.1);
    }}
</style>
""", unsafe_allow_html=True)

# --- HEADER ---
col1, col2 = st.columns([1, 4])
with col1:
    st.image(LOGO_URL, width=120)
        
with col2:
    st.title("Synthonia")
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

# --- FOOTER ---
st.markdown("<br><br>", unsafe_allow_html=True)
st.caption("© 2026 Synthonia v3.2")

# --- SIDEBAR ---
with st.sidebar:
    st.markdown('<div class="logo-container">', unsafe_allow_html=True)
    st.image(LOGO_URL, width=77)
    st.markdown('</div>', unsafe_allow_html=True)
        
    st.write("---")
    if st.button("Sair", icon="🚪"):
        st.session_state.clear()
        st.rerun()
