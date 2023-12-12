const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const User = require('../models/User');

const removeImage = require('../imageUtils/removeImage');


const store = async (req, res) => {

  const { name, email, telefone, minicurriculo, urlsite, curriculo_redesocial, ehPalestrante, password } = req.body;

  let image = null;
  if (req.file && req.file.filename) {
    image = `/imgs/users/${req.file.filename}`;
  }

  try {
    const hash = await bcrypt.hash(password, parseInt(process.env.SALT, 10));
    const newUser = { name, email, image, telefone, minicurriculo, urlsite, curriculo_redesocial, ehPalestrante, password: hash };

    const user = await User.create(newUser);

    if (Number.isInteger(user)) {
      res.status(201).json({ status:"Novo usuário criado."});
      return;
    } else {
      removeImage(image);
      res.status(400).json({ status: "Email inválido."});
      return;
    }

  } catch (err) {
    removeImage(image);
    console.error(err);
  }
};


const editUser = async (req, res) => {
  const idUser = res.locals.ApiUserId;
  const { name, email, telefone } = req.body;
  
  
  let image = null;
  if (req.file && req.file.filename) {
    image = `/imgs/users/${req.file.filename}`;
  }

  //Verifica se o usuario existe:
  const existe = await User.readByID(idUser)
  if (!existe) {
    removeImage(image);
    res.status(404).json({error: "O usuario nao existe!"});
    return;
  }
  
  let oldImage = existe.image;

  if (name == null || email == null || telefone == null || image == null) {
    removeImage(image);
    res.status(400).json({error: "Informacoes faltando no body"});
    return;
  }
  
  
  const dados = { name, email, telefone, image };
  try {
    const updated = await User.update(idUser, dados);
    removeImage(oldImage);
    res.status(200).json({userUpdated:{updated:updated}});
    return;
  } catch (error) {
    removeImage(image);
    res.status(400).json({error: "Novo email nao disponivel!"});
  }
};

const deleteUser = async (req, res) => {

  const idUser = res.locals.ApiUserId;

  //Verifica se o usuario existe:
  const existe = await User.readByID(idUser)

  if (!existe) {
    res.status(404).json({error: "O usuario nao existe!"});
    return;
  }

  try {
    const lastID = await User.destroy(idUser);

    res.status(200).json({response: "Usuário deletado."});
    return;
  } catch (error) {
    res.status(404).json({error: "Nao foi possivel deletar."});
    return;
  }
}

const readAll = async (req, res) => {
  const allUser = await User.readAll(); 

  res.json({users: allUser});
}



const authenticate = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.readByEmail(email);

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const token = await jwt.sign(
        { userId: user.id },
        process.env.SECRET,
        { expiresIn: 3600 } // 1h
      );

      const tokenBearer = `Bearer ${token}`;

      res.set('Authorization', tokenBearer);
      res.json({ token });
    } else {
      console.log('Senha inválida.');
      res.status(401).json({ error: 'Senha inválida.' });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: 'Token inválido ou usuário não cadastrado.' });
  }
};


const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.readByID(id); 
  
    if (user){
      res.status(200).json({user: user});
      console.log("Busca realizada com sucesso\n", user);
      return;
    } else {
      res.status(404).json(`Usuário de id ${id} não encontrado.`);
      console.log(`Busca por usuario de id ${id} falhou: `, user);
      return;
    }
  } catch (error) {
    res.status(500).json("Internal server error.", error);
    console.error(error);
    return;
  }
}

module.exports = { store, authenticate, editUser, deleteUser, readAll, getById };