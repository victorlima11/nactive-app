from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()

@router.get("/")
def hello_world():
    return {"message: Hello World!"}