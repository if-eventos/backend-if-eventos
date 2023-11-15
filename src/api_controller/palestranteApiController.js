const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const User = require('../models/User');
const Ouvinte = require('../models/Ouvintes');
const Evento = require('../models/Evento');
const Palestrante = require('../models/Palestrante');


const readAll = async (req, res) => {
    try {
        const allPalestrantes = await Palestrante.todosPalestrantes();
        res.status(200).json({palestrantes:allPalestrantes});
    } catch (error) {
        res.status(500).json({error: "Erro interno!"});
    }
}

const readAllEvento = async (req, res) => {
    const id = req.params.idEvento;
    
    try {
        const evento = await Evento.readById(id);
    
        if (evento) {
            const result = await Palestrante.todosPalestrantesEvento(id);
    
            const palestranteEvento = [];
            for(element of result) {
                const {idEvento, idPalestrante, ...palestrante} = element;
                palestranteEvento.push(palestrante);
            }
    
            res.status(200).json({palestrantes:palestranteEvento});
        } else {
            res.status(404).json({error:"Evento não encontrado"});
        }
    } catch (error) {
        res.status(500).json({erro: "Erro interno!"});
    }
}

const adicionar = async (req, res) => {
    const idEvento = req.params.idEvento;
    const idUser = req.params.idUser;

    try {
        const evento = await Evento.readById(idEvento);
        const user = await User.readByID(idUser);


        if (!evento || !user) {
            res.status(404).json({error:"Palestrante ou evento não cadastrado."});
            return;
        }


        if (evento.createBy !== res.locals.ApiUserId) {
            res.status(401).json({error: "Usuario nao autorizado"});
            return;
        }


        try {
            const result = await Palestrante.adicionarPalestrante({idEvento:evento.id, emailUser:user.email});
            
            res.status(200).json({status:"Palestrante adicionado com sucesso no Evento"});
            return;

        } catch (error) {
            res.status(409).json({error:"Palestrante já cadastrado no Evento"});
            return;
        }

    } catch (error) {
        console.error("Erro ao adicionar palestrante:", error);
        res.status(500).json({error: "Erro interno do servidor"});
        return;
    }
}

const remover = async (req, res) => {
    const idEvento = req.params.idEvento;
    const idUser = req.params.idUser;
    
    
    try {

        const evento = await Evento.readById(idEvento);
        const user = await User.readByID(idUser);

        if (evento && user) {

            if (evento.createBy !== res.locals.ApiUserId) {
                res.status(401).json({error: "Usuário não autorizado"});
                return;
            }

            const todosPalestrante = await Palestrante.todosPalestrantesEvento(evento.id);

            const userEhPalestrante = todosPalestrante.find((p) => p.id === user.id);

            if (userEhPalestrante) {
                const result = await Palestrante.removerPalestrante(user.email, idEvento);
                res.status(200).json({status:"Palestrante removido com sucesso!"});
                return;
            } else {
                res.status(409).json({error:"Palestrante nao esta adicionado no evento."});
                return;
            }
            
        } else {
            res.status(404).json({error:"Palestrante ou evento não cadastrado."});
            return;
        }

    } catch (error) {
        res.status(500).json({error:"Erro interno servidor."});
        return;
    }
}

module.exports = { readAll, readAllEvento, adicionar, remover };