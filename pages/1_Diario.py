import streamlit as st
import datetime
import json
import os
import time
import calendar

st.set_page_config(page_title="Diário | Synthonia", page_icon="📖", layout="centered")

BG_URL = "https://raw.githubusercontent.com/v4ld3m4rjr/synthonia2/main/download%20(30).png"

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

    /* Button Styling */
    div.stButton > button {{
        background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
        color: white;
        border: none;
        padding: 10px 24px;
        border-radius: 12px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 100%;
    }}
    div.stButton > button:hover {{
        transform: translateY(-2px);
        box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2);
        background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%);
    }}
    
    /* Calendar Button Specifics */
    .calendar-btn {{
        padding: 5px !important;
        font-size: 0.9rem !important;
        height: 50px !important;
    }}
    
    .journal-entry {{
        background-color: rgba(30, 41, 59, 0.5);
        padding: 20px;
        border-radius: 10px;
        border-left: 4px solid #0ea5e9;
        margin-bottom: 20px;
    }}
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

if 'journal_data' not in st.session_state:
    st.session_state.journal_data = load_journal()

# --- CALENDAR LOGIC ---
if 'cal_year' not in st.session_state:
    st.session_state.cal_year = datetime.date.today().year
if 'cal_month' not in st.session_state:
    st.session_state.cal_month = datetime.date.today().month
if 'selected_date' not in st.session_state:
    st.session_state.selected_date = datetime.date.today()

def change_month(delta):
    m = st.session_state.cal_month + delta
    y = st.session_state.cal_year
    if m > 12:
        m = 1
        y += 1
    elif m < 1:
        m = 12
        y -= 1
    st.session_state.cal_month = m
    st.session_state.cal_year = y

def select_day(d):
    st.session_state.selected_date = datetime.date(st.session_state.cal_year, st.session_state.cal_month, d)

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
                has_entry = date_key in st.session_state.journal_data and st.session_state.journal_data[date_key].strip() != ""
                
                # Visual Indicator (Green if entry exists)
                label = f"{day} ✅" if has_entry else f"{day}"
                
                if cols[i].button(label, key=f"day_{day}", use_container_width=True):
                    select_day(day)
                    st.rerun()

# --- EDITOR AREA ---
st.markdown("---")
current_date_str = st.session_state.selected_date.strftime("%Y-%m-%d")
display_date = st.session_state.selected_date.strftime("%d/%m/%Y")

st.subheader(f"📝 Entrada de: {display_date}")

current_content = st.session_state.journal_data.get(current_date_str, "")

# Editor
new_content = st.text_area(
    "Escreva seus pensamentos...", 
    value=current_content, 
    height=300,
    placeholder="Como você está se sentindo hoje?",
    key=f"editor_{current_date_str}" 
)

# Manual Save Button
if st.button("💾 Gravar Anotação", type="primary"):
    if new_content.strip():
        st.session_state.journal_data[current_date_str] = new_content
    else:
        # If empty, remove entry? Or just save empty.
        if current_date_str in st.session_state.journal_data:
            del st.session_state.journal_data[current_date_str]
            
    save_journal(st.session_state.journal_data)
    st.success("Diário salvo com sucesso!")
    time.sleep(1)
    st.rerun()

# --- HISTORICAL SEARCH (Sidebar) ---
with st.sidebar:
    st.header("Busca")
    search_query = st.text_input("Palavra-chave...")
    if search_query:
        st.markdown("---")
        for d, content in sorted(st.session_state.journal_data.items(), reverse=True):
            if search_query.lower() in content.lower():
                with st.expander(f"📅 {d}"):
                    st.write(content)
                    if st.button("Ir", key=f"go_{d}"):
                        y, m, day = map(int, d.split("-"))
                        st.session_state.cal_year = y
                        st.session_state.cal_month = m
                        st.session_state.selected_date = datetime.date(y, m, day)
                        st.rerun()
