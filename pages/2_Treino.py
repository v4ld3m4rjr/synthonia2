import streamlit as st
import datetime

st.set_page_config(page_title="Treino | Synthonia", page_icon="🏋️", layout="centered")

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

st.title("🏋️ Registro de Performance Física")
st.markdown("Acompanhe seus treinos e prontidão física.")

tab1, tab2 = st.tabs(["Registrar Treino", "Prontidão & Recuperação"])

with tab1:
    with st.form("treino_form"):
        st.subheader("Detalhes da Sessão")
        col1, col2 = st.columns(2)
        
        with col1:
            tipo_treino = st.selectbox("Tipo de Atividade", 
                ["Musculação", "Cardio (Corrida)", "Cardio (Bike)", "Natação", "Crossfit", "Yoga/Alongamento", "Esportes (Futebol, Tênis, etc)"])
            duracao = st.number_input("Duração (minutos)", 0, 300, 60, 5)
        
        with col2:
            intensidade = st.select_slider("Intensidade Percebida", options=["Muito Leve", "Leve", "Moderada", "Alta", "Máxima"])
            rpe = st.slider("RPE (Esforço 1-10)", 1, 10, 7, help="Rate of Perceived Exertion")
        
        horario = st.time_input("Horário do Treino", datetime.time(8, 0))
        
        st.subheader("Feedback")
        performance = st.slider("Como avalia sua performance?", 0, 10, 7)
        notas_treino = st.text_area("Observações (Cargas, recordes, dores)")
        
        submit_treino = st.form_submit_button("Salvar Treino", type="primary", use_container_width=True)
        
        if submit_treino:
            st.success(f"Treino de {tipo_treino} ({duracao} min) registrado!")

with tab2:
    with st.form("readiness_form"):
        st.subheader("Status Corporal")
        
        dor_muscular = st.slider("Dor Muscular Tardia (DOMS) - 0 a 10", 0, 10, 2)
        disposicao = st.slider("Disposição para treinar hoje", 0, 10, 5)
        
        lesao = st.checkbox("Estou com alguma dor/lesão aguda?")
        local_lesao = st.text_input("Local da dor (se houver)") if lesao else None
        
        hrv_input = st.number_input("HRV (Variabilidade da Frequência Cardíaca) - Opcional", 0, 200, 0)
        
        submit_readiness = st.form_submit_button("Atualizar Prontidão", use_container_width=True)
        
        if submit_readiness:
            st.info("Status de recuperação atualizado.")
