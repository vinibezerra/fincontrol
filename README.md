# FinControl

Um dashboard de controle financeiro pessoal criado para portfólio. Registre receitas e despesas, acompanhe o saldo e filtre suas movimentações.

> O projeto salva os dados localmente no navegador; nenhuma informação é enviada a servidores.

## Funcionalidades

- Resumo automático de saldo, receitas e despesas
- Cadastro de transações com descrição, valor, tipo, categoria e data
- Filtro por todas as transações, receitas ou despesas
- Exclusão de movimentações
- Persistência no `localStorage`
- Interface responsiva para desktop e celular

## Tecnologias

- React
- JavaScript
- Vite
- CSS responsivo
- Web Storage API (`localStorage`)

## Como executar localmente

```bash
# Clone o repositório
git clone https://github.com/SEU-USUARIO/fincontrol.git

# Entre na pasta
cd fincontrol

# Instale as dependências
npm install

# Inicie o projeto
npm run dev
```

Depois, abra a URL indicada pelo Vite no navegador, normalmente `http://localhost:5173`.

## Estrutura

```text
src/
├── App.jsx       # Componentes e regras de negócio
├── main.jsx      # Entrada do React
└── styles.css    # Estilos responsivos
```

## Próximas melhorias

- [ ] Editar transações
- [ ] Gráficos por categoria
- [ ] Tema escuro
- [ ] Login e sincronização com banco de dados
- [ ] Testes automatizados

## Autor

Feito por **SEU NOME** como projeto de portfólio.
