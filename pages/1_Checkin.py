import streamlit as st
import datetime

st.set_page_config(page_title="Check-in | Synthonia", page_icon="📝", layout="centered")

# --- CUSTOM CSS ---
st.markdown("""
<style>
    /* Hide Streamlit Toolbar */
    [data-testid="stToolbar"] {visibility: hidden;}
    footer {visibility: hidden;}
    
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

st.title("📝 Check-in Diário")
st.markdown("Monitoramento de métricas diárias essenciais.")

with st.form("checkin_form_completo"):
    st.subheader("1. Estado Mental & Emocional")
    col1, col2 = st.columns(2)
    with col1:
        humor = st.slider("Humor Geral (0-10)", 0, 10, 5, help="0=Deprimido, 10=Eufórico")
        ansiedade = st.slider("Nível de Ansiedade (0-10)", 0, 10, 2, help="0=Nenhuma, 10=Pânico")
    with col2:
        energia = st.slider("Nível de Energia (0-10)", 0, 10, 5)
        irritabilidade = st.slider("Irritabilidade (0-10)", 0, 10, 1)

    st.subheader("2. Sono & Recuperação")
    col3, col4 = st.columns(2)
    with col3:
        sono_horas = st.number_input("Horas de Sono", 0.0, 24.0, 7.0, 0.5)
    with col4:
        sono_qualidade = st.select_slider("Qualidade do Sono", options=["Péssima", "Ruim", "Regular", "Boa", "Excelente"], value="Regular")
    
    st.subheader("3. Prontidão & Estresse")
    col5, col6 = st.columns(2)
    with col5:
        prontidao = st.slider("Prontidão Física (0-10)", 0, 10, 7, help="Capacidade para treinar/agir hoje")
    with col6:
        estresse = st.slider("Nível de Estresse (0-10)", 0, 10, 3)

    st.subheader("4. Hábitos & Rotina")
    col7, col8 = st.columns(2)
    with col7:
        medicacao = st.radio("Tomou as medicações?", ["Sim", "Não", "Parcialmente"], horizontal=True)
    with col8:
        alimentacao = st.select_slider("Qualidade da Alimentação", options=["Péssima", "Desregrada", "Normal", "Saudável", "Impecável"], value="Normal")

    submitted = st.form_submit_button("💾 Salvar Métricas Diárias", type="primary", use_container_width=True)

    if submitted:
        # Lógica de salvamento futura (JSON/DB)
        st.success("Métricas registradas com sucesso!")
        st.info(f"Resumo: Humor {humor} | Prontidão {prontidao} | Estresse {estresse}")
