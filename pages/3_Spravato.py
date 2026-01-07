import streamlit as st
import datetime

st.set_page_config(page_title="Spravato | Synthonia", page_icon="💊", layout="centered")

BG_URL = "https://raw.githubusercontent.com/v4ld3m4rjr/synthonia2/main/download%20(30).png"
LOGO_URL = "https://raw.githubusercontent.com/v4ld3m4rjr/synthonia2/main/BAIXA_RESOLUCAO_ICONE_VALDEMARJR_COR_FUNDOTRANSPARENTE.png"

# --- CUSTOM CSS ---
st.markdown(f"""
<style>
    /* Hide Streamlit Toolbar */
    [data-testid="stToolbar"] {{visibility: hidden;}}
    footer {{visibility: hidden;}}

    /* Background */
    [data-testid="stAppViewContainer"] {{
        background-image: linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), 
                          url("{BG_URL}");
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
    }}

    div.stButton > button {{
        background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
        color: white;
        border: 1px solid #FFFFFF;
        padding: 10px 24px;
        border-radius: 25px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        font-weight: 600;
    }}
    div.stButton > button:hover {{
        transform: translateY(-2px);
        box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2);
        background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%);
        border-color: #f8fafc;
    }}
    
    /* Sidebar Logo Responsiveness */
    [data-testid="stSidebar"] img {{
        max-width: 100%;
        height: auto;
    }}
    
    /* Mobile/Tablet Adjustments */
    @media (max-width: 768px) {{
        .logo-container img {{
            width: 50px !important;
        }}
    }}
</style>
""", unsafe_allow_html=True)

st.title("💊 Sessão de Spravato (Esketamina)")
st.markdown("Registro detalhado das sessões de tratamento.")

with st.sidebar:
    st.image(LOGO_URL, width=77)
    # DIVIDER REMOVED HERE

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
        
        # Save Session Data
        session_record = {
            "dose": dose,
            "hrv": hrv,
            "pa_inicial": pa_inicial,
            "pa_final": pa_final,
            "fc_media": fc_media,
            "cadss_score": score_cadss,
            "cadss_details": [c1, c2, c3, c4, c5, c6],
            "efeitos": efeitos,
            "outros_efeitos": outros_efeitos,
            "satisfacao": satisfacao,
            "func_global": func_global,
            "insights": insights,
            "timestamp": datetime.datetime.now().isoformat()
        }
        
        date_key = data_sessao.strftime("%Y-%m-%d")
        st.session_state.spravato_data[date_key] = session_record
        save_spravato_data(st.session_state.spravato_data)
        
        st.success(f"Sessão de {data_sessao} registrada e salva no calendário!")
        st.info(f"Score CADSS-6 (Dissociação): {score_cadss}/24")
        
        if "Náusea" in efeitos or "Vômito" in efeitos:
            st.warning("⚠️ Lembrete de Jejum: Reforce o jejum de 2h (alimentos) e 30min (líquidos) na próxima sessão.")
            
        time.sleep(1.5)
        st.rerun()

st.markdown("---")
st.header("📅 Histórico de Sessões")

# --- CALENDAR UI ---
with st.container(border=True):
    col_prev, col_title, col_next = st.columns([1, 3, 1])
    with col_prev:
        if st.button("◀", key="prev_month"):
            change_month(-1)
            st.rerun()
    with col_title:
        month_name = calendar.month_name[st.session_state.cal_month]
        st.markdown(f"<h3 style='text-align: center; margin: 0;'>{month_name} {st.session_state.cal_year}</h3>", unsafe_allow_html=True)
    with col_next:
        if st.button("▶", key="next_month"):
            change_month(1)
            st.rerun()
    
    # Weekday Headers
    cols = st.columns(7)
    days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
    for i, day in enumerate(days):
        cols[i].markdown(f"<div style='text-align: center; font-weight: bold;'>{day}</div>", unsafe_allow_html=True)
    
    # Days Grid
    cal = calendar.monthcalendar(st.session_state.cal_year, st.session_state.cal_month)
    for week in cal:
        cols = st.columns(7)
        for i, day in enumerate(week):
            if day == 0:
                cols[i].write("")
            else:
                date_key = f"{st.session_state.cal_year}-{st.session_state.cal_month:02d}-{day:02d}"
                has_entry = date_key in st.session_state.spravato_data
                
                # Visual Indicator (Green Pill if entry exists)
                label = f"{day} 💊" if has_entry else f"{day}"
                
                if cols[i].button(label, key=f"day_{day}", use_container_width=True):
                    select_day(day)
                    st.rerun()

# --- SESSION DETAILS VIEW ---
selected_date_str = st.session_state.selected_date.strftime("%Y-%m-%d")
display_date = st.session_state.selected_date.strftime("%d/%m/%Y")

if selected_date_str in st.session_state.spravato_data:
    data = st.session_state.spravato_data[selected_date_str]
    
    st.subheader(f"Detalhes da Sessão: {display_date}")
    
    with st.container(border=True):
        c1, c2, c3 = st.columns(3)
        c1.metric("Dosagem", data.get("dose", "N/A"))
        c2.metric("HRV", f"{data.get('hrv', 0)} ms")
        c3.metric("CADSS-6", f"{data.get('cadss_score', 0)}/24")
        
        c4, c5 = st.columns(2)
        c4.metric("PA Inicial", data.get("pa_inicial", "N/A"))
        c5.metric("PA Final", data.get("pa_final", "N/A"))
        
        st.markdown("**Efeitos Adversos:**")
        if data.get("efeitos"):
            st.write(", ".join(data["efeitos"]))
        else:
            st.write("Nenhum registrado.")
            
        if data.get("insights"):
            st.markdown("**Insights:**")
            st.info(data["insights"])
else:
    st.info(f"Nenhuma sessão registrada em {display_date}.")
