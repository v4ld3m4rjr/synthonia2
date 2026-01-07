import streamlit as st
import datetime

st.set_page_config(page_title="Check-in | Synthonia", page_icon="📝", layout="centered")

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
    div.stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2);
        background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%);
    }
</style>
""", unsafe_allow_html=True)

st.title("📝 Check-in Diário Completo")
st.markdown("Monitoramento detalhado de saúde e bem-estar.")

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
    
    st.subheader("3. Hábitos & Rotina")
    col5, col6 = st.columns(2)
    with col5:
        medicacao = st.radio("Tomou as medicações?", ["Sim", "Não", "Parcialmente"], horizontal=True)
    with col6:
        alimentacao = st.select_slider("Qualidade da Alimentação", options=["Péssima", "Desregrada", "Normal", "Saudável", "Impecável"], value="Normal")

    st.subheader("4. Contexto")
    sintomas = st.multiselect("Sintomas Físicos/Mentais", 
        ["Dor de Cabeça", "Tensão Muscular", "Fadiga", "Foco Alto", "Névoa Mental", "Compulsão Alimentar", "Libido Baixa", "Libido Alta"])
    
    estressores = st.multiselect("Fatores de Estresse",
        ["Trabalho", "Família", "Finanças", "Relacionamento", "Saúde", "Trânsito/Deslocamento"])

    st.subheader("5. Diário")
    gratidao = st.text_input("Uma coisa pela qual sou grato hoje:")
    notas = st.text_area("Notas gerais, insights ou observações:")

    submitted = st.form_submit_button("💾 Salvar Check-in", type="primary", use_container_width=True)

    if submitted:
        # Lógica de salvamento futura
        st.success("Check-in registrado com sucesso!")
        st.balloons()
        st.write(f"**Resumo:** Humor {humor} | Energia {energia} | Sono {sono_horas}h ({sono_qualidade})")
