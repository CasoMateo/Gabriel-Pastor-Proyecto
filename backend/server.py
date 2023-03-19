import os
import json
import bcrypt
import datetime

from uuid import uuid4
from typing import Optional

from bson.binary import UUID
from pydantic import BaseModel
from pymongo import MongoClient
from bson import json_util, ObjectId
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Cookie, FastAPI, HTTPException, Request


# checar response model
app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NOSQL_USER = os.environ.get('NOSQL_USER', '')
NOSQL_PASS = os.environ.get('NOSQL_PASS', '')
NOSQL_HOST = os.environ.get('NOSQL_HOST', '')
NOSQL_PORT = os.environ.get('NOSQL_PORT', 27050)


def get_mongo_url():
    ''' Returns proper mongo connection URL from env file. '''
    # CLOUD
    # return f''
    # local
    return f'mongodb://{NOSQL_HOST}:{NOSQL_PORT}/'


cluster = MongoClient("mongodb+srv://InventoryManager:CasMat2*<>@proyectogabrielpastor.hfvj9.mongodb.net/?retryWrites=true&w=majority"

)
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
        measures[1] = measures[1][1:]

    return datetime.date(int(measures[0]), int(measures[1]), int(measures[2])) < datetime.date.today()


def getCookie(cname, ccookies):
    cookies = ccookies.split('; ')

    for cookie in cookies:
        cur = cookie.split('=')
        if cur[0] == cname:
            return cur[1]

    return False


def authenticatedUser(session_id, username):

    if not username:
        return False

    user = users.find_one({'username': username})

    if not user:
        return False

    if not session_id:
        if user.get('session_id'):
            clearSessionFromDatabase(username)

        return False

    if not user.get('session_id'):
        return False

    if user.get('session_id') != session_id:
        return False

    return True


def authorizedUserChief(username, user_chief):
    if not user_chief:
        return False

    user = users.find_one({'username': username})
    if not user.get('level'):
        return False

    return True


def clearSessionFromDatabase(username):
    users.update_one({'username': username}, {'?unset': {'session_id': ''}})


@app.post("/login", status_code=202)
def login(request: Request, checkUser: User, session_id: Optional[str] = Cookie(None), username: Optional[str] = Cookie(None)):
    # check if under current structure, it would cause a problem for a user to log in with other accounts at the same time

    if authenticatedUser(getCookie('session_id', request.headers['cookies']), getCookie('username', request.headers['cookies'])):
        raise HTTPException(status_code=401, detail="Unauthorized")

    content = {'loggedIn': False, 'level': False}
    if checkUser.username and checkUser.password:
        user = users.find_one({'username': checkUser.username})

        if user:
            if bcrypt.hashpw(checkUser.password.encode('utf8'), user.get('password')) == user.get('password'):
                content['loggedIn'] = True

                if user.get('level'):
                    content['level'] = True

    if not content['loggedIn']:
        raise HTTPException(status_code=401, detail="Unauthorized credentials")

    session_id = uuid4()
    content['session_id'] = str(session_id)
    response = JSONResponse(content=content)

    users.update_one(
        {'username': checkUser.username},
        {'$set': {'session_id': str(session_id)}}
    )

    return response


@app.get("/is-logged-in", status_code=200)
def isLoggedIn(request: Request):

    if not authenticatedUser(getCookie('session_id', request.headers['cookies']), getCookie('username', request.headers['cookies'])):
        raise HTTPException(status_code=401, detail="Unauthorized")


@app.post("/logout", status_code=200)
def logout(request: Request, user: findUser, session_id: Optional[str] = Cookie(None), user_chief: Optional[str] = Cookie(None), username: Optional[str] = Cookie(None)):

    if not authenticatedUser(getCookie('session_id', request.headers['cookies']), getCookie('username', request.headers['cookies'])):
        raise HTTPException(status_code=401, detail="Unauthorized")
      # check if given header cookies match database cookies
    if not users.find_one_and_update({'username': user.username}, {'$unset': {'session_id': ''}}):
        raise HTTPException(status_code=400, detail="Invalid request")

    response = JSONResponse(content={'loggedOut': True})

    return response


@app.get("/get-users", status_code=200)
def getUsers(request: Request):

    if not authenticatedUser(getCookie('session_id', request.headers['cookies']), getCookie('username', request.headers['cookies'])) or not authorizedUserChief(getCookie('username', request.headers['cookies']), getCookie('user_chief', request.headers['cookies'])):
        raise HTTPException(status_code=401, detail="Unauthorized")
      # check if given header cookies match database cookies

    usernames = []
    all_users = [user for user in users.find()]

    for user in all_users:
        usernames.append(user.get('username'))

    content = {'users': usernames}
    response = JSONResponse(content=content)

    return response


@app.post("/add-user", status_code=201)
def addUser(request: Request, user: User, session_id: Optional[str] = Cookie(None), user_chief: Optional[str] = Cookie(None), username: Optional[str] = Cookie(None)):

    if not authenticatedUser(getCookie('session_id', request.headers['cookies']), getCookie('username', request.headers['cookies'])) or not authorizedUserChief(getCookie('username', request.headers['cookies']), getCookie('user_chief', request.headers['cookies'])):
        raise HTTPException(status_code=401, detail="Unauthorized")

    content = {'addedUser': False}
    password = bcrypt.hashpw(user.password.encode('utf8'), bcrypt.gensalt())

    newUser = {'username': user.username,
               'password': password, 'level': user.level}
    if user.username and user.password:
        if not users.find_one({'username': user.username}):
            users.insert_one(newUser)
            content['addedUser'] = True

    if not content['addedUser']:
        raise HTTPException(status_code=400, detail="Invalid request")

    return JSONResponse(content=content)


@app.delete("/remove-user", status_code=200)
def removeUser(request: Request, existingUser: findUser, session_id: Optional[str] = Cookie(None), user_chief: Optional[str] = Cookie(None), username: Optional[str] = Cookie(None)):

    if not authenticatedUser(getCookie('session_id', request.headers['cookies']), getCookie('username', request.headers['cookies'])) or not authorizedUserChief(getCookie('username', request.headers['cookies']), getCookie('user_chief', request.headers['cookies'])):
        raise HTTPException(status_code=401, detail="Unauthorized")

    if existingUser.username == getCookie('username', request.headers['cookies']):
        raise HTTPException(status_code=400, detail="Bad request")

    content = {'removedUser': False}

    if existingUser.username:
        if users.find_one_and_delete({'username': existingUser.username}):
            content['removedUser'] = True

    if not content['removedUser']:
        raise HTTPException(status_code=404, detail="Not found")

    return JSONResponse(content=content)


@app.get('/get-medicines', status_code=201)
def getMedicines(request: Request, session_id: Optional[str] = Cookie(None), username: Optional[str] = Cookie(None)):

    if not authenticatedUser(getCookie('session_id', request.headers['cookies']), getCookie('username', request.headers['cookies'])):
        raise HTTPException(status_code=401, detail="Unauthorized")

    content = {}

    content['medicines'] = [json.loads(json_util.dumps(
        medicine)) for medicine in medicines.find()]
    return JSONResponse(content=content)


@app.get('/get-medicine/{medicineID}', status_code=200)
def getMedicine(request: Request, medicineID: str, session_id: Optional[str] = Cookie(None),
                username: Optional[str] = Cookie(None)):

    if not authenticatedUser(getCookie('session_id', request.headers['cookies']), getCookie('username', request.headers['cookies'])):
        raise HTTPException(status_code=401, detail="Unauthorized")

    content = {}

    content['medicine'] = medicines.find_one({'_id': ObjectId(medicineID)})

    if not content['medicine']:
        raise HTTPException(status_code=404, detail="Not found")

    content['medicine'] = json.loads(json_util.dumps(content['medicine']))
    return JSONResponse(content=content)


@app.post("/add-medicine", status_code=201)
def addMedicine(request: Request, medicine: Medicine, session_id: Optional[str] = Cookie(None),
                username: Optional[str] = Cookie(None)):

    if not authenticatedUser(getCookie('session_id', request.headers['cookies']), getCookie('username', request.headers['cookies'])):
        raise HTTPException(status_code=401, detail="Unauthorized")

    content = {'added': False}

    if medicine.name and medicine.quantity > 0 and medicine.expiry and not expiredDate(medicine.expiry):
        new_medicine = {'name': medicine.name, 'badges': [
            {'date': medicine.expiry, 'quantity': medicine.quantity}]}
        medicines.insert_one(new_medicine)
        content['added'] = True

    else:
        raise HTTPException(status_code=400, detail="Invalid request")

    return JSONResponse(content=content)


@app.put("/add-to-medicine", status_code=200)
def addToMedicine(request: Request, attributes: MedicineModify, session_id: Optional[str] = Cookie(None),
                  username: Optional[str] = Cookie(None)):

    if not authenticatedUser(getCookie('session_id', request.headers['cookies']), getCookie('username', request.headers['cookies'])):
        raise HTTPException(status_code=401, detail="Unauthorized")

    content = {'addedTo': False}
    medicine = medicines.find_one({'_id': ObjectId(attributes.medicine_id)})
    if attributes.quantity > 0 and attributes.expiry:

        for badge in range(len(medicine['badges'])):
            if medicine.get('badges')[badge].get('date') == attributes.expiry:
                medicine['badges'][badge]['quantity'] += attributes.quantity
                content['addedTo'] = True
                medicines.delete_one({'_id': ObjectId(attributes.medicine_id)})
                medicines.insert_one(medicine)

        if not content['addedTo']:
            newBadge = {'date': attributes.expiry,
                        'quantity': attributes.quantity}
            if medicines.find_one_and_update(
                {'_id': ObjectId(attributes.medicine_id)},
                {'$push': {'badges': newBadge}}

            ):

                content['addedTo'] = True

    if not content['addedTo']:
        raise HTTPException(status_code=400, detail="Invalid request")

    return JSONResponse(content=content)


@app.put("/subs-to-medicine", status_code=200)
def subsToMedicine(request: Request, attributes: MedicineModify, session_id: Optional[str] = Cookie(None),
                   username: Optional[str] = Cookie(None)):

    if not authenticatedUser(getCookie('session_id', request.headers['cookies']), getCookie('username', request.headers['cookies'])):
        raise HTTPException(status_code=401, detail="Unauthorized")

    content = {'subsTo': False}
    medicine = dict(medicines.find_one(
        {'_id': ObjectId(attributes.medicine_id)}))

    if attributes.quantity > 0 and attributes.expiry:

        for badge in range(len(medicine['badges'])):
            if medicine.get('badges')[badge].get('date') == attributes.expiry and medicine.get('badges')[badge].get('quantity') >= attributes.quantity:
                if medicine['badges'][badge]['quantity'] == attributes.quantity:
                    medicine['badges'] = medicine['badges'][: badge] + \
                        medicine['badges'][badge + 1:]

                else:
                    medicine['badges'][badge]['quantity'] -= attributes.quantity

                break

    if medicine != medicines.find_one({'_id': ObjectId(attributes.medicine_id)}):
        medicines.delete_one({'_id': ObjectId(attributes.medicine_id)})
        medicines.insert_one(medicine)
        content['subsTo'] = True

    if not content['subsTo']:
        raise HTTPException(status_code=400, detail="Invalid request")

    return JSONResponse(content=content)


@app.delete("/delete-medicine/{medicineID}", status_code=200)
def deleteMedicine(request: Request, medicineID: str, session_id: Optional[str] = Cookie(None),
                   username: Optional[str] = Cookie(None)):

    if not authenticatedUser(getCookie('session_id', request.headers['cookies']), getCookie('username', request.headers['cookies'])):
        raise HTTPException(status_code=401, detail="Unauthorized")

    content = {'deleted': False}

    if medicines.find_one_and_delete({'_id': ObjectId(medicineID)}):
        content['deleted'] = True

    else:
        raise HTTPException(status_code=404, detail="Not found")

    return JSONResponse(content=content)


@app.put("/change-name", status_code=200)
def editName(request: Request, name: NewName, session_id: Optional[str] = Cookie(None),
             username: Optional[str] = Cookie(None)):

    if not authenticatedUser(getCookie('session_id', request.headers['cookies']), getCookie('username', request.headers['cookies'])):
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not name.new:
        raise HTTPException(status_code=400, detail="Invalid request")

    content = {'changedName': False}

    if medicines.find_one_and_update(
        {'_id': ObjectId(name.medicine_id)},
        {'$set': {'name': name.new}}

    ):
        content['changedName'] = True

    return JSONResponse(content=content)


@app.put("/change-date", status_code=200)
def editDate(request: Request, date: NewDate, session_id: Optional[str] = Cookie(None),
             username: Optional[str] = Cookie(None)):

    if not authenticatedUser(getCookie('session_id', request.headers['cookies']), getCookie('username', request.headers['cookies'])):
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not date.new or not date.last:
        raise HTTPException(status_code=400, detail="Invalid request")

    content = {'changedDate': False}

    medicine = dict(medicines.find_one({'_id': ObjectId(date.medicine_id)}))

    for badge in range(len(medicine['badges'])):

        if medicine['badges'][badge]['date'] == date.last:
            medicine['badges'][badge]['date'] = date.new

    if medicine != medicines.find_one({'_id': ObjectId(date.medicine_id)}):
        content['changedDate'] = True

    medicines.delete_one({'_id': ObjectId(date.medicine_id)})
    medicines.insert_one(medicine)

    return JSONResponse(content=content)


@app.delete("/remove-expired-badges/{medicineID}", status_code=200)
def removeExpiredBadges(request: Request, medicineID: str, session_id: Optional[str] = Cookie(None), username: Optional[str] = Cookie(None)):

    if not authenticatedUser(getCookie('session_id', request.headers['cookies']), getCookie('username', request.headers['cookies'])):
        raise HTTPException(status_code=401, detail="Unauthorized")

    content = {'removedExpired': False}
    medicine = dict(medicines.find_one({'_id': ObjectId(medicineID)}))
    expired = []

    for badge in range(len(medicine['badges'])):
        if expiredDate(medicine['badges'][badge]['date']):
            expired.append(badge)

    for cur in expired:
        medicine['badges'] = medicine['badges'][: cur] + \
            medicine['badges'][cur + 1:]

    if medicine != medicines.find_one({'_id': ObjectId(medicineID)}):
        medicines.delete_one({'_id': ObjectId(medicineID)})
        medicines.insert_one(medicine)
        content['removedExpired'] = True

    else:
        raise HTTPException(status_code=400, detail="Invalid request")

    return JSONResponse(content=content)
