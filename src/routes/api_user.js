/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     NewUser:
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
 *         image:
 *           type: file
 *           description: Imagem de perfil do usuario.
 *           example: foto.png
 *     User:
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
 *     Ouvinte:
 *       allOf:
 *         - $ref: '#/components/schemas/User'
 *         - type: object
 *     Palestrante:
 *       allOf:
 *         - $ref: '#/components/schemas/User'
 *         - type: object
 *           properties:
 *             minicurriculo:
 *               type: integer
 *               description: ID da comida.
 *               example: Doutorado em Administração
 *             urlsite:
 *               type: string
 *               description: Website do palestrante.
 *               example: www.rafael.com
 *             curriculo_redesocial:
 *               type: string
 *               description: As redes sociais do palestrante.
 *               example: Rafael.com
 *     Login:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: email de um usuario cadastrado logar.
 *           example: usuario@email.com
 *         password:
 *           type: string
 *           description: senha para logar.
 *           example: minhasenha123
 *     Token:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Token de autorização JWT.
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *     UserUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do usuário.
 *           example: Rafael Rodrigo
 *         email:
 *           type: string
 *           description: O email do usuario
 *           example: usuarioatualizado@email.com
 *         telefone:
 *           type: string
 *           description: O numero de contato do usuário
 *           example: 99777-9999
 *     userUpdated:
 *       type: object
 *       properties:
 *         updated:
 *           type: integer
 *           description: Inteiro informando se o procedimento funcionou.
 *           example: 1
 *     badUserUpdated:
 *       type: object
 *       properties:
 *         updated:
 *           type: integer
 *           description: Inteiro informando se o procedimento nao funcionou.
 *           example: 0
 *     getAllUsers:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do usuário.
 *           example: Rafael
 *         telefone:
 *           type: string
 *           description: O numero de contato do usuário
 *           example: 99999-9999
 *         ehPalestrante:
 *           type: integer
 *           description: Valor 1 se o usuario for palestrante, 0 se não
 *           example: 1
 *     GetUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do usuário.
 *           example: Rafael Rodrigo
 *         email:
 *           type: string
 *           description: O email do usuario
 *           example: usuario@email.com
 *         telefone:
 *           type: string
 *           description: O numero de contato do usuário
 *           example: 99777-9999
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
 *         image:
 *           type: string
 *           description: url para buscar foto de perfil.
 *           example: imgs/users/gsjabsabsj.png
 */





const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");
const middleware = require("../middleware/index");
const usersApiController = require("../api_controller/userApiController");


const path = require('path');
const multer = require("multer");
const crypto = require('crypto');
const imagesPath = path.join('public', 'imgs', 'users');

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
 * /api/v1/user/signup:
 *   post:
 *     summary: Cria uma conta na aplicação.
 *     description: Cria uma conta na aplicação. Pode ser usada sem autenticação. Serve tanto para criar um usuário simples e um palestrante.
 *     tags:
 *       - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       201:
 *         description: Novo usuário criado.
 *       400:
 *         description: Email inválido.
 */
router.post('/signup', parser.single('image'), celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        ehPalestrante: Joi.number().required(),
        telefone: Joi.string().min(9),
        minicurriculo: Joi.string(),
        urlsite: Joi.string(),
        curriculo_redesocial: Joi.string(),
    }),
}),
    usersApiController.store
);

/**
 * @swagger
 * /api/v1/user/signin:
 *   post:
 *     summary: Logar na aplicação.
 *     description: Logar na aplicação usando uma conta existente. Pode ser usada sem autenticação.
 *     tags:
 *       - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Usuário autenticado.
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Token'
 */

router.post('/signin', celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
    }), 
}),
    usersApiController.authenticate
);

/**
 * @swagger
 * /api/v1/user/atualizarUser:
 *   patch:
 *     summary: Atualiza o usuário logado
 *     description: Vai atualizar o usuário de acordo com o token de quem fez o login.
 *     tags:
 *       - user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 userUpdated:
 *                   $ref: '#/components/schemas/userUpdated'
 *       400:
 *         description: Informacoes faltando no body ou Novo email nao disponivel!
 *       404:
 *         description: O usuario não existe!
 */

router.patch('/atualizarUser/', middleware.isAPIAuthenticated, parser.single('image'),
celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        telefone: Joi.string().min(8).required(),
    }), 
}), 
usersApiController.editUser);

/**
 * @swagger
 * /api/v1/user/deleteUser:
 *   delete:
 *     summary: Deleta um usuário.
 *     tags:
 *       - user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Usuário deletado.
 *       404:
 *         description: O usuario nao existe!
 */
router.delete('/deleteUser/', middleware.isAPIAuthenticated, usersApiController.deleteUser);

/**
 * @swagger
 * /api/v1/user/todos:
 *   get:
 *     summary: Recupera todos os usuários da aplicação.
 *     description: Recupera todos os usuários da aplicação. Pode ser usada sem autenticação.
 *     tags:
 *       - user
 *     responses:
 *       200:
 *         description: Todos os usuários.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/getAllUsers'
 */
router.get('/todos', usersApiController.readAll);


/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     summary: Recupera um usuário da aplicação pelo id.
 *     description: Recupera um usuário pelo id. Pode ser usada sem autenticação.
 *     tags:
 *       - user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico do user a ser recuperado.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Busca realizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/GetUser'
 *       404:
 *         description: Usuário de id ${id} não encontrado.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id', usersApiController.getById);

module.exports = router;