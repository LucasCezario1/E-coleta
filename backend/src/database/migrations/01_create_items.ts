import Knex from 'knex';

//Criar a tabela no sqlite3
export async function up(knex: Knex){
 return knex.schema.createTable('items' , table =>{
    table.increments('id').primary();
    table.string('image').notNullable();
    table.string('title').notNullable();
  
  })
}

//Voltar aa trass na tabela por que errou
export async function down(knex: Knex){
  return knex.schema.dropTable('items');
}