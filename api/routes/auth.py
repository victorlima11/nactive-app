from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from schemas import UserCreate, LoginRequest
from database import get_db
from services.auth_services import get_password_hash, verify_password
from models import User
from sqlalchemy.future import select
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from jose import  jwt
from jose.exceptions import JWTError  
from schemas import Token
from sqlalchemy.sql.expression import or_
from sqlalchemy.orm import Session



router = APIRouter(prefix="/auth", tags=["Auth"])

SECRET_KEY = "asoikmda"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(sub: str):  
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": str(sub), "exp": expire}  

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt



def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        print("Token recebido:", token)  
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=401, detail="Usuário não encontrado")
        return user
    except JWTError as e:
        print("Erro ao decodificar token:", str(e))
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")



@router.post("/login", response_model=Token)
async def login(user_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = db.execute(select(User).where(or_(User.username == user_data.identifier, User.email == user_data.identifier)))
    user = result.scalars().first()
    
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Credenciais inválidas")
    
    access_token = create_access_token(sub=user.id)
    
    return {"access_token": access_token, "token_type": "bearer"}



@router.post("/register")
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    
    result = db.execute(select(User).where(User.username == user_data.username))
    user = result.scalars().first()
    if user:
        raise HTTPException(status_code=400, detail="Usuário já existe")

    
    hashed_password = get_password_hash(user_data.password)
    new_user = User(username=user_data.username, email=user_data.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()

    return {"message": "Usuário registrado com sucesso!"}

