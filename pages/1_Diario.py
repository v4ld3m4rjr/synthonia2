import streamlit as st
import datetime
import json
import os
import time

st.set_page_config(page_title="Diário | Synthonia", page_icon="📖", layout="centered")

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
    .journal-entry {
        background-color: rgba(30, 41, 59, 0.5);
        padding: 20px;
        border-radius: 10px;
        border-left: 4px solid #0ea5e9;
        margin-bottom: 20px;
    }
</style>
""", unsafe_allow_html=True)

st.title("📖 Diário Pessoal")
st.markdown("Registre suas sensações, experiências e pensamentos.")

# --- PERSISTENCE LOGIC ---
JOURNAL_FILE = "journal_data.json"

def load_journal():
    if os.path.exists(JOURNAL_FILE):
        with open(JOURNAL_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_journal(data):
    with open(JOURNAL_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

journal_data = load_journal()

# --- SIDEBAR: CALENDAR & SEARCH ---
with st.sidebar:
    st.header("Navegação")
    selected_date = st.date_input("Selecionar Data", datetime.date.today())
    date_str = selected_date.strftime("%Y-%m-%d")
    
    st.markdown("---")
    st.subheader("Busca")
    search_query = st.text_input("Buscar no diário...")

# --- MAIN CONTENT ---

# 1. Search Mode
if search_query:
    st.subheader(f"Resultados para: '{search_query}'")
    found = False
    for d, content in sorted(journal_data.items(), reverse=True):
        if search_query.lower() in content.lower():
            found = True
            with st.container():
                st.markdown(f"### 📅 {d}")
                st.markdown(f"<div class='journal-entry'>{content}</div>", unsafe_allow_html=True)
                if st.button(f"Editar {d}", key=f"edit_{d}"):
                    # Logic to jump to date would require rerunning with new state, simplified here
                    st.info(f"Selecione a data {d} no menu lateral para editar.")
    if not found:
        st.warning("Nenhuma entrada encontrada.")

# 2. Editor Mode (Default)
else:
    st.subheader(f"Entrada de: {selected_date.strftime('%d/%m/%Y')}")
    
    current_content = journal_data.get(date_str, "")
    
    # Autosave simulation: Streamlit reruns on change, so we save on every change if key is set
    new_content = st.text_area(
        "Escreva aqui...", 
        value=current_content, 
        height=400,
        placeholder="Como você está se sentindo hoje? O que aconteceu?",
        key="journal_editor"
    )
    
    # Save Logic
    if new_content != current_content:
        journal_data[date_str] = new_content
        save_journal(journal_data)
        time.sleep(0.5) # Debounce simulation
        st.toast("Alterações salvas automaticamente!", icon="💾")
    
    st.caption(f"Última modificação: {datetime.datetime.now().strftime('%H:%M:%S')}")
    
    # Historical Context (Previous Entry)
    st.markdown("---")
    st.subheader("Histórico Recente")
    
    sorted_dates = sorted(journal_data.keys(), reverse=True)
    count = 0
    for d in sorted_dates:
        if d != date_str and count < 3:
            with st.expander(f"📅 {d}"):
                st.write(journal_data[d])
            count += 1
