import streamlit as st
import os
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime, timedelta
import auth_service as auth

# Configuração da Página
st.set_page_config(
    page_title="Synthonia",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="collapsed", 
)

# URLs dos Assets (Github Raw)
LOGO_URL = "https://raw.githubusercontent.com/v4ld3m4rjr/synthonia2/main/BAIXA_RESOLUCAO_ICONE_VALDEMARJR_COR_FUNDOTRANSPARENTE.png"
BG_URL = "https://raw.githubusercontent.com/v4ld3m4rjr/synthonia2/main/download%20(30).png"

# --- CUSTOM CSS ---
st.markdown(f"""
<style>
    /* Hide Streamlit Toolbar (Menu Superior Direito) */
    [data-testid="stToolbar"] {{visibility: hidden;}}
    footer {{visibility: hidden;}}
    
    /* Remover padding padrão */
    .block-container {{ padding-top: 2rem; padding-bottom: 2rem; }}
    
    /* Background */
    [data-testid="stAppViewContainer"] {{
        background-image: linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), 
                          url("{BG_URL}");
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
    }}
    
    /* Botões */
    div.stButton > button {{
        background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
        color: white;
        border: 1px solid #FFFFFF;
        padding: 10px 24px;
        border-radius: 25px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 100%;
        font-weight: 600;
    }}
    div.stButton > button:hover {{
        transform: translateY(-2px);
        box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2);
        background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%);
        border-color: #f8fafc;
    }}
    
    /* Logo Container */
    .logo-container {{
        display: flex;
        justify-content: flex-start; /* Alinhado a esquerda */
        margin-bottom: 20px;
    }}
    
    /* Titles */
    h1, h2, h3 {{ color: #f8fafc !important; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }}
    
    /* Sidebar */
    [data-testid="stSidebar"] {{
        background-color: rgba(15, 23, 42, 0.9);
        border-right: 1px solid rgba(148, 163, 184, 0.1);
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

# --- SESSION STATE INITIALIZATION ---
if 'logged_in' not in st.session_state:
    st.session_state.logged_in = False
if 'role' not in st.session_state:
    st.session_state.role = None
if 'user_name' not in st.session_state:
    st.session_state.user_name = None

# --- SIDEBAR (GLOBAL) ---
# Remove dividers and place logo first
with st.sidebar:
    st.markdown('<div class="logo-container">', unsafe_allow_html=True)
    st.image(LOGO_URL, width=77)
    st.markdown('</div>', unsafe_allow_html=True)
    
    if st.session_state.logged_in:
        if st.button("Sair", icon="🚪"):
            st.session_state.logged_in = False
            st.session_state.role = None
            st.session_state.user_name = None
            st.rerun()

# --- LOGIN SCREEN ---
def login_screen():
    st.title("Synthonia")
    st.markdown("### Acesso ao Sistema")
    
    # Abas principais
    tab_login, tab_cadastro = st.tabs(["🔐 Login", "📝 Cadastro"])
    
    # --- LOGIN TAB ---
    with tab_login:
        subtab_paciente, subtab_medico = st.tabs(["Sou Paciente", "Sou Médico/Admin"])
        
        with subtab_paciente:
            with st.form("login_paciente"):
                email = st.text_input("Email")
                password = st.text_input("Senha", type="password")
                
                submit = st.form_submit_button("Entrar", use_container_width=True)
                
                if submit:
                    res, error = auth.login_user(email, password)
                    if res:
                        st.session_state.logged_in = True
                        st.session_state.role = "patient"
                        st.session_state.user_name = res.user.user_metadata.get('full_name', email)
                        st.session_state.medico = res.user.user_metadata.get('medico', 'N/A')
                        st.success("Login realizado com sucesso!")
                        st.rerun()
                    else:
                        st.error(f"Erro no login: {error}")
            
            # Forgot Password UI
            with st.expander("Esqueci minha senha"):
                st.write("Digite seu email para receber um link de redefinição.")
                reset_email = st.text_input("Email para recuperação")
                if st.button("Enviar Email de Recuperação"):
                    if not reset_email:
                        st.error("Por favor, insira um email.")
                    elif not auth.is_valid_email(reset_email):
                        st.error("Email inválido.")
                    else:
                        success, msg = auth.send_password_reset(reset_email)
                        if success:
                            st.success(msg)
                        else:
                            st.error(msg)

        with subtab_medico:
            with st.form("login_medico"):
                email_med = st.text_input("Email / Usuário")
                pass_med = st.text_input("Senha", type="password")
                
                submit_med = st.form_submit_button("Acessar Painel Profissional", use_container_width=True)
                
                if submit_med:
                    # Admin Hardcoded Check first (handled in auth_service but explicit here for clarity if needed)
                    res, error = auth.login_user(email_med, pass_med)
                    
                    if res:
                        # Handle Response Structure (Mock vs Real Supabase)
                        user_obj = res.user if hasattr(res, 'user') else res.get('user')
                        
                        # Normalize access to metadata
                        if hasattr(user_obj, 'user_metadata'):
                             meta = user_obj.user_metadata
                        else:
                             meta = user_obj.get('user_metadata', {})

                        role = meta.get('role', 'doctor')
                        if role in ['admin', 'doctor']:
                            st.session_state.logged_in = True
                            st.session_state.role = role
                            st.session_state.user_name = meta.get('full_name', email_med)
                            st.success(f"Bem-vindo, {st.session_state.user_name}!")
                            st.rerun()
                        else:
                            st.error("Esta conta não tem permissão de acesso médico.")
                    else:
                        st.error(f"Erro: {error}")

    # --- REGISTRATION TAB ---
    with tab_cadastro:
        type_register = st.radio("Tipo de Cadastro", ["Paciente", "Médico"])
        
        if type_register == "Médico":
            st.info("ℹ️ O cadastro de médicos é restrito. Para solicitar acesso, entre em contato exclusivamente através do email: **valdemarjunior@gmail.com**")
            
            with st.expander("Verificar disponibilidade de domínio (Opcional)"):
                email_check = st.text_input("Digite seu email profissional para verificação")
                if email_check:
                    if not auth.is_valid_email(email_check):
                        st.error("Formato de email inválido.")
                    elif not email_check.endswith("@gmail.com"): # Exemplo de restrição
                         st.warning("Cadastros automáticos estão desabilitados. Contate o administrador.")
        
        else:
            with st.form("register_form"):
                st.markdown("#### Cadastro de Paciente")
                new_name = st.text_input("Nome Completo")
                new_email = st.text_input("Email")
                new_pass = st.text_input("Senha", type="password", help="Mínimo 8 caracteres, maiúscula, minúscula e número.")
                confirm_pass = st.text_input("Confirmar Senha", type="password")
                
                medicos_disponiveis = ["Selecione...", "Dr. Silva (Psiquiatra)", "Dra. Santos (Neurologista)", "Dr. Oliveira (Terapeuta)", "Dr. Jader (O Brabo) - Psiquiatria Intervencionista"]
                selected_medico = st.selectbox("Médico Responsável", medicos_disponiveis)
                
                submit_register = st.form_submit_button("Criar Conta", use_container_width=True)
                
                if submit_register:
                    # Validations
                    if not new_name or not new_email or not new_pass:
                        st.error("Todos os campos são obrigatórios.")
                    elif not auth.is_valid_email(new_email):
                        st.error("Email inválido.")
                    elif selected_medico == "Selecione...":
                        st.error("Selecione um médico responsável.")
                    elif new_pass != confirm_pass:
                        st.error("As senhas não coincidem.")
                    else:
                        is_strong, msg = auth.check_password_strength(new_pass)
                        if not is_strong:
                            st.error(msg)
                        else:
                            success, message = auth.register_user(new_email, new_pass, new_name, "patient", selected_medico)
                            if success:
                                st.success(message)
                            else:
                                st.error(f"Erro ao cadastrar: {message}")

# --- PATIENT HOME ---
def patient_home():
    col1, col2 = st.columns([1, 4])
    with col1:
        # Logo already in sidebar, but kept here for header style if needed, or remove.
        # Keeping consistent with previous design but maybe smaller
        pass 
            
    with col2:
        st.title(f"Olá, {st.session_state.user_name}")
        st.markdown(f"**Médico Responsável:** {st.session_state.get('medico', 'N/A')}")
        st.markdown("### Monitoramento Integrativo & Diário")

    st.markdown("---")

    # --- NAVIGATION GRID ---
    st.subheader("Módulos Principais")

    c1, c2, c3, c4, c5 = st.columns(5)

    with c1:
        with st.container(border=True):
            st.markdown("## ✅")
            st.markdown("**Check-in**")
            st.caption("Métricas diárias rápidas.")
            st.page_link("pages/1_Checkin.py", label="Registrar", icon="👉", use_container_width=True)

    with c2:
        with st.container(border=True):
            st.markdown("## 📖")
            st.markdown("**Diário**")
            st.caption("Notas e memórias.")
            st.page_link("pages/1_Diario.py", label="Abrir Diário", icon="👉", use_container_width=True)

    with c3:
        with st.container(border=True):
            st.markdown("## 📋")
            st.markdown("**Questionários**")
            st.caption("Avaliações periódicas.")
            st.page_link("pages/2_Questionarios.py", label="Avaliar", icon="👉", use_container_width=True)

    with c4:
        with st.container(border=True):
            st.markdown("## 💊")
            st.markdown("**Spravato**")
            st.caption("Sessões e efeitos.")
            st.page_link("pages/3_Spravato.py", label="Acessar", icon="👉", use_container_width=True)

    with c5:
        with st.container(border=True):
            st.markdown("## 📈")
            st.markdown("**Dashboard**")
            st.caption("Análise de dados.")
            st.page_link("pages/4_Dashboard.py", label="Visualizar", icon="👉", use_container_width=True)

# --- DOCTOR DASHBOARD ---
def doctor_dashboard():
    st.title("🩺 Painel Médico")
    st.markdown(f"Bem-vindo, {st.session_state.user_name}")
    
    # State for Navigation (List vs Detail)
    if 'doc_view' not in st.session_state:
        st.session_state.doc_view = 'list'
    if 'selected_patient' not in st.session_state:
        st.session_state.selected_patient = None

    # --- MOCK PATIENT DATABASE ---
    patients_db = pd.DataFrame([
        {"id": 1, "nome": "João Silva", "status": "Em Tratamento", "ultima_consulta": "2024-03-10", "risco": "Médio"},
        {"id": 2, "nome": "Maria Oliveira", "status": "Estável", "ultima_consulta": "2024-03-12", "risco": "Baixo"},
        {"id": 3, "nome": "Carlos Santos", "status": "Alerta", "ultima_consulta": "2024-03-08", "risco": "Alto"},
        {"id": 4, "nome": "Ana Pereira", "status": "Em Tratamento", "ultima_consulta": "2024-03-14", "risco": "Baixo"},
    ])

    # --- LIST VIEW ---
    if st.session_state.doc_view == 'list':
        st.subheader("Pacientes Acompanhados")
        
        # Filters
        c1, c2 = st.columns([3, 1])
        with c1:
            search = st.text_input("Buscar paciente...", placeholder="Nome ou ID")
        with c2:
            status_filter = st.selectbox("Status", ["Todos", "Em Tratamento", "Estável", "Alerta"])
        
        # Filtering Logic
        filtered_df = patients_db.copy()
        if search:
            filtered_df = filtered_df[filtered_df['nome'].str.contains(search, case=False)]
        if status_filter != "Todos":
            filtered_df = filtered_df[filtered_df['status'] == status_filter]
            
        # Display Table with Selection
        # We use a trick with columns to make a "clickable" table or just standard buttons per row
        
        # Header
        h1, h2, h3, h4, h5 = st.columns([2, 1.5, 1.5, 1, 1])
        h1.markdown("**Nome**")
        h2.markdown("**Status**")
        h3.markdown("**Última Consulta**")
        h4.markdown("**Risco**")
        h5.markdown("**Ação**")
        st.markdown("---")
        
        for index, row in filtered_df.iterrows():
            c1, c2, c3, c4, c5 = st.columns([2, 1.5, 1.5, 1, 1])
            c1.write(row['nome'])
            
            # Status Color
            status_color = "green" if row['status'] == "Estável" else "orange" if row['status'] == "Em Tratamento" else "red"
            c2.markdown(f":{status_color}[{row['status']}]")
            
            c3.write(row['ultima_consulta'])
            c4.write(row['risco'])
            
            if c5.button("Ver", key=f"btn_{row['id']}"):
                st.session_state.selected_patient = row
                st.session_state.doc_view = 'detail'
                st.rerun()
                
        st.markdown("---")
        
        # GLOBAL EXPORT
        csv_all = filtered_df.to_csv(index=False).encode('utf-8')
        export_filename = f"pacientes_export_{datetime.now().strftime('%Y%m%d')}.csv"
        
        if st.download_button(
            label="📥 Exportar Lista Completa (CSV)",
            data=csv_all,
            file_name=export_filename,
            mime="text/csv",
        ):
            st.success("Exportação iniciada com sucesso!")

    # --- DETAIL VIEW ---
    elif st.session_state.doc_view == 'detail':
        patient = st.session_state.selected_patient
        
        # Header with Back Button
        c1, c2 = st.columns([1, 6])
        with c1:
            if st.button("⬅ Voltar"):
                st.session_state.doc_view = 'list'
                st.session_state.selected_patient = None
                st.rerun()
        with c2:
            st.subheader(f"Prontuário: {patient['nome']}")
            
        st.markdown("---")
        
        # --- FILTERS (Inside Detail) ---
        with st.expander("Controles de Visualização", expanded=True):
            c1, c2, c3 = st.columns(3)
            with c1:
                 periodo = st.select_slider("Período", options=["7 dias", "14 dias", "21 dias", "28 dias"], value="7 dias")
            with c2:
                 metricas = st.multiselect("Variáveis", ["Humor", "Ansiedade", "Sono", "Ideação Suicida"], default=["Humor", "Ansiedade"])
        
        # --- MOCK DATA FOR CHARTS ---
        days_map = {"7 dias": 7, "14 dias": 14, "21 dias": 21, "28 dias": 28}
        days = days_map[periodo]
        dates = pd.date_range(end=datetime.today(), periods=days)
        
        chart_data = pd.DataFrame({
            "Data": dates,
            "Humor": np.random.randint(3, 9, size=days),
            "Ansiedade": np.random.randint(1, 8, size=days),
            "Sono": np.random.randint(4, 10, size=days),
            "Ideação Suicida": np.random.randint(0, 2, size=days)
        })
        
        # Charts
        if metricas:
            fig = px.line(chart_data, x="Data", y=metricas, markers=True, template="plotly_dark", title=f"Evolução - Últimos {days} dias")
            fig.update_traces(line_shape='spline', mode='lines+markers')
            st.plotly_chart(fig, use_container_width=True)
            
        # --- JOURNAL SECTION (DIÁRIO) ---
        st.subheader("📖 Diário do Paciente (Últimas Entradas)")
        
        # Mock Journal Entries
        journal_entries = [
            {"data": (datetime.now() - timedelta(days=1)).strftime("%d/%m/%Y"), "texto": "Hoje me senti um pouco mais ansioso pela manhã, mas melhorou à tarde."},
            {"data": (datetime.now() - timedelta(days=2)).strftime("%d/%m/%Y"), "texto": "Dormi bem, acordei disposto. Sem efeitos colaterais da medicação."},
            {"data": (datetime.now() - timedelta(days=5)).strftime("%d/%m/%Y"), "texto": "Sessão de terapia foi intensa, mas produtiva."}
        ]
        
        for entry in journal_entries:
            with st.container(border=True):
                st.markdown(f"**{entry['data']}**")
                st.write(entry['texto'])
                
        # --- INDIVIDUAL EXPORT ---
        st.markdown("### Exportação de Dados")
        
        # Combine chart data and journal for export (simplified as two separate sheets or just main data)
        # Here we export the numerical data + journal text if possible, but let's stick to the requested "Patient Data"
        
        # Prepare CSV
        csv_data = chart_data.to_csv(index=False).encode('utf-8')
        file_name = f"prontuario_{patient['nome'].replace(' ', '_')}_{datetime.now().strftime('%Y%m%d')}.csv"
        
        c1, c2 = st.columns([1, 3])
        with c1:
            if st.download_button(
                label="📥 Exportar Prontuário Completo",
                data=csv_data,
                file_name=file_name,
                mime="text/csv",
            ):
                st.success("Download iniciado!")


# --- MAIN CONTROLLER ---
if not st.session_state.logged_in:
    login_screen()
else:
    if st.session_state.role == "patient":
        patient_home()
    elif st.session_state.role in ["doctor", "admin"]:
        doctor_dashboard()

# --- FOOTER ---
st.markdown("<br><br>", unsafe_allow_html=True)
st.caption("© 2026 Synthonia v3.3 - Connected Health")
