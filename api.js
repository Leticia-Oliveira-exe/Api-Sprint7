const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));

// 📁 BANCO DE DADOS EM MEMÓRIA: Guarda os novos cadastros reativamente durante a execução do servidor
const usuariosSalvos = [
    { nome: "admin", senha: "123456", email: "admin@email.com" } // Mantém o admin padrão ativo para testes rápidos
];

// ==========================================================================
// 🚀 ROTA 1: CADASTRO DE NOVOS USUÁRIOS (POST)
// ==========================================================================
app.post("/cadastro", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !senha || !email) {
            return res.status(400).json({
                message: "Por favor, preencha todos os campos obrigatórios!"
            });
        }

        // Evita a duplicidade de e-mails cadastrados no sistema
        const usuarioExiste = usuariosSalvos.find(u => u.email === email);
        if (usuarioExiste) {
            return res.status(400).json({
                message: "Este e-mail já está cadastrado!"
            });
        }

        // Salva o novo objeto de usuário no banco em memória
        const novoUsuario = { nome, email, senha };
        usuariosSalvos.push(novoUsuario);
        
        console.log("Novo usuário salvo com sucesso no Node:", novoUsuario);

        // Retorna a propriedade .message exata que o seu cadastro.ts do Angular espera no alert()
        return res.status(201).json({
            message: "Usuário cadastrado com sucesso!"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Falha ao realizar cadastro no servidor!",
            error: String(error)
        });
    }
});

// ==========================================================================
// 🚀 ROTA 2: AUTENTICAÇÃO / LOGIN DE USUÁRIOS (POST)
// ==========================================================================
app.post("/login", async (req, res) => {
    try {
        const { nome, senha } = req.body;

        if (!nome || !senha) {
            return res.status(400).json({
                message: "O campo de usuário ou senha não foi preenchido!"
            });
        }

        // Varre a lista em memória procurando tanto o admin quanto novos usuários vindos da tela de Cadastro
        const usuarioEncontrado = usuariosSalvos.find(u => u.nome === nome && u.senha === senha);

        if (!usuarioEncontrado) {
            return res.status(401).json({
                message: "O nome de usuário ou senha está incorreto ou não foi cadastrado!"
            });
        }

        // Retorna sucesso para o Angular se as credenciais baterem com o banco local
        return res.status(200).json({
            id: usuariosSalvos.indexOf(usuarioEncontrado) + 1,
            nome: usuarioEncontrado.nome,
            email: usuarioEncontrado.email || `${usuarioEncontrado.nome}@email.com`
        });

    } catch (error) {
        return res.status(500).json({
            message: "Falha na comunicação com o servidor!",
            error: String(error)
        });
    }
});

// Inicialização estável do servidor na porta 3001
app.listen(3001, () => {
    console.log("API rodando e protegida em http://localhost:3001/");
});