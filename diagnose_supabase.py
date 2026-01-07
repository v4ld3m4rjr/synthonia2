from supabase import create_client, Client
import os

print("--- INICIANDO DIAGNÓSTICO DE CONEXÃO SUPABASE ---")

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
    
    print(f"1. Credenciais Lidas:")
    print(f"   URL: {url}")
    print(f"   KEY: {key[:10]}...{key[-5:] if key else 'None'}")
except Exception as e:
    print(f"ERRO ao ler arquivo de secrets: {e}")
    exit(1)

if not url or not key:
    print("ERRO: URL ou KEY não encontrados no arquivo secrets.toml")
    exit(1)

# 2. Testar Inicialização do Cliente
print("\n2. Tentando inicializar cliente Supabase...")
try:
    supabase: Client = create_client(url, key)
    print("   Cliente inicializado (Syntax OK).")
except Exception as e:
    print(f"ERRO FATAL na inicialização do cliente: {e}")
    exit(1)

# 3. Testar Conexão Real (Ping)
print("\n3. Testando conexão de rede e permissões...")
try:
    # Tenta listar a tabela 'pacientes' (apenas 1 item para ser leve)
    # Se a tabela não existir, vai dar erro de tabela, mas prova que conectou.
    # Se a chave for inválida, vai dar erro de Auth.
    response = supabase.table("pacientes").select("*").limit(1).execute()
    
    print("   SUCESSO! Conexão estabelecida.")
    print(f"   Dados retornados: {response}")
except Exception as e:
    print(f"   FALHA NA CONEXÃO OU CONSULTA:")
    print(f"   Mensagem de Erro: {e}")
    # Tenta identificar o tipo de erro
    e_str = str(e)
    if "JWT" in e_str or "apikey" in e_str:
        print("   -> DIAGNÓSTICO: A 'key' fornecida parece ser inválida ou expirada.")
    elif "not found" in e_str or "relation" in e_str:
        print("   -> DIAGNÓSTICO: Conectou, mas a tabela 'pacientes' não existe no banco.")
    elif "connection" in e_str or "network" in e_str:
        print("   -> DIAGNÓSTICO: Erro de rede. Verifique firewall ou se a URL está correta.")

print("\n--- FIM DO DIAGNÓSTICO ---")
