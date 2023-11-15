const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const User = require('../models/User');
const Ouvinte = require('../models/Ouvintes');
const Evento = require('../models/Evento');


const adicionar = async (req, res) => {
    const id = req.params.idEvento;
    const idEvento = await Evento.readById(id);

    if(idEvento) {
        const {email} = await User.readByID(res.locals.ApiUserId);
        try {
            const result = await Ouvinte.adicionarOuvinte({emailUser:email, idEvento:id});
            res.status(200).json({status: "Usuario adicionado como ouvinte."});
            return;
        } catch (error) {
            res.status(400).json({error:"Usuario já cadastrado como ouvinte"});
            return;
        }
    } else {
        res.status(404).json({error:"Evento não encontrado."});
        return;
    }
}

const deletar = async (req, res) => {
    try {
        const idEvento = await Evento.readById(req.params.idEvento)
        .then(e => {
            if (e) return e.id
        })
        if(!idEvento) {
            res.status(404).json({error:"Evento não encontrado."});
            return;
        };
    
        const {email} = await User.readByID(res.locals.ApiUserId);

        const eventosParticipando = await Ouvinte.readAllByUser(res.locals.ApiUserId);
        
        if(eventosParticipando.lenght <= 0){
            res.status(400).json({error: "Usuario não está cadastrado como ouvinte"});
            return;
        }
        const eventoCerto = eventosParticipando.find(evento => evento.idEvento == idEvento);

        if(eventoCerto && eventoCerto.idEvento == idEvento) {
            const result = await Ouvinte.removerOuvinte(email, idEvento);

            res.status(200).json({status: "Usuario removido dos ouvintes."});
            return;
        }

        res.status(400).json({error:"Usuario não está cadastrado como ouvinte"});
        return;
    
    } catch (error) {
        res.status(500).json({error:"Erro interno do Servidor"});
        return;
    }
}

const readAll = async (req, res) => {
    const id = req.params.idEvento;
    const idEvento = await Evento.readById(id);

    if(idEvento) {
        try {
            const result = await Ouvinte.todosOuvintesEvento(id);
            res.status(200).json({user:result});
        } catch (error) {
            res.status(400).json({error:"Nenhum ouvinte do neste evento."});
        }
    } else {
        res.status(404).json({error:"Evento não encontrado."});
    }
}


module.exports = { adicionar, deletar, readAll };