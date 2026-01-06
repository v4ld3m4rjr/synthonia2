import streamlit as st
import datetime

st.set_page_config(page_title="Check-in | Synthonia", page_icon="📝")

st.title("📝 Check-in Diário")
st.markdown("Registre como você está se sentindo hoje.")

with st.form("checkin_form"):
    col1, col2 = st.columns(2)
    
    with col1:
        humor = st.slider("Como está seu humor?", 0, 10, 5, help="0 = Péssimo, 10 = Excelente")
        energia = st.slider("Nível de Energia", 0, 10, 5)
        
    with col2:
        ansiedade = st.slider("Nível de Ansiedade", 0, 10, 2)
        sono = st.number_input("Horas de Sono", min_value=0.0, max_value=24.0, value=7.0, step=0.5)
    
    tags = st.multiselect("Sintomas / Tags", ["Cansaço", "Foco Alto", "Irritabilidade", "Dor de Cabeça", "Motivado", "Tristeza"])
    notas = st.text_area("Notas do dia")
    
    submitted = st.form_submit_button("Salvar Registro", use_container_width=True, type="primary")
    
    if submitted:
        # Aqui entra a lógica de salvar no Supabase (futuro)
        st.success(f"Check-in salvo! Humor: {humor} | Energia: {energia}")
        st.balloons()
