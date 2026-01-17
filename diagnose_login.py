from supabase import create_client, Client
import os

print("--- DIAGNÓSTICO DE LOGIN SUPABASE ---")

# 1. Ler Credenciais
url = ""
key = ""
try:
    with open(".streamlit/secrets.toml", "r") as f:
        for line in f:
            if "url" in line and "=" in line:
                parts = line.split("=")
                if len(parts) > 1:
                    url = parts[1].strip().strip('"').strip("'")
            if "key" in line and "=" in line:
                parts = line.split("=")
                if len(parts) > 1:
                    key = parts[1].strip().strip('"').strip("'")
except Exception as e:
    print(f"ERRO ao ler secrets: {e}")
    exit(1)

supabase: Client = create_client(url, key)

# 2. Testar Login com Credenciais Padrão (Mock vs Real)
email = "teste@email.com" # Substitua pelo email que o usuário está tentando usar se souber
password = "12345678"     # Senha que o usuário disse que está usando

print(f"Tentando login para: {email} com senha padrão...")

try:
    res = supabase.auth.sign_in_with_password({
        "email": email,
        "password": password
    })
    print("SUCESSO! Login realizado.")
    print(f"User ID: {res.user.id}")
except Exception as e:
    print(f"FALHA NO LOGIN:")
    print(f"Erro: {e}")
    
    e_str = str(e)
    if "Invalid login credentials" in e_str:
        print("-> CAUSA: Email não existe ou senha incorreta no Supabase REAL.")
    elif "Email not confirmed" in e_str:
        print("-> CAUSA: O usuário existe, mas precisa confirmar o email antes de logar.")

print("--- FIM ---")
