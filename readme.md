# Desafio Técnico Afya

Este projeto foi desenvolvido como parte de um desafio técnico da empresa **Afya**.

---

## Configuração do Ambiente

Antes de iniciar, é necessário configurar o arquivo `.env`. Siga os passos abaixo:

### 1. Criar o arquivo `.env`

- Baseie-se no arquivo `.env.example`.
- Para este desafio, os dados utilizados no projeto são:

```env
    DATABASE_URL=https://dztajxgfvpdqdsfwtrro.supabase.co
    API_KEY=sb_secret_vreIflR2ETy0LQjh9cqCXw_9QCMPNNw
    PORT=4000
```

Observação: Normalmente, as informações do .env são confidenciais, mas para fins deste desafio, os valores estão disponíveis aqui.

### 2. Instalar dependências

No terminal, execute:

```
    npm install
```

Isso instalará todas as bibliotecas necessárias para o projeto.

### 3. Iniciar o servidor

Execute o comando:

```
    npm start
```

O servidor será iniciado na porta definida no .env (por padrão, 4000).

### 3.1. Rodar os testes

Com o servidor em execução, execute:

```
    npm test
```

Isso executará todos os testes do projeto.

Pronto! O ambiente está configurado e o projeto está pronto para uso.
