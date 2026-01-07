import streamlit as st
from supabase import create_client, Client
import re

# Initialize Supabase Client
# Tenta pegar dos secrets, se não tiver, usa mock para não quebrar o app
try:
    SUPABASE_URL = st.secrets["supabase"]["url"]
    SUPABASE_KEY = st.secrets["supabase"]["key"]
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    USE_MOCK = False
except Exception:
    USE_MOCK = True
    # st.warning("⚠️ Supabase credentials not found in secrets. Using Mock Authentication.")

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
        # Mock registration
        return True, "Cadastro realizado com sucesso (Mock)!"
    
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
    # Hardcoded Admin Check
    if email == "Dr.Jader_o_Brabo" and password == "87654321":
        return {
            "user": {"email": email, "user_metadata": {"full_name": "Dr. Jader (Admin)", "role": "admin"}},
            "session": "admin_token"
        }, None

    if USE_MOCK:
        # Mock Login
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
        return None, "Credenciais inválidas (Mock: use senha '12345678')"

    try:
        res = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        return res, None
    except Exception as e:
        return None, str(e)

def send_password_reset(email):
    if USE_MOCK:
        return True, "Email de recuperação enviado (Mock)!"
    
    try:
        supabase.auth.reset_password_email(email)
        return True, "Email de recuperação enviado! Verifique sua caixa de entrada."
    except Exception as e:
        return False, str(e)
