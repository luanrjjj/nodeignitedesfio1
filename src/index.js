const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers

  
  const user = users.some(user=>user.username===username)

  

  if (!user) return response.status(404).json({
    error:'Mensagem do erro'
  });

  request.user = user

  return next()

  
}

app.post('/users', (request, response) => {
  const {name,username} = request.body
  
 
  
  const checkUserExist = users.some((user) => user.username===username)
 
  
  
  if (checkUserExist) return response.status(400).json({error:'Mensagem do erro'})



 const user = {
  id:uuidv4(),
  name:name,
  username:username,
  todos:[]
}

  users.push(user)


  
  return response.status(201).json(user)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers

  const user =users.find(user=> user.username===username)

  
  return response.json(user.todos)


});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title,deadline} = request.body;

  const {username} = request.headers;

  const todo = { 
    id:uuidv4(),
    title:title,
    done:false,
    deadline:new Date(deadline),
    created_at: new Date()
  }

 
  const userTodo = users.find((user) => user.username===username)
  
  
  if (userTodo) {
    userTodo?.todos.push(todo)  
  }

  
  return response.status(201).json(todo)


});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers;
  const {id} = request.params;

  
  const {title,deadline} = request.body;

  const userTodo = users.find((user) => user.username===username)

  const todo = userTodo.todos.find((todo)=> todo.id=id)

  if(!todo) {
    return response.status(404).json({
      error:'Mensagem do erro'
    });
  
  }

  const newTodo = {
    id:id,
    title:title,
    done:false,
    deadline:deadline,
    created_at:todo.created_at
    
  }

  indexUser = users.indexOf(userTodo)
  indexTodo = userTodo.todos.indexOf(todo)

  users[indexUser].todos[indexTodo] = newTodo

  


  return response.json(newTodo)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers;
  const {id} = request.params;

  let todo = users.find((user) => user.username===username).todos.find((todo)=> todo.id=id)


  if (!todo) {
    return response.status(404).json({
      error:'Mensagem do erro'
    });
  
  }


  todo.done= true

  return response.json(todo)



});


app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers;
  const {id} = request.params;

  let userTodo = users.find((user) => user.username===username)

  let todo = userTodo.todos.find((todo)=> todo.id===id)
  console.log('passou aqui')

  if(!todo) {
    return response.status(404).json({
      error:'Mensagem do erro'
    });
  
  }
  
  console.log('passou aqui 1')
  const index = userTodo.todos.indexOf(todo)

 

  userTodo.todos.splice(index,1)
  console.log('passou aqui 2')

  return response.status(204).send()
});

module.exports = app;