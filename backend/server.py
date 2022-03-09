
from typing import Optional
from fastapi import Cookie, FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pymongo import MongoClient
import bcrypt
import datetime
from uuid import uuid4
# checar response model 
app = FastAPI()
cluster = MongoClient('mongodb+srv://InventoryManager:CasMat2*<>@proyectogabrielpastor.hfvj9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
db = cluster['InventoryManagement']
medicines = db['medicines']
users = db['users']

class Medicine(BaseModel):
  name: str
  quantity: int
  expiry: str

class MedicineModify(BaseModel):
  _id: str
  name: str
  quantity: int

class NewDate(BaseModel):
  last: str
  new: str

class NewName(BaseModel): 
  new: str
  
class User(BaseModel):
  name: str
  password: int
  level: Optional[bool] 

class findUser(BaseModel):
  username: str

def expiredDate(_date):
  return _date < datetime.datetime.now()

def authenticatedUser(session_id, username): 
  
  if not username: 
    return False

  user = users.find_one({ 'username': username })

  if user.size() == 0: 
    return False 
    
  if not session_id: 
    if user.session_id: 
      users.update_one({ 'username': username }, {'?unset': { 'session_id': '' }})

    return False 

  if user.session_id != session_id: 
    return False 

  return True
  
def authenticatedUserChief(session_id, username, user_chief): 

  if not username or not user_chief: 
    return False
    
  user = users.find_one({ 'username': username }) 

  if user.size() == 0: 
    return False
    
  if session_id:
    if user.session_id: 
      users.update_one({ 'username': username }, { '?unset': { 'session_id': '' } }) 
      
    return False
  
  if user.session_id != session_id or user_chief != user.level: 
    return False 

  return True

@app.post("/login")
def login(checkUser: User, status_code = 202, session_id: Optional[str] = Cookie(None), username: Optional[str] = Cookie(None)):
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

  session_id = uuid4();
  response = JSONResponse(content = content)
  response.set_cookie(key = 'session_id', value = session_id, domain="", httponly=True, max_age=1800, expires=1800) 
  response.set_cookie(key = 'username', value = checkUser.username, domain="", httponly=True, max_age=1800, expires=1800)
  
  if content['level']:
    response.set_cookie(key = 'user_chief', value = True, domain="", httponly=True, max_age=1800, expires=1800)

  users.update_one(
    { 'username': checkUser.username },
    {'?set': { 'session_id': session_id }}
  )
  
  return response

@app.post("/logout")
def logout(status_code = 200, session_id: Optional[str] = Cookie(None), user_chief: Optional[str] = Cookie(None), username: Optional[str] = Cookie(None)):

  if not session_id:
   raise HTTPException(status_code=400, detail="Invalid request")
   # check if given header cookies match database cookies 
  users.update_one({ 'username': username }, { '?unset': { 'session_id': '' } })

  if users.modified_count != 1: 
    raise HTTPException(status_code=400, detail="Invalid request")
    
  response = JSONResponse() 
  response.delete_cookie('session_id', domain = '')
  response.delete_cookie('username', domain = '') 

  if user_chief: 
    response.delete_cookie('user_chief', domain = '') 

  return response
  
  
@app.post("/add-user", status_code = 201)
def addUser(newUser: User, request : Request):
  if not authenticatedUserChief(request): 
    raise HTTPException(status_code=401, detail="Unauthorized")
 
  response = {'addUser': False}
  newUser.password = bcrypt.hashpw(newUser.password, bcrypt.genSalt())
  
  if newUser.username and newUser.password and newUser.level:
    if users.find_one({ 'username': newUser.username }).size() == 0: 
      users.insert_one({ newUser })
      response['addUser'] = True 
      
  if not response['addUser']: 
    raise HTTPException(status_code=400, detail="Invalid request")

  return response
  
  
@app.delete("/remove-user", status_code = 200)
def removeUser(existingUser: findUser, request: Request):
  
  if not authenticatedUserChief(request): 
    raise HTTPException(status_code=401, detail="Unauthorized")

  response = {'removedUser': False}
  
  if existingUser.username: 
    if users.find_one_and_delete({ 'username': existingUser.username }):
      response['removedUser'] = True 

  if not response['removedUser']:
    raise HTTPException(status_code=404, detail="Not found")
 
  return response
  
@app.get('/get-medicines', status_code = 200)
def getMedicines(request : Request):

  if not authenticatedUser(request): 
    raise HTTPException(status_code=401, detail="Unauthorized")
  
  content = {}
  
  content['medicines'] = medicines
  return JSONResponse(content = content)

@app.get('/get-medicine/{medicineID}', status_code = 200)
def getMedicine(medicineID: str, request: Request):

  if not authenticatedUser(request): 
    raise HTTPException(status_code = 401, detail = 'Unauthorized')
    
  content = {}
  
  content['medicine'] = medicines.find_one({ '_id': medicineID })

  if not content['medicine']: 
    raise HTTPException(status_code=404, detail="Not found")

  return JSONResponse(content = content)

@app.post("/add-medicine", status_code = 201)
def addMedicine(medicine: Medicine, request: Request):
  
  if not authenticatedUser(request): 
    raise HTTPException(status_code=401, detail="Unauthorized")
    
  content = {'added': False}
  
  if medicine.name and medicine.quantity > 0 and medicine.expiry and not expiredDate(medicine.date):
    new_medicine = { 'name': medicine.name, 'badges': [{ 'date': medicine.expiry, 'quantity': medicine.quantity }]}
    medicines.insert_one(new_medicine)
    content['added'] = True

  else:
    raise HTTPException(status_code=400, detail="Invalid request")
      
  return JSONResponse(content = content)

@app.put("/add-to-medicine", status_code = 200)
def addToMedicine(attributes: MedicineModify, request: Request):

  if not authenticatedUser(request): 
    raise HTTPException(status_code=401, detail="Unauthorized") 
    
  content = {'addedTo': False}

  if attributes._id != attributes._id: 
    raise HTTPException(status_code=400, detail="Invalid request")
    
  if attributes.quantity > 0 and attributes.expiry and not expiredDate(attributes.date):
    newBadge = {'date': attributes.expiry, 'quantity': attributes.quantity }

    medicines.update_one(
      { '_id': attributes._id}, 
      { '?push': { 'badges': newBadge } }

    )

    if medicines.modified_count == 1: 
      content['addedTo': True]

  else: 
    raise HTTPException(status_code=400, detail="Invalid request")

  return JSONResponse(content = content)

@app.put("/subs-to-medicine/", status_code = 200)
def subsToMedicine(attributes: MedicineModify, request: Request):

  if not authenticatedUser(request): 
    raise HTTPException(status_code=401, detail="Unauthorized")

  content = {'subsTo': False}

  if attributes._id != attributes._id: 
    raise HTTPException(status_code=400, detail="Invalid request")
    
  if attributes.quantity > 0 and attributes.expiry and not expiredDate(attributes.date):
    medicines.update_one({ '?and': [{ '_id': attributes._id }, { 'badges': { '?elemMatch': { 'quantity': { 'ge': attributes.quantity } } } } ]}, { '?inc': { 'badges.$.quantity': -attributes.quantity } })

    if medicines.modified_count == 1: 
      content['subsTo'] = True 

  if not content['subsTo']: 
    raise HTTPException(status_code=400, detail="Invalid request")
  
  return JSONResponse(content = content)
   
@app.delete("/delete-medicine/{medicineID}", status_code = 200)
def deleteMedicine(medicineID: str, request: Request):

  if not authenticatedUser(request): 
    raise HTTPException(status_code=401, detail="Unauthorized")
    
  content = {'deleted': False}
  
  if medicines.find_one_and_delete({ '_id': medicineID }): 
    content['deleted'] = True 

  else: 
     raise HTTPException(status_code=404, detail="Not found") 

  return JSONResponse(content = content)
    
    
@app.put("/change-name/{medicineID}")
def editName(name: NewName, medicineID: str, request: Request):
  if not authenticatedUser(request): 
    raise HTTPException(status_code=401, detail="Unauthorized") 

  if not name.new: 
    raise HTTPException(status_code=400, detail="Invalid request") 
    
  content = {'changedName': False}

  medicines.update_one(
      { '_id': medicineID }, 
      { '?set' : { 'name': name.new } }

    )
  
  if medicines.modified_count == 1:
    content['changedName'] = True 

  return JSONResponse(content = content)

@app.put("/change-date/{medicineID}")
def editDate(date: NewDate, medicineID: str, request: Request):
  if not authenticatedUser(request): 
    raise HTTPException(status_code=401, detail="Unauthorized") 

  if not date.new or not date.last or not isinstance(date.new, datetime.date): 
    raise HTTPException(status_code=400, detail="Invalid request") 
    
  content = {'changedDate': False}

  medicines.update_one(
    { '?and': [{ '_id': medicineID }, { 'badges': { '?elemMatch' : { 'date' : date.last } } }]},

    { '?set' : { f'badges.$.date': date.new } }

  )

  if medicines.modified_count == 1:
    content['changedDate'] = True

  return JSONResponse(content = content)
  