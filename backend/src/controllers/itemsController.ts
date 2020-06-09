import { Request, Response} from 'express';
import Kenx from '../database/connection';

class ItemController {
  async index(req:Request, res: Response){
    const items =  await Kenx('items').select('*'); //selecao de todas as imagens

  //Listagem com as imagns com uma execucao com title e local da imagem
  const serializedItems = items.map(item =>{
    return {
      id: item.id,
      title: item.title,
      image_url: `http://192.168.0.12:3333/uploads/${item.image}`,

    };
  })
  return res.json(serializedItems);

  }
}

export default ItemController;