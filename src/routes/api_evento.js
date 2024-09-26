/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Evento:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do evento.
 *           example: Acolhimento
 *         descricao:
 *           type: string
 *           description: A descrição do evento
 *           example: Evento de acolhimento dos novos alunos.
 *         data_hora:
 *           type: date
 *           description: A data em que o evento ocorrerá,
 *           example: 2023-09-25
 *         local_ou_link:
 *           type: string
 *           description: O site do evento.
 *           example: www.evento.com
 *         categoria:
 *           type: string
 *           description: A categoria do evento.
 *           example: educacao
 *         createBy:
 *           type: integer
 *           description: Id do usuário que criou o evento.
 *           example: 2
 *     eventoUpdated:
 *       type: object
 *       properties:
 *         updated:
 *           type: integer
 *           description: Inteiro informando se o procedimento funcionou.
 *           example: 1
 *     POSTEvento:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do evento.
 *           example: Acolhimento
 *         descricao:
 *           type: string
 *           description: A descrição do evento
 *           example: Evento de acolhimento dos novos alunos.
 *         data_hora:
 *           type: date
 *           description: A data em que o evento ocorrerá,
 *           example: 2023-09-25
 *         local_ou_link:
 *           type: string
 *           description: O site do evento.
 *           example: www.evento.com
 *         categoria:
 *           type: string
 *           description: A categoria do evento.
 *           example: educacao
 *         latitude:
 *           type: string
 *           description: A latitude do evento.
 *           example: -6.3791927
 *         longitude:
 *           type: string
 *           description: A longitude do evento.
 *           example: -38.87812781
 *         image:
 *           type: file
 *           description: A imagem do evento.
 *           example: banner.png
 *     AtualizarEvento:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do evento.
 *           example: Acolhimento Atual
 *         descricao:
 *           type: string
 *           description: A descrição do evento
 *           example: A nova descrição do evento
 *         data_hora:
 *           type: date
 *           description: A data em que o evento ocorrerá,
 *           example: 2023-10-25
 *         local_ou_link:
 *           type: string
 *           description: O site do evento.
 *           example: www.evento2.com
 *         categoria:
 *           type: string
 *           description: A categoria do evento.
 *           example: educacao
 *         image:
 *           type: file
 *           description: Nova imagem do evento.
 *           example: newImage.png
 *     New:
 *       type: object
 *       properties:
 *          novoEvento:
 *           type: integer
 *           description: O id do evento criado.
 *           example: 6
 */
const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");
const middleware = require("../middleware/index");
const eventoApiController = require("../api_controller/eventoApiController");

const path = require('path');
const multer = require("multer");
const crypto = require('crypto');
const imagesPath = path.join('public', 'imgs', 'events');

const parser = multer({
    storage: multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, imagesPath);
      },
      filename: function (req, file, callback) {
        const fileName = `${crypto.randomBytes(16).toString('hex')}-${file.originalname}`;
        callback(null, fileName);
      },
    }),
});


/**
 * @swagger
 * /api/v1/evento/todos:
 *   get:
 *     summary: Recupera todos os eventos da aplicação.
 *     description: Recupera todos os eventos da aplicação. Pode ser usada sem autenticação.
 *     tags:
 *       - evento
 *     responses:
 *       200:
 *         description: Todos os eventos.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 evento:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Evento'
 */
router.get('/todos', eventoApiController.readAll);


/**
 * @swagger
 * /api/v1/evento/todos/{id}:
 *   get:
 *     summary: Recupera um único evento.
 *     description: Recupera um único evento pelo ID. Pode ser usada sem autenticação.
 *     tags:
 *       - evento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico do evento a ser recuperado.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evento encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 evento:
 *                   $ref: '#/components/schemas/Evento'
 */
router.get('/todos/:id', eventoApiController.readByID);


/**
 * @swagger
 * /api/v1/evento/delete/{id}:
 *   delete:
 *     summary: Deleta um evento.
 *     tags:
 *       - evento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico do evento a ser deletado.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evento deletado.
 *       401:
 *         description: Credenciais invalidas para esse pedido. O usuario deve ser o criador do evento para poder deletar.
 *       404:
 *         description: Evento não encontrado.O evento já foi excluido, ou nunca existiu.
 */
router.delete('/delete/:id', middleware.isAPIAuthenticated, celebrate({
    
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),

}), eventoApiController.destroy);


/**
 * @swagger
 * /api/v1/evento/atualize/{id}:
 *   patch:
 *     summary: Atualiza um evento
 *     description: Atualiza algum evento através do id informado.
 *     tags:
 *       - evento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico do evento que será atualizado.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtualizarEvento'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 eventUpdated:
 *                   $ref: '#/components/schemas/eventoUpdated'
 *       401:
 *         description: Credenciais invalidas para esse pedido. O usuario deve ser o criador do evento para poder deletar.
 *       404:
 *         description: Evento não encontrado.O evento já foi excluido, ou nunca existiu.
 *       400:
 *         description: Nome do evento deve ser único.
 */
router.patch('/atualize/:id', middleware.isAPIAuthenticated, parser.single('image'), celebrate({
    
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required(),
        descricao: Joi.string().required(),
        data_hora: Joi.string().required(),
        local_ou_link: Joi.string().required(),
    }),

}), eventoApiController.update);


/**
 * @swagger
 * /api/v1/evento/criar:
 *   post:
 *     summary: Cria um novo evento.
 *     security:
 *       - bearerAuth: []
 *     description: Cria um novo evento. É necessário estar autenticado na aplicação.
 *     tags:
 *       - evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/POSTEvento'
 *     responses:
 *       200:
 *         description: Novo evento criado.
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/New'
 *       400:
 *         description: Nome do evento deve ser único.
 */
router.post('/criar', 
    middleware.isAPIAuthenticated,
    parser.single('image'), 
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required(),
        descricao: Joi.string().required(),
        data_hora: Joi.string().required(),
        local_ou_link: Joi.string().required(),
        categoria: Joi.string().required(),
        latitude: Joi.string(),
        longitude: Joi.string(),
      }),
    }),
    eventoApiController.create);


    /**
 * @swagger
 * /api/v1/evento/inscritos/:
 *   get:
 *     summary: Cria um novo evento.
 *     security:
 *       - bearerAuth: []
 *     description: Puxa todos os eventos que o user está inscrito pelo id dele.
 *     tags:
 *       - evento
 *     responses:
 *       200:
 *         description: Eventos encontrados.
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Evento'
 *       400:
 *         description: usuario nao existe!
 */
router.get('/inscritos', 
  middleware.isAPIAuthenticated,
  eventoApiController.eventosParticipandoUser);

router.get('/user/:id', middleware.isAPIAuthenticated, async (req, res) => {
    try {
        const idUser = req.params.id; // Obter ID do usuário da rota
        const eventos = await eventoApiController.readAllByUser(idUser); // Chamar função do controller
        res.json({ eventos }); // Retornar eventos em formato JSON
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        res.status(500).json({ error: 'Erro ao buscar eventos.' });
    }
});


module.exports = router;