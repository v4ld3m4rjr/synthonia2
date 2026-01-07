import streamlit as st

st.set_page_config(page_title="Questionários | Synthonia", page_icon="📋", layout="wide")

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

st.title("📋 Avaliações Clínicas Multidimensionais")
st.markdown("Instrumentos validados para monitoramento de comorbidades.")

# Tabs para organizar os domínios
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "Humor (PHQ-9/ASRM)", 
    "Ansiedade & TOC (GAD-7/OCI-R)", 
    "Neurodivergência (RAADS)", 
    "Funcionalidade (FAST)",
    "Qualidade de Vida (WHOQOL)"
])

# --- FUNÇÃO DE CÁLCULO GENÉRICA ---
def calcular_score(respostas_dict):
    return sum(respostas_dict.values())

def exibir_resultado(score, max_score, classificacao):
    col_a, col_b = st.columns([1, 3])
    with col_a:
        st.metric("Score Total", f"{score}/{max_score}")
    with col_b:
        st.info(f"Classificação Sugerida: **{classificacao}**")

# --- TAB 1: HUMOR ---
with tab1:
    st.header("Depressão (PHQ-9)")
    with st.expander("Preencher PHQ-9", expanded=True):
        opcoes_phq = {"Nenhuma vez": 0, "Vários dias": 1, "Mais da metade dos dias": 2, "Quase todos os dias": 3}
        p_res = {}
        p_res['p1'] = st.radio("1. Pouco interesse/prazer?", list(opcoes_phq.keys()), horizontal=True, key="p1")
        p_res['p2'] = st.radio("2. Sentir-se deprimido?", list(opcoes_phq.keys()), horizontal=True, key="p2")
        p_res['p3'] = st.radio("3. Problemas de sono?", list(opcoes_phq.keys()), horizontal=True, key="p3")
        p_res['p4'] = st.radio("4. Cansaço/falta de energia?", list(opcoes_phq.keys()), horizontal=True, key="p4")
        p_res['p5'] = st.radio("5. Apetite alterado?", list(opcoes_phq.keys()), horizontal=True, key="p5")
        p_res['p6'] = st.radio("6. Sentir-se mal consigo mesmo?", list(opcoes_phq.keys()), horizontal=True, key="p6")
        p_res['p7'] = st.radio("7. Dificuldade de concentração?", list(opcoes_phq.keys()), horizontal=True, key="p7")
        p_res['p8'] = st.radio("8. Lentidão ou agitação?", list(opcoes_phq.keys()), horizontal=True, key="p8")
        p_res['p9'] = st.radio("9. Pensamentos de morte?", list(opcoes_phq.keys()), horizontal=True, key="p9")
        
        if st.button("Calcular PHQ-9"):
            score = sum([opcoes_phq[v] for p in p_res.values()]) # Fixed bug here in original code
            score = sum([opcoes_phq[v] for v in p_res.values()])
            if score <= 4: c = "Mínima"
            elif score <= 9: c = "Leve"
            elif score <= 14: c = "Moderada"
            elif score <= 19: c = "Moderadamente Severa"
            else: c = "Severa"
            exibir_resultado(score, 27, c)

    st.markdown("---")
    st.header("Mania (ASRM - Altman Self-Rating Mania Scale)")
    with st.expander("Preencher ASRM (Rastreio de Bipolaridade)"):
        st.caption("Escolha a opção que melhor descreve como se sentiu na última semana:")
        
        q1 = st.radio("1. Humor", [
            "0 - Não me sinto mais feliz ou animado que o normal",
            "1 - Sinto-me mais feliz ou animado que o normal",
            "2 - Sinto-me tão feliz e energizado que isso preocupa as pessoas",
            "3 - Sinto-me eufórico, 'no topo do mundo'",
            "4 - Estou eufórico o tempo todo"
        ])
        
        q2 = st.radio("2. Autoestima", [
            "0 - Não me sinto mais autoconfiante que o normal",
            "1 - Sinto-me mais autoconfiante que o normal",
            "2 - Sinto-me muito confiante, especial",
            "3 - Sinto que tenho poderes ou habilidades especiais",
            "4 - Sinto que sou uma pessoa extremamente importante (ex: missão divina)"
        ])
        
        q3 = st.radio("3. Necessidade de Sono", [
            "0 - Durmo a mesma quantidade de sempre",
            "1 - Preciso de menos sono que o normal",
            "2 - Posso passar com muito pouco sono",
            "3 - Não preciso dormir",
            "4 - Não durmo há dias e não sinto cansaço"
        ])
        
        q4 = st.radio("4. Fala", [
            "0 - Falo o mesmo tanto que o normal",
            "1 - Falo mais que o normal",
            "2 - Falo tão rápido que as pessoas pedem para ir devagar",
            "3 - Falo sem parar",
            "4 - Falo constantemente e ninguém consegue me interromper"
        ])
        
        q5 = st.radio("5. Atividade", [
            "0 - Não estou mais ativo que o normal",
            "1 - Estou mais ativo (física ou mentalmente)",
            "2 - Estou muito ativo o dia todo",
            "3 - Estou constantemente ativo e inquieto",
            "4 - Estou constantemente ativo e agitado o tempo todo"
        ])
        
        if st.button("Calcular ASRM"):
            s1 = int(q1.split(" - ")[0])
            s2 = int(q2.split(" - ")[0])
            s3 = int(q3.split(" - ")[0])
            s4 = int(q4.split(" - ")[0])
            s5 = int(q5.split(" - ")[0])
            score_asrm = s1 + s2 + s3 + s4 + s5
            
            c_asrm = "Normal"
            if score_asrm >= 6: c_asrm = "Probabilidade Alta de Mania/Hipomania"
            
            exibir_resultado(score_asrm, 20, c_asrm)

# --- TAB 2: ANSIEDADE & TOC ---
with tab2:
    st.header("Ansiedade (GAD-7)")
    with st.expander("Preencher GAD-7", expanded=True):
        opcoes_gad = {"Nenhuma vez": 0, "Vários dias": 1, "Mais da metade dos dias": 2, "Quase todos os dias": 3}
        g_res = {}
        for i, q in enumerate(["Nervoso/Ansioso", "Não controla preocupações", "Preocupação excessiva", "Dificuldade relaxar", "Agitação", "Irritabilidade", "Medo terrível"]):
            g_res[f'g{i}'] = st.radio(f"{i+1}. {q}?", list(opcoes_gad.keys()), horizontal=True, key=f"g{i}")
            
        if st.button("Calcular GAD-7"):
            score = sum([opcoes_gad[v] for v in g_res.values()])
            if score <= 4: c = "Mínima"
            elif score <= 9: c = "Leve"
            elif score <= 14: c = "Moderada"
            else: c = "Severa"
            exibir_resultado(score, 21, c)

    st.markdown("---")
    st.header("TOC (OCI-R Short - Inventário Obsessivo-Compulsivo)")
    with st.expander("Preencher OCI-R (Rastreio)"):
        st.caption("Quanto essas experiências te incomodaram no último mês? (0=Nada, 4=Extremamente)")
        
        o1 = st.slider("1. Tenho pensamentos desagradáveis que não consigo tirar da cabeça", 0, 4, 0)
        o2 = st.slider("2. Acho difícil tocar objetos que outros tocaram", 0, 4, 0)
        o3 = st.slider("3. Verifico as coisas com mais frequência que o necessário", 0, 4, 0)
        o4 = st.slider("4. Fico chateado se as coisas não estão arrumadas do meu jeito", 0, 4, 0)
        o5 = st.slider("5. Sinto que devo repetir números ou palavras", 0, 4, 0)
        o6 = st.slider("6. Lavo as mãos mais vezes que o necessário", 0, 4, 0)
        
        if st.button("Calcular OCI-R"):
            score_oci = o1 + o2 + o3 + o4 + o5 + o6
            c_oci = "Sintomas Leves/Normais"
            if score_oci >= 12: c_oci = "Sugestivo de TOC (Procurar Avaliação)"
            exibir_resultado(score_oci, 24, c_oci)

# --- TAB 3: NEURODIVERGÊNCIA ---
with tab3:
    st.header("Autismo (RAADS-14 Screen)")
    st.caption("Versão abreviada de rastreio para TEA em adultos. Responda pensando na sua vida inteira.")
    
    # 0=Nunca, 1=Só quando jovem, 2=Só agora, 3=Sempre
    opcoes_raads = {"Nunca Verdadeiro": 0, "Verdadeiro apenas na infância": 1, "Verdadeiro apenas agora": 2, "Sempre Verdadeiro": 3}
    
    r1 = st.radio("1. É difícil para mim entender o que os outros estão sentindo se não disserem", list(opcoes_raads.keys()), key="r1")
    r2 = st.radio("2. Prefiro ficar sozinho a estar com outras pessoas", list(opcoes_raads.keys()), key="r2")
    r3 = st.radio("3. Fico muito incomodado com texturas, cheiros ou sons específicos", list(opcoes_raads.keys()), key="r3")
    r4 = st.radio("4. Tenho focos de interesse muito intensos e específicos", list(opcoes_raads.keys()), key="r4")
    r5 = st.radio("5. As pessoas dizem que sou 'sem filtro' ou mal-educado sem eu querer", list(opcoes_raads.keys()), key="r5")
    
    if st.button("Calcular RAADS-14 (Parcial)"):
        score_raads = sum([opcoes_raads[x] for x in [r1, r2, r3, r4, r5]])
        st.metric("Score Parcial", f"{score_raads}/15")
        st.caption("Nota: Este é um recorte simplificado. Scores altos sugerem necessidade de avaliação formal.")

# --- TAB 4: FUNCIONALIDADE ---
with tab4:
    st.header("FAST (Functioning Assessment Short Test)")
    st.caption("Quanta dificuldade você teve nas últimas 2 semanas para:")
    
    opcoes_fast = {"Nenhuma": 0, "Leve": 1, "Moderada": 2, "Grave": 3}
    
    f1 = st.select_slider("1. Cuidar da casa/tarefas domésticas", options=list(opcoes_fast.keys()))
    f2 = st.select_slider("2. Trabalhar/Estudar (desempenho)", options=list(opcoes_fast.keys()))
    f3 = st.select_slider("3. Gerenciar suas finanças", options=list(opcoes_fast.keys()))
    f4 = st.select_slider("4. Relacionar-se com amigos/família", options=list(opcoes_fast.keys()))
    f5 = st.select_slider("5. Praticar hobbies ou lazer", options=list(opcoes_fast.keys()))
    f6 = st.select_slider("6. Cuidar da higiene pessoal", options=list(opcoes_fast.keys()))
    
    if st.button("Calcular FAST"):
        score_fast = sum([opcoes_fast[x] for x in [f1, f2, f3, f4, f5, f6]])
        if score_fast <= 11: c_fast = "Funcionamento Preservado/Leve Prejuízo"
        else: c_fast = "Prejuízo Funcional Significativo"
        exibir_resultado(score_fast, 18, c_fast)

# --- TAB 5: QUALIDADE DE VIDA ---
with tab5:
    st.header("Qualidade de Vida (WHOQOL-BREF Simplificado)")
    st.caption("Avalie sua satisfação nas últimas 2 semanas (1=Muito Insatisfeito, 5=Muito Satisfeito)")
    
    w1 = st.slider("1. Como você avaliaria sua qualidade de vida?", 1, 5, 3)
    w2 = st.slider("2. Quão satisfeito você está com sua saúde?", 1, 5, 3)
    w3 = st.slider("3. Quão satisfeito você está com sua capacidade de trabalho?", 1, 5, 3)
    w4 = st.slider("4. Quão satisfeito você está com seus relacionamentos pessoais?", 1, 5, 3)
    w5 = st.slider("5. Quão satisfeito você está consigo mesmo?", 1, 5, 3)
    
    if st.button("Registrar Qualidade de Vida"):
        media = (w1+w2+w3+w4+w5)/5
        st.metric("Média de Satisfação", f"{media:.1f}/5.0")
        if media >= 4: st.success("Qualidade de Vida Alta")
        elif media >= 3: st.warning("Qualidade de Vida Moderada")
        else: st.error("Qualidade de Vida Baixa")
