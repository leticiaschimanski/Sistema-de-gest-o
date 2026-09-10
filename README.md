# Sistema de Gestão

Sistema web desenvolvido para gerenciamento de produtos, com autenticação de usuários e controle de acesso.

## Tecnologias utilizadas

- HTML
- CSS
- JavaScript
- Node.js
- Express
- SQLite
- BCrypt
- Express Session

## Funcionalidades

- Cadastro e visualização de produtos
- Validação dos campos
- Consulta e validação de CEP
- Login de usuários
- Autenticação por sessão
- Controle de acesso por perfil
- Perfil Administrador e Usuário Comum
- Cadastro de usuários pelo administrador
- Proteção de rotas administrativas
- Senhas armazenadas com hash BCrypt
- Layout responsivo
- Logo do sistema

## Segurança

O sistema utiliza sessões para controlar o acesso dos usuários.

As senhas não são armazenadas em texto puro. Elas são protegidas utilizando o algoritmo de hash criptográfico BCrypt.

O sistema também possui controle de acesso por perfil, permitindo que somente administradores acessem a área administrativa e cadastrem novos usuários.

## Como executar

1. Instale as dependências:

```bash
npm install
Inicie o servidor:
node server.js
Acesse no navegador:
http://localhost:3000
Principais arquivos
index.html — página principal
login.html — tela de login
admin.html — área administrativa
cadastro-usuario.html — cadastro de usuários
server.js — servidor, autenticação e controle de acesso
database.js — banco de dados
script.js — funcionalidades do sistema
style.css — estilos e responsividade
logo.png — logo do sistema
Testes

Foram realizados testes de login, senha incorreta, controle de acesso, acesso sem autenticação, validação de dados, entrada semelhante a SQL Injection, armazenamento das senhas com BCrypt, exibição do logo e responsividade.

Resultado: 9 testes realizados, 9 aprovados e 0 reprovados.

Projeto acadêmico

Projeto desenvolvido para fins acadêmicos no curso de Gestão da Tecnologia da Informação.