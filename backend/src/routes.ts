import express from 'express';

//validaacao
import { celebrate, Joi} from 'celebrate';

import multer from 'multer';
import multerconfig from './config/multer';

//controladores
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/itemsController';


const routes = express.Router();

//configuracao do multer
const upload = multer(multerconfig);


const pointsController = new PointsController();
const itemsController = new ItemsController()


//index  show ,create ,upadate , delete 
//Listagem de todos os items que ja estao no banco de dados
routes.get('/items' ,itemsController.index);
  

//Criacao de ponto de coleta POST(criacao)
routes.post(
  '/points',
  upload.single('image'), 
  celebrate({
    //validacao dos campos
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.number().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string().required(),
     })
  },{
    abortEarly: false, //todos os campos para dar mesagem de falha
  }),
  pointsController.create
  );

//listagem por id
routes.get('/points/:id' , pointsController.show);

//Listar de intems filtadros como uf, city e items
routes.get('/points' , pointsController.index);


export default routes;