import streamlit as st
import time

st.set_page_config(
    page_title="Synthonia",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Sidebar Navigation
with st.sidebar:
    st.title("Synthonia 🧠")
    st.caption("Monitoramento Integrativo")
    
    st.write(f"Bem-vindo, **Paciente**") # Placeholder for user name
    
    st.markdown("---")
    
    if st.button("📊 Dashboard", use_container_width=True):
        st.switch_page("main.py")
        
    if st.button("📝 Check-in Diário", use_container_width=True):
        st.switch_page("pages/1_Checkin.py")
        
    if st.button("🏋️ Treino", use_container_width=True):
        st.switch_page("pages/2_Treino.py")
        
    if st.button("💊 Spravato", use_container_width=True):
        st.switch_page("pages/3_Spravato.py")
        
    if st.button("📋 Questionários", use_container_width=True):
        st.switch_page("pages/4_Questionarios.py")
        
    st.markdown("---")
    
    if st.button("🚪 Sair", use_container_width=True):
        # Clear session state logic here
        st.session_state.clear()
        st.rerun()

st.title("Synthonia 🧠")
st.subheader("Monitoramento Integrativo de Saúde Mental e Performance")

st.markdown("""
### Bem-vindo ao Synthonia

Esta plataforma integra dados de:
- **Saúde Mental** (Humor, Energia, Riscos)
- **Performance Física** (Treino, Prontidão)
- **Tratamentos** (Spravato/Esketamina)

Use o menu lateral para navegar entre os módulos.
""")

# Simulação de Status do Sistema
with st.status("Verificando sistemas...", expanded=True):
    st.write("Conectando ao banco de dados Supabase...")
    time.sleep(1)
    st.write("Carregando módulos de IA...")
    time.sleep(1)
    st.write("Sistema Operacional: **Online**")

st.success("Ambiente Python-First Configurado com Sucesso! 🚀")

st.info("👈 Faça login ou navegue pelo menu lateral para começar.")
