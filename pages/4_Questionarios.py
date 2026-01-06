import streamlit as st

st.set_page_config(page_title="Questionários | Synthonia", page_icon="📋", layout="centered")

st.title("📋 Avaliações Clínicas")
st.markdown("Monitoramento periódico de sintomas (PHQ-9 e GAD-7).")

tab_phq9, tab_gad7 = st.tabs(["PHQ-9 (Depressão)", "GAD-7 (Ansiedade)"])

def calcular_resultado(score, escalas):
    for limite, severidade in escalas.items():
        if score <= limite:
            return severidade
    return "Severo"

with tab_phq9:
    st.subheader("PHQ-9: Questionário de Saúde do Paciente")
    st.caption("Nas últimas 2 semanas, com que frequência você foi incomodado por:")
    
    opcoes = {"Nenhuma vez": 0, "Vários dias": 1, "Mais da metade dos dias": 2, "Quase todos os dias": 3}
    
    p1 = st.radio("1. Pouco interesse ou prazer em fazer as coisas?", list(opcoes.keys()), horizontal=True)
    p2 = st.radio("2. Sentir-se para baixo, deprimido ou sem perspectiva?", list(opcoes.keys()), horizontal=True)
    p3 = st.radio("3. Dificuldade para adormecer, permanecer dormindo, ou dormir demais?", list(opcoes.keys()), horizontal=True)
    p4 = st.radio("4. Sentir-se cansado ou com pouca energia?", list(opcoes.keys()), horizontal=True)
    p5 = st.radio("5. Falta de apetite ou comendo demais?", list(opcoes.keys()), horizontal=True)
    p6 = st.radio("6. Sentir-se mal consigo mesmo — ou que é um fracasso?", list(opcoes.keys()), horizontal=True)
    p7 = st.radio("7. Dificuldade para se concentrar nas coisas?", list(opcoes.keys()), horizontal=True)
    p8 = st.radio("8. Mover-se ou falar tão devagar que outras pessoas notaram? Ou o oposto?", list(opcoes.keys()), horizontal=True)
    p9 = st.radio("9. Pensamentos de que seria melhor estar morto ou de se ferir?", list(opcoes.keys()), horizontal=True)
    
    if st.button("Calcular PHQ-9", type="primary"):
        score_phq = sum([opcoes[p] for p in [p1, p2, p3, p4, p5, p6, p7, p8, p9]])
        escala_phq = {4: "Mínima", 9: "Leve", 14: "Moderada", 19: "Moderadamente Severa", 27: "Severa"}
        resultado = calcular_resultado(score_phq, escala_phq)
        
        st.metric("Pontuação Total", f"{score_phq}/27")
        st.info(f"Classificação: **Depressão {resultado}**")

with tab_gad7:
    st.subheader("GAD-7: Transtorno de Ansiedade Generalizada")
    st.caption("Nas últimas 2 semanas, com que frequência você foi incomodado por:")
    
    g1 = st.radio("1. Sentir-se nervoso, ansioso ou no limite?", list(opcoes.keys()), horizontal=True, key="g1")
    g2 = st.radio("2. Não ser capaz de impedir ou controlar as preocupações?", list(opcoes.keys()), horizontal=True, key="g2")
    g3 = st.radio("3. Preocupar-se muito com diversas coisas?", list(opcoes.keys()), horizontal=True, key="g3")
    g4 = st.radio("4. Dificuldade para relaxar?", list(opcoes.keys()), horizontal=True, key="g4")
    g5 = st.radio("5. Estar tão agitado que é difícil ficar parado?", list(opcoes.keys()), horizontal=True, key="g5")
    g6 = st.radio("6. Ficar facilmente aborrecido ou irritado?", list(opcoes.keys()), horizontal=True, key="g6")
    g7 = st.radio("7. Sentir medo como se algo terrível fosse acontecer?", list(opcoes.keys()), horizontal=True, key="g7")
    
    if st.button("Calcular GAD-7", type="primary"):
        score_gad = sum([opcoes[p] for p in [g1, g2, g3, g4, g5, g6, g7]])
        escala_gad = {4: "Mínima", 9: "Leve", 14: "Moderada", 21: "Severa"}
        resultado_gad = calcular_resultado(score_gad, escala_gad)
        
        st.metric("Pontuação Total", f"{score_gad}/21")
        st.info(f"Classificação: **Ansiedade {resultado_gad}**")
