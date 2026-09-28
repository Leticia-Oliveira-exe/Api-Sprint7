const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

const corsOptions = {
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.use(express.static(path.join(__dirname)));

const usuariosSalvos = [
    {
        nome: "admin",
        senha: "123456",
        email: "admin@email.com"
    }
];

app.post("/cadastro", (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({
            message: "Preencha todos os campos!"
        });
    }

    const usuarioExiste = usuariosSalvos.find(
        u => u.email === email
    );

    if (usuarioExiste) {
        return res.status(400).json({
            message: "Este e-mail já está cadastrado!"
        });
    }

    usuariosSalvos.push({
        nome,
        email,
        senha
    });

    console.log("Usuários cadastrados:", usuariosSalvos);

    return res.status(201).json({
        message: "Usuário cadastrado com sucesso!"
    });
});

app.post("/login", (req, res) => {
    const { nome, senha } = req.body;

    console.log("Tentativa de login:", { nome });

    if (!nome || !senha) {
        return res.status(400).json({
            message: "Usuário e senha são obrigatórios!"
        });
    }

    const usuarioEncontrado = usuariosSalvos.find(
        u => u.nome === nome && u.senha === senha
    );

    if (!usuarioEncontrado) {
        return res.status(401).json({
            message: "Usuário ou senha incorretos!"
        });
    }

    return res.status(200).json({
        id: usuariosSalvos.indexOf(usuarioEncontrado) + 1,
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email
    });
});

app.listen(3001, () => {
    console.log("API rodando em http://localhost:3001");
});