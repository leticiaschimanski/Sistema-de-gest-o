const express = require("express");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("./database");

const app = express();
const PORT = 3000;

// ==========================================
// CONFIGURAÇÕES
// ==========================================

// Permite receber dados dos formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração das sessões
app.use(
    session({
        secret: "chave-secreta-trabalho-gestao",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60
        }
    })
);


// ==========================================
// ARQUIVOS CSS E JAVASCRIPT
// ==========================================

app.get("/style.css", function (req, res) {
    res.sendFile(path.join(__dirname, "style.css"));
});

app.get("/script.js", function (req, res) {
    res.sendFile(path.join(__dirname, "script.js"));
});
app.get("/logo.png", function (req, res) {
    res.sendFile(path.join(__dirname, "logo.png"));
});

// ==========================================
// FUNÇÃO: VERIFICAR LOGIN
// ==========================================

function verificarLogin(req, res, next) {

    if (!req.session.usuario) {
        return res.redirect("/login");
    }

    next();
}


// ==========================================
// FUNÇÃO: VERIFICAR ADMINISTRADOR
// ==========================================

function verificarAdmin(req, res, next) {

    // Se não estiver logado
    if (!req.session.usuario) {
        return res.redirect("/login");
    }

    // Se não for administrador
    if (req.session.usuario.perfil !== "admin") {

        return res.status(403).send(`
            <!DOCTYPE html>

            <html lang="pt-BR">

            <head>
                <meta charset="UTF-8">
                <title>Acesso negado</title>

                <link rel="stylesheet" href="/style.css">
            </head>

            <body>

                <main>

                    <section class="card">

                        <h2>Acesso negado</h2>

                        <p>
                            Você não possui permissão para acessar esta área.
                        </p>

                        <br>

                        <a href="/">
                            Voltar para o sistema
                        </a>

                    </section>

                </main>

            </body>

            </html>
        `);
    }

    next();
}


// ==========================================
// LOGIN
// ==========================================

app.get("/login", function (req, res) {

    // Se já estiver logado, vai direto para o sistema
    if (req.session.usuario) {
        return res.redirect("/");
    }

    res.sendFile(path.join(__dirname, "login.html"));
});


app.post("/login", async function (req, res) {

    const { email, senha } = req.body;

    // Verifica os campos
    if (!email || !senha) {
        return res.send("Preencha o e-mail e a senha.");
    }

    try {

        // Procura o usuário pelo e-mail
        const usuario = db
            .prepare("SELECT * FROM usuarios WHERE email = ?")
            .get(email);

        // Usuário não encontrado
        if (!usuario) {
            return res.send("E-mail ou senha incorretos.");
        }

        // Compara a senha digitada com o hash salvo
        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha
        );

        // Senha incorreta
        if (!senhaCorreta) {
            return res.send("E-mail ou senha incorretos.");
        }

        // Cria a sessão
        req.session.usuario = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            perfil: usuario.perfil
        };

        // Login realizado
        res.redirect("/");

    } catch (erro) {

        console.error(erro);

        res.status(500).send(
            "Erro ao realizar login."
        );
    }
});


// ==========================================
// PÁGINA PRINCIPAL
// ==========================================

app.get("/", verificarLogin, function (req, res) {

    res.sendFile(
        path.join(__dirname, "index.html")
    );
});


// ==========================================
// CADASTRO DE USUÁRIO
// SOMENTE ADMINISTRADOR
// ==========================================

app.get(
    "/cadastro-usuario",
    verificarAdmin,
    function (req, res) {

        res.sendFile(
            path.join(__dirname, "cadastro-usuario.html")
        );
    }
);


app.post(
    "/cadastrar-usuario",
    verificarAdmin,
    async function (req, res) {

        const {
            nome,
            email,
            senha,
            perfil
        } = req.body;

        // Verifica campos
        if (!nome || !email || !senha || !perfil) {

            return res.send(
                "Preencha todos os campos."
            );
        }

        // Verifica o perfil
        if (
            perfil !== "admin" &&
            perfil !== "usuario"
        ) {

            return res.send(
                "Perfil inválido."
            );
        }

        try {

            // Verifica se o e-mail já existe
            const usuarioExistente = db
                .prepare(
                    "SELECT * FROM usuarios WHERE email = ?"
                )
                .get(email);

            if (usuarioExistente) {

                return res.send(
                    "Este e-mail já está cadastrado."
                );
            }

            // ======================================
            // HASH DA SENHA
            // ======================================

            const senhaHash = await bcrypt.hash(
                senha,
                10
            );

            // ======================================
            // SALVA NO BANCO
            // ======================================

            db.prepare(`
                INSERT INTO usuarios
                (nome, email, senha, perfil)
                VALUES (?, ?, ?, ?)
            `).run(
                nome,
                email,
                senhaHash,
                perfil
            );

            res.send(`
                <!DOCTYPE html>

                <html lang="pt-BR">

                <head>

                    <meta charset="UTF-8">

                    <title>Cadastro realizado</title>

                    <link rel="stylesheet" href="/style.css">

                </head>

                <body>

                    <main>

                        <section class="card">

                            <h2>
                                Usuário cadastrado com sucesso!
                            </h2>

                            <p>
                                A senha foi armazenada
                                utilizando hash criptográfico.
                            </p>

                            <br>

                            <a href="/cadastro-usuario">
                                Cadastrar outro usuário
                            </a>

                            <br><br>

                            <a href="/admin">
                                Voltar para área administrativa
                            </a>

                        </section>

                    </main>

                </body>

                </html>
            `);

        } catch (erro) {

            console.error(erro);

            res.status(500).send(
                "Erro ao cadastrar usuário."
            );
        }
    }
);


// ==========================================
// ÁREA ADMINISTRATIVA
// SOMENTE ADMIN
// ==========================================

app.get(
    "/admin",
    verificarAdmin,
    function (req, res) {

        res.sendFile(
            path.join(__dirname, "admin.html")
        );
    }
);


// ==========================================
// LOGOUT
// ==========================================

app.get("/logout", function (req, res) {

    req.session.destroy(function (erro) {

        if (erro) {
            console.error(erro);
        }

        res.redirect("/login");
    });

});


// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, function () {

    console.log(
        `Servidor funcionando em http://localhost:${PORT}`
    );

});