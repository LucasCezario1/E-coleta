import express from 'express';
import path from 'path';
import routes from './routes';
import cors from 'cors';
import { errors } from 'celebrate';


const app = express();

//Fzendo a URL acesarem o cors
app.use(cors());

app.use(express.json()); // para saber que esta usando um json na requesicao 
app.use(routes); // rotas para de todas as api 

//Aonde vai ficar as Imagens 
app.use('/uploads' , express.static(path.resolve(__dirname,'..' ,'uploads'))) 


app.use(errors());

app.listen(3333);