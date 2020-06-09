import Knex from 'knex';

//Criar a tabela no sqlite3
export async function up(knex: Knex){
 return knex.schema.createTable('point_items' , table =>{
    table.increments('id').primary();
    
    table.integer('point_id')
    .notNullable()
    .references('id')
    .inTable('points');
    
    table.integer('item_id')
    .notNullable()
    .references('id')
    .inTable('items');
  
  })
}

//Voltar aa trass na tabela por que errou
export async function down(knex: Knex){
  return knex.schema.dropTable('point_items');
}