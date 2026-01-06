import streamlit as st
import datetime

st.set_page_config(page_title="Spravato | Synthonia", page_icon="💊", layout="centered")

st.title("💊 Sessão de Spravato (Esketamina)")
st.markdown("Registro detalhado das sessões de tratamento.")

with st.form("spravato_form"):
    st.subheader("Dados da Sessão")
    col1, col2 = st.columns(2)
    
    with col1:
        data_sessao = st.date_input("Data da Sessão", datetime.date.today())
        dose = st.selectbox("Dosagem", ["56 mg (2 frascos)", "84 mg (3 frascos)"])
    
    with col2:
        pa_inicial = st.text_input("PA Inicial (ex: 120/80)")
        pa_final = st.text_input("PA Final (ex: 130/85)")

    st.subheader("Experiência (Fenomenologia)")
    dissociacao = st.slider("Intensidade da Dissociação (0-10)", 0, 10, 5, help="0=Normal, 10=Experiência fora do corpo total")
    relaxamento = st.slider("Nível de Relaxamento Profundo", 0, 10, 5)
    
    efeitos = st.multiselect("Efeitos Sentidos", 
        ["Náusea", "Tontura", "Euforia", "Visuais de Olhos Fechados", "Alteração de Tempo", "Ansiedade", "Paz Profunda"])
    
    st.subheader("Insights & Terapia")
    insights = st.text_area("Insights, pensamentos ou memórias que surgiram durante a sessão:")
    humor_pos = st.select_slider("Humor Pós-Sessão", options=["Pior", "Inalterado", "Leve Melhora", "Melhor", "Excelente"])
    
    submit_spravato = st.form_submit_button("Registrar Sessão", type="primary", use_container_width=True)
    
    if submit_spravato:
        st.success(f"Sessão de {data_sessao} registrada com sucesso.")
        if "Náusea" in efeitos:
            st.warning("Nota: Náusea registrada. Lembre-se do jejum na próxima sessão.")
