
from typing import Optional
from fastapi import Cookie, FastAPI, HTTPException, Request
from fastapi.testclient import TestClient
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
import bcrypt
import datetime
from uuid import uuid4
from bson import json_util, ObjectId
import json

# checar response model 
app = FastAPI()

origins = [
  "http://localhost:3000",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

cluster = MongoClient("mongodb+srv://InventoryManager:CasMat2*<>@proyectogabrielpastor.hfvj9.mongodb.net/InventoryManagement?retryWrites=true&w=majority")
db = cluster['InventoryManagement']
medicines = db['medicines']
users = db['users'] 

class Medicine(BaseModel):
  name: str
  quantity: int
  expiry: str

class MedicineModify(BaseModel):
  medicine_id: str
  quantity: int
  expiry: str

class NewDate(BaseModel):
  medicine_id: str
  last: str
  new: str

class NewName(BaseModel): 
  medicine_id: str
  new: str
  
class User(BaseModel):
  username: str
  password: str
  level: Optional[bool] 

class findUser(BaseModel):
  username: str

def expiredDate(_date):
  measures = _date.split('-')
  
  if measures[1][0] == '0': 
      measures[1] = measures[1][1: ]
      
  return datetime.date(int(measures[0]), int(measures[1]), int(measures[2])) < datetime.date.today()

def authenticatedUser(session_id, username): 
  
  if not username: 
    return False
  
  user = users.find_one({ 'username': username })

  if user.size() == 0: 
    return False 
    
  if not session_id: 
    if user.session_id: 
      clearSessionFromDatabase(username)

    return False 

  if user.session_id != session_id: 
    return False 

  return True
  
def authorizedUserChief(username, user_chief): 

  if not user_chief: 
    return False

  user = users.find_one({ 'username': username })
  if user_chief != user.level: 
    return False 

  return True

def clearSessionFromDatabase(username):
  users.update_one({ 'username': username }, { '?unset': { 'session_id': '' } })
  
@app.post("/login", status_code = 202)
def login(checkUser: User, session_id: Optional[str] = Cookie(None), username: Optional[str] = Cookie(None)):
  # check if under current structure, it would cause a problem for a user to log in with other accounts at the same time

  if authenticatedUser(session_id, username): 
    raise HTTPException(status_code=400, detail="Only one account can be opened at a time, you must logout")
    
  content = {'loggedIn': False, 'level': False}
  
  if checkUser.username and checkUser.password:
    user = users.find_one({ 'username': checkUser.username })
    if user.size() == 1: 
      if bcrypt.compare(checkUser.password, user.password): 
        content['loggedIn'] = True
        
        if user.level: 
          content['level'] = True
        
  if not content['loggedIn']: 
    raise HTTPException(status_code=401, detail="Unauthorized credentials")

  session_id = uuid4()
  response = JSONResponse(content = content)
  response.set_cookie(key = 'session_id', value = session_id, domain="localhost:3000", httponly=True, max_age=1800, expires=1800) 
  response.set_cookie(key = 'username', value = checkUser.username, domain="localhost:3000", httponly=True, max_age=1800, expires=1800)
  
  if content['level']:
    response.set_cookie(key = 'user_chief', value = True, domain="", httponly=True, max_age=1800, expires=1800)

  users.update_one(
    { 'username': checkUser.username },
    {'?set': { 'session_id': session_id }}
  )
  
  return response

@app.post("/logout", status_code = 200)
def logout(session_id: Optional[str] = Cookie(None), user_chief: Optional[str] = Cookie(None), username: Optional[str] = Cookie(None)):

  if not authenticatedUser(session_id, username):
   raise HTTPException(status_code=400, detail="Invalid request")
   # check if given header cookies match database cookies 
  users.update_one({ 'username': username }, { '?unset': { 'session_id': '' } })

  if users.modified_count != 1: 
    raise HTTPException(status_code=400, detail="Invalid request")
    
  response = JSONResponse() 
  response.delete_cookie('session_id', domain = 'localhost:3000')
  response.delete_cookie('username', domain = 'localhost:3000') 

  if authorizedUserChief(username, user_chief):

    response.delete_cookie('user_chief', domain = 'localhost:3000') 

  return response
  
@app.post("/add-user", status_code = 201)
def addUser(user: User, session_id: Optional[str] = Cookie(None), user_chief: Optional[str] = Cookie(None), username: Optional[str] = Cookie(None)):
  
 
  content = {'addedUser': False}
  password = bcrypt.hashpw(user.password.encode('utf8'), bcrypt.gensalt())

  newUser = {'username': user.username, 'password': password, 'level': user.level}
  if user.username and user.password:
    if not users.find_one({ 'username': user.username }): 
      users.insert_one(newUser)
      content['addedUser'] = True 
      
  if not content['addedUser']: 
    raise HTTPException(status_code=400, detail="Invalid request")

  return JSONResponse(content = content)
  
  
@app.delete("/remove-user", status_code = 200)
def removeUser(existingUser: findUser, session_id: Optional[str] = Cookie(None), user_chief: Optional[str] = Cookie(None), username: Optional[str] = Cookie(None)):
 
  

  content = {'removedUser': False}
  
  if existingUser.username: 
    if users.find_one_and_delete({ 'username': existingUser.username }):
      content['removedUser'] = True
    
  if not content['removedUser']:
    raise HTTPException(status_code=404, detail="Not found")
 
  return JSONResponse(content = content)
  
@app.get('/get-medicines', status_code = 201)
def getMedicines(session_id: Optional[str] = Cookie(None), username: Optional[str] = Cookie(None)):


  
  content = {}
  
  content['medicines'] = [json.loads(json_util.dumps(medicine)) for medicine in medicines.find()]
  return JSONResponse(content = content)

@app.get('/get-medicine/{medicineID}', status_code = 200)
def getMedicine(medicineID: str, session_id: Optional[str] = Cookie(None), 
username: Optional[str] = Cookie(None)):

    
  content = {}
  
  content['medicine'] = medicines.find_one({ '_id': ObjectId(medicineID) })

  if not content['medicine']: 
    raise HTTPException(status_code=404, detail="Not found")

  content['medicine'] = json.loads(json_util.dumps(content['medicine']))
  return JSONResponse(content = content)

@app.post("/add-medicine", status_code = 201)
def addMedicine(medicine: Medicine, session_id: Optional[str] = Cookie(None), 
username: Optional[str] = Cookie(None)):

  
    
  content = {'added': False}
  
  if medicine.name and medicine.quantity > 0 and medicine.expiry and not expiredDate(medicine.expiry):
    new_medicine = { 'name': medicine.name, 'badges': [{ 'date': medicine.expiry, 'quantity': medicine.quantity }]}
    medicines.insert_one(new_medicine)
    content['added'] = True

  else:
    raise HTTPException(status_code=400, detail="Invalid request")
      
  return JSONResponse(content = content)

@app.put("/add-to-medicine", status_code = 200)
def addToMedicine(attributes: MedicineModify, session_id: Optional[str] = Cookie(None), 
username: Optional[str] = Cookie(None)):
  
  
   
  content = {'addedTo': False}

  if attributes.quantity > 0 and attributes.expiry and not expiredDate(attributes.expiry):
    newBadge = {'date': attributes.expiry, 'quantity': attributes.quantity }
    if medicines.find_one_and_update(
      { '_id': ObjectId(attributes.medicine_id)}, 
      { '$push': { 'badges': newBadge } }

    ):

      content['addedTo'] = True

  if not content['addedTo']: 
    raise HTTPException(status_code=400, detail="Invalid request")

  return JSONResponse(content = content)

@app.put("/subs-to-medicine/", status_code = 200)
def subsToMedicine(attributes: MedicineModify, session_id: Optional[str] = Cookie(None), 
username: Optional[str] = Cookie(None)):
  


  content = {'subsTo': False}

  if attributes.quantity > 0 and attributes.expiry and not expiredDate(attributes.expiry):
    medicines.update_one({ '$and': [{ '_id': attributes.medicine_id }, 
    { 'badges': { '$elemMatch': {'$and': [{ 'quantity': { 'ge': attributes.quantity } }, 
    {'date': attributes.expiry}] } }}]}, { '$inc': { 'badges.$.quantity': -attributes.quantity } })

    
    content['subsTo'] = True 

  if not content['subsTo']: 
    raise HTTPException(status_code=400, detail="Invalid request")
  
  return JSONResponse(content = content)
   
@app.delete("/delete-medicine/{medicineID}", status_code = 200)
def deleteMedicine(medicineID: str, session_id: Optional[str] = Cookie(None), 
username: Optional[str] = Cookie(None)):

  
    
  content = {'deleted': False}
  
  if medicines.find_one_and_delete({ '_id': ObjectId(medicineID) }): 
    content['deleted'] = True 

  else: 
     raise HTTPException(status_code=404, detail="Not found") 

  return JSONResponse(content = content)
    
    
@app.put("/change-name", status_code = 200)
def editName(name: NewName, session_id: Optional[str] = Cookie(None), 
username: Optional[str] = Cookie(None)):
  

  if not name.new: 
    raise HTTPException(status_code=400, detail="Invalid request") 
    
  content = {'changedName': False}

  medicines.update_one(
    { '_id': ObjectId(name.medicine_id) }, 
    { '$set' : { 'name': name.new } }

  )
  
  return JSONResponse(content = content)

@app.put("/change-date", status_code = 200)
def editDate(date: NewDate, session_id: Optional[str] = Cookie(None), 
username: Optional[str] = Cookie(None)):
  

  if not date.new or not date.last: 
    raise HTTPException(status_code=400, detail="Invalid request") 
    
  content = {'changedDate': False}

  medicine = dict(medicines.find_one({'_id': ObjectId(date.medicine_id)}))

  for badge in medicines['badges']:
    if badge['date'] == date.last: 
      badge['date'] = date.new  
    
  print(medicine)

  medicines.update_one({'_id' : date.medicine_id }, {'$set': medicine })
      
  

  

  return JSONResponse(content = content)

@app.delete("/remove-expired-badges/{medicineID}", status_code = 200)
def removeExpiredBadges(medicineID: str, session_id: Optional[str] = Cookie(None), username: Optional[str] = Cookie(None)):
  if not authenticatedUser(session_id, username): 
    raise HTTPException(status_code=401, detail="Unauthorized")  

  content = { 'removedExpired': False }
  
  medicines.update_one({ '_id': medicineID }, { '$pull': { 'badges': { 'date': { 'lt': datetime.date.today() } } } })

  if medicines.modified_count == 1: 
    content['removedExpired'] = True 

  else: 
    raise HTTPException(status_code=400, detail="Invalid request")

  return JSONResponse(content = content)
              
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