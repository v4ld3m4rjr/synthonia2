import streamlit as st
from supabase import create_client, Client
import re

# Initialize Supabase Client
try:
    SUPABASE_URL = st.secrets["supabase"]["url"]
    SUPABASE_KEY = st.secrets["supabase"]["key"]
    
    # Validate configuration exists
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase credentials missing")

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Optional: Simple health check to ensure connection (e.g., checking auth health)
    # This is lightweight and catches bad keys early
    # supabase.auth.get_session() 
    
    USE_MOCK = False
except Exception as e:
    print(f"[AUTH ERROR] Failed to connect to Supabase: {e}")
    USE_MOCK = True
    # st.error(f"⚠️ Erro de conexão com banco de dados. Usando modo offline (Mock). Detalhes: {e}")

def is_valid_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

def check_password_strength(password):
    if len(password) < 8:
        return False, "A senha deve ter pelo menos 8 caracteres."
    if not re.search(r"[A-Z]", password):
        return False, "A senha deve conter pelo menos uma letra maiúscula."
    if not re.search(r"[a-z]", password):
        return False, "A senha deve conter pelo menos uma letra minúscula."
    if not re.search(r"\d", password):
        return False, "A senha deve conter pelo menos um número."
    return True, "Senha forte."

def register_user(email, password, name, role, medico=None):
    if USE_MOCK:
        _ensure_mock_db()
        # Save to session state for temporary testing
        st.session_state.mock_users[email] = {
            "password": password,
            "full_name": name,
            "role": role,
            "medico": medico
        }
        return True, f"Cadastro realizado com sucesso (Mock)! Aviso: Banco de dados offline. Motivo: {INIT_ERROR}"
    
    try:
        # 1. Sign up user in Auth
        res = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "full_name": name,
                    "role": role,
                    "medico": medico
                }
            }
        })
        
        # 2. Insert into 'pacientes' table if role is patient
        # Note: In a real app, you might use a Trigger in Supabase to do this automatically
        if role == 'patient' and res.user:
             supabase.table('pacientes').insert({
                 "id": res.user.id,
                 "nome": name,
                 "email": email,
                 "medico_responsavel": medico
             }).execute()
             
        return True, "Cadastro realizado com sucesso! Verifique seu email para confirmar."
        
    except Exception as e:
        return False, str(e)

def login_user(email, password):
    # Hardcoded Dr. Jader Check (Pre-registered Admin/Doctor)
    if email == "Dr.Jader_o_Brabo" and password == "87654321":
        # Simulate Creation Log (would normally be in DB logs)
        print(f"[LOG] Acesso de Médico Registrado: Dr. Jader (O Brabo) em {datetime.now()}")
        
        return {
            "user": {
                "email": email, 
                "user_metadata": {
                    "full_name": "Dr. Jader (O Brabo)", 
                    "role": "doctor",
                    "specialty": "Psiquiatria Intervencionista",
                    "crm": "CRM-SP 123456",
                    "contact": "dr.jader@synthonia.com",
                    "hours": "Seg-Sex 14h-20h"
                }
            },
            "session": "jader_secure_token"
        }, None

    if USE_MOCK:
        if '_ensure_mock_db' in globals():
            _ensure_mock_db()
        else:
            # Fallback definition if somehow missing in scope
            if 'mock_users' not in st.session_state:
                st.session_state.mock_users = {}

        # Check Session State Mock Users first
        if email in st.session_state.mock_users:
            user_data = st.session_state.mock_users[email]
            if user_data['password'] == password:
                return {
                    "user": {
                        "email": email,
                        "user_metadata": {
                            "full_name": user_data['full_name'],
                            "role": user_data['role'],
                            "medico": user_data.get('medico', 'N/A')
                        }
                    },
                    "session": f"mock_token_{email}"
                }, None
            else:
                return None, "Senha incorreta (Mock)"

        # Default Mock Fallback
        if password == "12345678":
            return {
                "user": {
                    "email": email, 
                    "user_metadata": {
                        "full_name": "Usuário Teste", 
                        "role": "doctor" if "medico" in email or "valdemarjunior" in email else "patient",
                        "medico": "Dr. Silva"
                    }
                },
                "session": "mock_token"
            }, None
        return None, "Credenciais inválidas. (Mock: Se acabou de cadastrar, use sua senha. Senão, use '12345678')"

    try:
        res = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        return res, None
    except Exception as e:
        # Check specifically for connection errors to provide better feedback
        error_msg = str(e)
        print(f"[LOGIN ERROR] Supabase Auth Failed: {error_msg}")
        
        if "Failed to connect" in error_msg or "Max retries exceeded" in error_msg:
             return None, "Erro de conexão com o servidor. Verifique sua internet."
        
        if "Invalid login credentials" in error_msg:
             return None, "Email ou senha incorretos."

        if "Email not confirmed" in error_msg:
             return None, "Seu email ainda não foi confirmado. Verifique sua caixa de entrada."
             
        return None, f"Erro no login: {error_msg}"

def send_password_reset(email):
    if USE_MOCK:
        return True, "Email de recuperação enviado (Mock)!"
    
    try:
        supabase.auth.reset_password_email(email)
        return True, "Email de recuperação enviado! Verifique sua caixa de entrada."
    except Exception as e:
        return False, str(e)
