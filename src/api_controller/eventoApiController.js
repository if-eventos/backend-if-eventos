const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const Evento = require('../models/Evento');

const removeImage = require('../imageUtils/removeImage');

const readAll = async (req, res) => {
    const eventos = await Evento.readAll();
    if (eventos) {
        res.status(200).json({evento: eventos});
    } else {
        res.status(404).json({error: "Nenhum Evento encontrado."});
    }
}

const readByID = async (req, res) => {

    const evento = await Evento.readById(req.params.id);
    if (evento) {
        res.status(200).json({evento: evento});
    } else {
        res.status(404).json({error: "Evento não encontrado."});
    }
}

const destroy = async (req, res) => {
    const id = req.params.id;
    const evento = await Evento.readById(id);

  if(evento){

    if (evento.createBy == res.locals.ApiUserId) {

        const lastID = await Evento.destroy(id);

        const { image } = evento;
        removeImage(image);

        res.status(200).json({status: lastID});
        return;
    }

    res.status(401).json({error: "Credenciais invalidas para esse pedido"});
    return;

  } else {
    res.status(404).json({error: "Evento não encontrado."});
    return;
  }
}

const update = async (req, res) => {
    const id = req.params.id;

    const evento = await Evento.readById(id);

    const image = `/imgs/events/${req.file.filename}`;
    
    if (evento) {

        const oldImage = evento.image;

        if(evento.createBy == res.locals.ApiUserId) {
            const { nome, descricao, data_hora, urlsiteoficial } = req.body;
            const dados = { nome, descricao, data_hora, urlsiteoficial, image };

            try {
                const eventoAtualizado = await Evento.update(id, dados);
                removeImage(oldImage);
                res.status(200).json({eventUpdated: {updated: eventoAtualizado}});
                return;
            } catch (error) {
                removeImage(image);
                res.status(400).json({error: "Nome do evento deve ser único."});
                return;
            }

        } else {
            removeImage(image);
            res.status(401).json({error: "Credenciais invalidas para esse pedido"});
            return;
        }
    } else {
        removeImage(image);
        res.status(404).json({error: 'Evento não encontrado!'});
        return;
    }
}

const create = async (req, res) => {
    const { nome, descricao, data_hora, urlsiteoficial } = req.body;
    const createBy = res.locals.ApiUserId;

    const image = `/imgs/events/${req.file.filename}`;

    try{
        
        const evento = { nome, descricao, data_hora, urlsiteoficial, createBy, image }

        const eventoCriado = await Evento.create(evento);
        res.status(200).json({novoEvento: eventoCriado});
    } catch {

        removeImage(image);
        res.status(400).json({error: "Nome do evento deve ser único."});
        return;
    }

}

module.exports = { readAll, readByID, destroy, update, create };