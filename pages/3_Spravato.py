import streamlit as st
import datetime

st.set_page_config(page_title="Spravato | Synthonia", page_icon="💊", layout="centered")

st.title("💊 Sessão de Spravato (Esketamina)")
st.markdown("Registro detalhado das sessões de tratamento.")

with st.form("spravato_form"):
    st.subheader("1. Parâmetros Fisiológicos")
    col1, col2 = st.columns(2)
    
    with col1:
        data_sessao = st.date_input("Data da Sessão", datetime.date.today())
        dose = st.selectbox("Dosagem", ["56 mg (2 frascos)", "84 mg (3 frascos)"])
        hrv = st.number_input("HRV (Variabilidade Cardíaca - ms)", 0, 200, 0, help="Média RMSSD da sessão")
    
    with col2:
        pa_inicial = st.text_input("PA Inicial (ex: 120/80)")
        pa_final = st.text_input("PA Final (ex: 130/85)")
        fc_media = st.number_input("Freq. Cardíaca Média (bpm)", 40, 200, 70)

    st.subheader("2. Fenomenologia & Dissociação (CADSS-6)")
    st.caption("Responda conforme sua experiência DURANTE a sessão (0 = Nem um pouco, 4 = Extremamente)")
    
    c1 = st.slider("1. As coisas pareceram irreais?", 0, 4, 0)
    c2 = st.slider("2. As coisas pareceram mudar de forma/cor?", 0, 4, 0)
    c3 = st.slider("3. Sentiu como se estivesse vendo a si mesmo de fora?", 0, 4, 0)
    c4 = st.slider("4. Perdeu a noção do tempo?", 0, 4, 0)
    c5 = st.slider("5. Sentiu-se desconectado do próprio corpo?", 0, 4, 0)
    c6 = st.slider("6. O ambiente pareceu estranho ou desconhecido?", 0, 4, 0)
    
    st.subheader("3. Efeitos Adversos & Segurança")
    efeitos = st.multiselect("Marque se sentiu algum destes efeitos:", 
        ["Náusea", "Vômito", "Tontura/Vertigem", "Sedação Excessiva", "Ansiedade Intensa", "Dor de Cabeça", "Alteração Visual", "Gosto Ruim na Boca"])
    
    outros_efeitos = st.text_input("Outro efeito adverso (se houver):")

    st.subheader("4. Avaliação Global")
    satisfacao = st.slider("Satisfação com a Sessão (0-10)", 0, 10, 5)
    func_global = st.slider("Funcionamento Global Hoje (0-100)", 0, 100, 70, help="Capacidade de realizar tarefas diárias e interagir socialmente")
    
    st.subheader("5. Diário & Insights")
    insights = st.text_area("Insights, pensamentos ou memórias:")
    
    submit_spravato = st.form_submit_button("Registrar Sessão", type="primary", use_container_width=True)
    
    if submit_spravato:
        score_cadss = sum([c1, c2, c3, c4, c5, c6])
        st.success(f"Sessão de {data_sessao} registrada!")
        st.info(f"Score CADSS-6 (Dissociação): {score_cadss}/24")
        
        if "Náusea" in efeitos or "Vômito" in efeitos:
            st.warning("⚠️ Lembrete de Jejum: Reforce o jejum de 2h (alimentos) e 30min (líquidos) na próxima sessão.")
