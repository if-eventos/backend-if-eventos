/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         idEvento:
 *           type: integer
 *           description: id do evento
 *           exemplo: 2
 *         idOuvinte:
 *           type: integer
 *           description: id do ouvinte
 *           exemplo: 4
 *         id:
 *           type: integer
 *           description: id do usuario
 *           exemplo: 4
 *         name:
 *           type: string
 *           description: Nome do usuário.
 *           example: Rafael
 *         email:
 *           type: string
 *           description: O email do usuario
 *           example: usuario@email.com
 *         telefone:
 *           type: string
 *           description: O numero de contato do usuário
 *           example: 99999-9999
 *         password:
 *           type: string
 *           description: A senha para o usuario conseguir logar.
 *           example: minhasenha123
 *         ehPalestrante:
 *           type: integer
 *           description: Valor 1 se o usuario for palestrante, 0 se não
 *           example: 1
 *         minicurriculo:
 *            type: integer
 *            description: ID da comida.
 *            example: Doutorado em Administração
 *         urlsite:
 *           type: string
 *           description: Website do palestrante.
 *           example: www.rafael.com
 *         curriculo_redesocial:
 *           type: string
 *           description: As redes sociais do palestrante.
 *           example: Rafael.com
 *     UserOuvintes:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: id do usuario
 *           exemplo: 4
 *         name:
 *           type: string
 *           description: Nome do usuário.
 *           example: Rafael
 *         telefone:
 *           type: string
 *           description: O numero de contato do usuário
 *           example: 99999-9999
 *         email:
 *           type: string
 *           description: O email do usuario
 *           example: usuario@email.com
 *       
 */

const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");
const middleware = require("../middleware/index");
const ouvinteApiController = require("../api_controller/ouvinteApiController");


/**
 * @swagger
 * /api/v1/ouvinte/adicionar/{idEvento}:
 *   post:
 *     summary: Adicionar ouvinte.
 *     description: Adicionar o usuário atual como ouvinte de algum evento.
 *     tags:
 *       - ouvinte
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         description: ID numérico do evento que o usuario quer participar como ouvinte.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario adicionado como ouvinte.
 *       400:
 *         description: Usuario já cadastrado como ouvinte.
 *       404:
 *         description: Evento não encontrado.
 */
//adicionar usuario atual como ouvinte em um evento:
router.post('/adicionar/:idEvento', middleware.isAPIAuthenticated, ouvinteApiController.adicionar);


/**
 * @swagger
 * /api/v1/ouvinte/deletar/{idEvento}:
 *   delete:
 *     summary: Remover ouvinte.
 *     description: Remover o usuário atual dos ouvintes de algum evento.
 *     tags:
 *       - ouvinte
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         description: ID numérico do evento em que o usuario quer sair dos ouvintes.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario removido dos ouvintes.
 *       400:
 *         description: Usuario não está cadastrado como ouvinte.
 *       404:
 *         description: Evento não encontrado.
 *       500:
 *         description: Erro interno do Servidor.
 */
//remover usuario atual dos ouvintes de um evento:
router.delete('/deletar/:idEvento', middleware.isAPIAuthenticated, ouvinteApiController.deletar);


/**
 * @swagger
 * /api/v1/ouvinte/readAll/{idEvento}:
 *   get:
 *     summary: Recupera todos os ouvintes de um evento.
 *     description: Recupera todos os ouvintes de um evento. Pode ser usada sem autenticação.
 *     tags:
 *       - ouvinte
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         description: ID numérico do evento em que o usuario quer recuperar ouvintes.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Todos os ouvintes do evento.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserOuvintes'
 */
router.get('/readAll/:idEvento', ouvinteApiController.readAll);

module.exports = router;