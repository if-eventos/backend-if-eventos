/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     AllPalestrante:
 *       type: object
 *       properties:
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
 *           type: integer
 *           description: ID da comida.
 *           example: Doutorado em Administração
 *         urlsite:
 *           type: string
 *           description: Website do palestrante.
 *           example: www.rafael.com
 *         curriculo_redesocial:
 *           type: string
 *           description: As redes sociais do palestrante.
 *           example: Rafael.com
 *     GetAllPalestrante:
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
 *         password:
 *         minicurriculo:
 *           type: integer
 *           description: ID da comida.
 *           example: Doutorado em Administração
 *         urlsite:
 *           type: string
 *           description: Website do palestrante.
 *           example: www.rafael.com
 *         curriculo_redesocial:
 *           type: string
 *           description: As redes sociais do palestrante.
 *           example: Rafael.com
 */



const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");
const middleware = require("../middleware/index");
const palestranteApiController = require("../api_controller/palestranteApiController");



/**
 * @swagger
 * /api/v1/palestrante/readAll:
 *   get:
 *     summary: Recupera todos os palestrantes da aplicação.
 *     description: Recupera todos os palestrantes da aplicação. Pode ser usada sem autenticação.
 *     tags:
 *       - palestrante
 *     responses:
 *       200:
 *         description: Todos os palestrantes.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 palestrantes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GetAllPalestrante'
 *       500:
 *         description: Erro interno!
 */
router.get('/readAll', palestranteApiController.readAll);


/**
 * @swagger
 * /api/v1/palestrante/readAll/{idEvento}:
 *   get:
 *     summary: Recupera todos os palestrantes de um evento.
 *     description: Recupera todos os palestrantes de um evento. Pode ser usada sem autenticação.
 *     tags:
 *       - palestrante
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         description: ID numérico do evento em que o usuario quer recuperar os palestrantes.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Todos os palestrantes de um evento.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 palestrantes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GetAllPalestrante'
 *       404:
 *         description: Evento não encontrado.
 */
router.get('/readAll/:idEvento', palestranteApiController.readAllEvento);


/**
 * @swagger
 * /api/v1/palestrante/adicionar/{idEvento}/{idUser}:
 *   post:
 *     summary: Adiciona um palestrante ao evento.
 *     description: Adiciona um palestrante ao evento.
 *     tags:
 *       - palestrante
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         description: ID numérico do Evento.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idUser
 *         required: true
 *         description: ID numérico do palestrante que será adicionado.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Palestrante adicionado com sucesso no Evento.
 *       409:
 *         description: Palestrante já cadastrado no Evento.
 *       401:
 *         description: Usuario nao autorizado.
 *       404:
 *         description: Palestrante ou evento não cadastrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/adicionar/:idEvento/:idUser', middleware.isAPIAuthenticated, palestranteApiController.adicionar);


/**
 * @swagger
 * /api/v1/palestrante/remover/{idEvento}/{idUser}:
 *   delete:
 *     summary: Remove um palestrante do evento.
 *     description: Remove um palestrante do evento.
 *     tags:
 *       - palestrante
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         description: ID numérico do Evento.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idUser
 *         required: true
 *         description: ID numérico do palestrante que será removido.
 *         schema:
 *           type: integer
 *     responses:
 *       401:
 *         description: Usuário não autorizado.
 *       200:
 *         description: Palestrante removido com sucesso!
 *       409:
 *         description: Palestrante nao esta adicionado no evento.
 *       404:
 *         description: Palestrante ou evento não cadastrado.
 *       500:
 *         description: Erro interno servidor.
 */
router.delete('/remover/:idEvento/:idUser', middleware.isAPIAuthenticated, palestranteApiController.remover);

module.exports = router;












