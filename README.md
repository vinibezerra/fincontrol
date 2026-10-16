# FinControl

> Dashboard financeiro pessoal com autenticação, dados privados e sincronização em nuvem.

[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Database-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com/)

## Sobre

O **FinControl** é uma aplicação para controle financeiro pessoal. Cada usuário cria sua própria conta, registra valores reais de receitas e despesas e acessa somente os próprios dados — inclusive em dispositivos diferentes.

O projeto começa vazio: não há valores fictícios. Você decide todas as transações e o limite mensal de gastos.

## Recursos

- Cadastro, login e logout com e-mail e senha
- Dados persistidos no Supabase e protegidos por Row Level Security (RLS)
- Dashboard calculado a partir das suas transações reais
- Criar, editar e excluir receitas e despesas
- Filtros e busca por descrição ou categoria
- Análise de despesas por categoria
- Meta mensal de gastos configurável
- Tema escuro e interface responsiva

## Stack

| Tecnologia | Uso |
| --- | --- |
| React + Vite | Interface e ambiente de desenvolvimento |
| Supabase Auth | Cadastro e login por e-mail/senha |
| Supabase Postgres | Transações e metas financeiras |
| Row Level Security | Privacidade: cada conta acessa somente os próprios dados |
| CSS moderno | Design responsivo e tema escuro |

## Configuração do Supabase

1. Crie uma conta e um projeto em [supabase.com](https://supabase.com/).
2. No painel do projeto, abra **SQL Editor** e execute todo o conteúdo de [schema.sql](./supabase/schema.sql).
3. Em **Project Settings → API**, copie a **Project URL** e a chave **anon public**.
4. Crie um arquivo chamado `.env` na raiz do projeto a partir de [`.env.example`](./.env.example):

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLICA
```

> Nunca publique o arquivo `.env` ou uma chave `service_role`. O projeto já ignora esse arquivo pelo Git.

5. Em **Authentication → Providers → Email**, mantenha o provedor de e-mail habilitado. Para desenvolvimento, você pode desativar a confirmação de e-mail; em produção, deixe-a ativa.

## Executar localmente

```bash
git clone https://github.com/vinibezerra/fincontrol.git
cd fincontrol
npm install
npm run dev
```

Abra a URL indicada pelo Vite, normalmente `http://localhost:5173`.

### Build de produção

```bash
npm run build
```

## Estrutura

```text
src/
├── App.jsx            # Interface, autenticação e operações financeiras
├── lib/supabase.js    # Cliente Supabase
├── main.jsx           # Entrada do React
└── styles.css         # Design system e responsividade
supabase/
└── schema.sql         # Tabelas e políticas de privacidade
```

## Próximas melhorias

- [ ] Gráficos de evolução mensal
- [ ] Exportação CSV
- [ ] Recuperação de senha
- [ ] Testes automatizados

---

Feito por [Vinícius Bezerra](https://github.com/vinibezerra) para portfólio.
