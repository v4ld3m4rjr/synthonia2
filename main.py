import streamlit as st
import time

# Configuração da Página
st.set_page_config(
    page_title="Synthonia",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="collapsed", # Começar colapsado para foco no dashboard
)

# Custom CSS para Visual Fotográfico e Moderno
st.markdown("""
<style>
    /* Remover padding padrão excessivo */
    .block-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
    
    /* Background Image com Overlay Escuro */
    [data-testid="stAppViewContainer"] {
        background-image: linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95)), 
                          url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop");
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
    }
    
    /* Estilo dos Cards (Botões Dinâmicos) */
    .dashboard-card {
        background-color: rgba(30, 41, 59, 0.7);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 15px;
        padding: 20px;
        text-align: center;
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        cursor: pointer;
        height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(10px);
    }
    
    .dashboard-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        border-color: #0ea5e9;
    }
    
    .card-icon {
        font-size: 3rem;
        margin-bottom: 10px;
    }
    
    .card-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: #f8fafc;
        margin-bottom: 5px;
    }
    
    .card-desc {
        font-size: 0.9rem;
        color: #94a3b8;
    }
    
    /* Títulos e Textos */
    h1, h2, h3 {
        color: #f8fafc !important;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    
    /* Sidebar Transparente */
    [data-testid="stSidebar"] {
        background-color: rgba(15, 23, 42, 0.9);
        border-right: 1px solid rgba(148, 163, 184, 0.1);
    }
</style>
""", unsafe_allow_html=True)

# --- Header / Hero Section ---
col1, col2 = st.columns([1, 4])

with col1:
    # Logo ou Ícone Grande
    st.markdown("<div style='font-size: 4rem; text-align: center;'>🧠</div>", unsafe_allow_html=True)

with col2:
    st.title("Synthonia")
    st.markdown("### Plataforma de Monitoramento Integrativo")
    st.markdown("Otimizando **Mente**, **Corpo** e **Performance** através de dados.")

st.markdown("---")

# --- Dashboard Grid (Botões Dinâmicos) ---

st.subheader("Acesso Rápido")

col_a, col_b, col_c, col_d = st.columns(4)

# Helper function to create card HTML (Visual Only - Click handled by st.page_link below)
def card_html(icon, title, desc):
    return f"""
    <div class="dashboard-card">
        <div class="card-icon">{icon}</div>
        <div class="card-title">{title}</div>
        <div class="card-desc">{desc}</div>
    </div>
    """

# Note: Streamlit buttons cannot wrap HTML easily. 
# We will use st.page_link for native navigation which is cleaner and faster.
# To make them look like cards, we can use a container with a border.

with col_a:
    with st.container(border=True):
        st.markdown("## 📝")
        st.markdown("**Check-in Diário**")
        st.caption("Registre humor, energia e sono.")
        st.page_link("pages/1_Checkin.py", label="Acessar Check-in", icon="👉", use_container_width=True)

with col_b:
    with st.container(border=True):
        st.markdown("## 💪")
        st.markdown("**Treino & Físico**")
        st.caption("Log de treinos e prontidão física.")
        st.page_link("pages/2_Treino.py", label="Acessar Treinos", icon="👉", use_container_width=True)

with col_c:
    with st.container(border=True):
        st.markdown("## 💊")
        st.markdown("**Tratamento Spravato**")
        st.caption("Sessões, dosagem e efeitos.")
        st.page_link("pages/3_Spravato.py", label="Acessar Spravato", icon="👉", use_container_width=True)

with col_d:
    with st.container(border=True):
        st.markdown("## 📋")
        st.markdown("**Questionários**")
        st.caption("Avaliações clínicas periódicas.")
        st.page_link("pages/4_Questionarios.py", label="Acessar Questionários", icon="👉", use_container_width=True)

# --- Status & Metrics Overview (Simulado) ---
st.markdown("---")
st.subheader("Resumo do Dia")

m1, m2, m3, m4 = st.columns(4)

with m1:
    st.metric(label="Humor Médio", value="7.5", delta="+0.5")
with m2:
    st.metric(label="Prontidão Física", value="85%", delta="Alta")
with m3:
    st.metric(label="Próxima Sessão", value="Amanhã", delta="14:00")
with m4:
    st.metric(label="Peso Atual", value="82.5 kg", delta="-0.5 kg")

# --- Footer ---
st.markdown("<br><br><br>", unsafe_allow_html=True)
st.caption("© 2026 Synthonia System v2.0 | Powered by Streamlit & Python")

# Sidebar
with st.sidebar:
    st.header("Menu Principal")
    st.write("Navegue pelos módulos usando o dashboard ou este menu.")
    if st.button("Logout", icon="🚪"):
        st.session_state.clear()
        st.rerun()
