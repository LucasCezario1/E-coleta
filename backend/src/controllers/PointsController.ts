import { Request, Response} from 'express';
import Knex from '../database/connection';

class PointsController {

//lisatgem de todas query parms para fazer filtagrem
async index(req: Request , res: Response){
  const {city , uf , items} = req.query;

  const parsedItems = String(items)
  .split(',')
  .map(item => Number(item.trim()));


  //select com join 
  const points = await Knex('points')
    .join('point_items' , 'points.id', '=','point_items.point_id')
    .whereIn('point_items.item_id' , parsedItems)
    .where('city' , String(city))
    .where('uf', String(uf))
    .distinct()
    .select('points.*');

   // aonde a imagem vai
  const serializedPoints = points.map(point => {
    return{
      ...point,
      image_url: `http://192.168.0.12:3333/uploads/${point.image}`
    };
  });

    return res.json(serializedPoints);
}

  //Buscar por id especificamente
  async show(req: Request , res: Response){
    const {id } = req.params;

    const point = await Knex('points').where('id',id).first();

    if(!point){
      return res.status(400).json({error: 'Point not fount'});
    }
    // aonde a imagem vai
    const serializedPoint = {
        ...point,
        image_url: `http://192.168.0.12:3333/uploads/${point.image}`
      
    };

// funciona como um base SQL fazendo um join para o point item id
    const items = await Knex('items')
      .join('point_items' , 'items.id', '=','point_items.item_id')
      .where('point_items.item_id', id)
      .select('items.title');


    return res.json({point: serializedPoint , items})
  }
//criacao de usuarios
  async create(req: Request , res: Response){
      const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items
      } = req.body;
    
    const trx = await Knex.transaction(); //para evitar poblemas com 2 next se de erro vai parar aqui 
    
//tem um variavel que tem todos os pontos 
  const point ={
    image: req.file.filename,
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
  }
      //inserir usuario relaciomento dos usuarios com os ids
    const insertIds = await trx('points').insert(point); // e chamando aqui
    
    //Relacionamento de items com os usuarios com os ids com a tabela point_items
    const point_id = insertIds[0];

      const pointItems = items
      .split(',')
      .map((item :String)=> Number(item.trim()))
      .map((item_id: number )=>{
        return {
          item_id,
          point_id,
        };
      })
      await trx('point_items').insert(pointItems);
    
      await trx.commit(); //sempre user commit por causa do trx
      return res.json({
        id: point_id,
        ...point, //pegar  todas as informacoes do objeto point
      })
    }
}

export default PointsController;


