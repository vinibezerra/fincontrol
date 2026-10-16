# FinControl

> Dashboard financeiro pessoal criado em React para demonstrar interface responsiva, gerenciamento de estado e persistência de dados no navegador.

[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![License](https://img.shields.io/badge/Status-Portfolio-168278)](https://github.com/vinibezerra/fincontrol)

## Sobre o projeto

O **FinControl** é uma aplicação de controle financeiro pessoal focada em uma experiência clara e agradável. A pessoa usuária pode registrar receitas e despesas, acompanhar o saldo, entender onde está gastando e manter as informações salvas entre sessões.

> Os dados ficam somente no `localStorage` do navegador. Nenhuma informação financeira é enviada a um servidor.

## Destaques

- **Dashboard inteligente:** saldo, receitas, despesas e progresso do orçamento mensal.
- **Insights financeiros:** gastos agrupados por categoria, com comparação visual.
- **CRUD completo:** criar, editar e excluir movimentações.
- **Busca e filtros:** encontre registros por descrição, categoria ou tipo.
- **Tema escuro:** preferência salva automaticamente.
- **Persistência local:** dados preservados ao atualizar ou reabrir a página.
- **Design responsivo:** interface adequada para desktop e dispositivos móveis.
- **Acessibilidade básica:** rótulos, foco visível e ações com `aria-label`.

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| [React](https://react.dev/) | Componentização e estado da interface |
| [Vite](https://vite.dev/) | Ambiente de desenvolvimento e build |
| JavaScript | Lógica de transações e cálculos |
| CSS moderno | Layout responsivo, temas e microinterações |
| Web Storage API | Persistência local das transações e do tema |

## Como executar

```bash
# Clone o repositório
git clone https://github.com/vinibezerra/fincontrol.git

# Entre na pasta
cd fincontrol

# Instale as dependências
npm install

# Inicie o ambiente de desenvolvimento
npm run dev
```

Acesse a URL exibida pelo Vite — normalmente `http://localhost:5173`.

### Build de produção

```bash
npm run build
```

## Estrutura do projeto

```text
src/
├── App.jsx       # Interface, estado, cálculos e ações financeiras
├── main.jsx      # Ponto de entrada da aplicação React
└── styles.css    # Design system, responsividade e tema escuro
```

## Próximos passos

- [ ] Gráficos mensais com histórico de evolução
- [ ] Metas financeiras configuráveis
- [ ] Exportação de transações em CSV
- [ ] Autenticação e sincronização com banco de dados
- [ ] Testes automatizados

---

Feito por [Vinícius Bezerra](https://github.com/vinibezerra) para portfólio.
