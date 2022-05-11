from fastapi.testclient import TestClient
from fastapi import FastAPI
import datetime

app = FastAPI()
client = TestClient(app) 


def test_add_user():
  response = client.get('/add-user', headers = {'Accept': 'application/json', 
  'Content-Type': 'application/json', 
  'Cookie': 'session_id=valid_id,username:MateoCaso,user_chief=True'}, 
  body = {'username': 'usuario nuevo', 'password': 'contraseña', 'level': True}) 

  assert response.status_code == 201 
  assert response.json() == { 'addedUser': True }

def test_remove_user():
  response = client.get('/remove-user', headers = {'Accept': 'application/json', 
  'Content-Type': 'application/json', 'Cookie': 
  'session_id=valid_id,username:MateoCaso,user_chief:True'}, body = {'username': 'usuario' })

  assert response.status_code == 200 
  assert response.json() == { 'removedUser': True } 
  
def test_get_medicine():
  response = client.get('/get-medicine/valid_id', headers = 
  {'Accept': 'application/json', 'Content-Type': 'application/json', 'Cookie': 'session_id=valid_id,username:MateoCaso'}) 

  assert response.status_code == 200 
  assert 'medicine' in response.json() 

def test_delete_medicine(): 
  response = client.put('/delete-medicine/valid_id', headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'Cookie': 'session_id=valid_id,username:MateoCaso'})

  assert response.status_code == 200
  assert response.json() == { 'deleted': True }

def test_add_medicine(): 
  response = client.post('/add-medicine', headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'Cookie': 'session_id=valid_id,username:MateoCaso'}, body = { 'name': 'nombre', 'quantity': 10, 'expiry': datetime.date.today()}) 

  assert response.status_code == 201
  assert response.json() == { 'added': True }

def test_add_to_medicine(): 
  response = client.put('/add-to-medicine', headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'Cookie': 'session_id=valid_id,username:MateoCaso'}, body = { '_id': 'valid_id', 'quantity': 10, 'expiry': datetime.date.today()})

  assert response.status_code == 200
  assert response.json() == { 'addedTo': True }

def test_subs_to_medicine(): 
  response = client.put('/subs-to-medicine', headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'Cookie': 'session_id=valid_id,username:MateoCaso'}, body = { '_id': 'valid_id', 'quantity': 10, 'expiry': datetime.date.today()}) 

  assert response.status_code == 200
  assert response.json() == { 'subsTo': True } 

def test_edit_name(): 
  response = client.put('/change-name', headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'Cookie': 'session_id=valid_id,username:MateoCaso'}, body = {'_id': 'valid_id', 'new': 'nuevo nombre'})

  assert response.status_code == 200
  assert response.json() == { 'changedName': True }

def test_edit_date(): 
  response = client.put('/change-date', headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'Cookie': 'session_id=valid_id,username:MateoCaso'}, body = {'_id': 'valid_id', 'last': datetime.datetime(2020, 4, 18), 'new': datetime.date.today()}) 

  assert response.status_code == 200
  assert response.json() == { 'changedDate': True }

def test_remove_expired_date(): 
  response = client.delete('/remove-expired-badges', headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'Cookie': 'session_id=valid_id,username:MateoCaso'}) 

  assert response.status_code == 200
  assert response.json() == { 'removedExpired': True }