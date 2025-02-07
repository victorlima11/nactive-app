
from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import select
from models import Note, User
from schemas import NoteCreate, NoteResponse
from database import get_db
from datetime import datetime
from routes.auth import get_current_user

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("/", response_model=list[NoteResponse])
def list_notes(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = db.execute(select(Note).filter(Note.owner_id == user.id))
    notes = result.scalars().all()
    return notes


@router.post("/", response_model=NoteResponse, status_code=201)
def create_note(note: NoteCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_note = Note(
        title=note.title,
        content=note.content,
        owner_id=user.id,  
        created_at=datetime.utcnow()
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note



@router.get("/{note_id}", response_model=NoteResponse)
def get_note(note_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = db.execute(select(Note).filter(Note.id == note_id, Note.owner_id == user.id))
    note = result.scalars().first()
    if not note:
        raise HTTPException(status_code=404, detail="Nota não encontrada")
    return note

@router.put("/{note_id}", response_model=NoteResponse)
def update_note(note_id: int, note: NoteCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = db.execute(select(Note).filter(Note.id == note_id, Note.owner_id == user.id))
    db_note = result.scalars().first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Nota não encontrada")
    
    db_note.title = note.title
    db_note.content = note.content
    db.commit()
    db.refresh(db_note)
    return db_note


@router.delete("/{note_id}", status_code=204)
def delete_note(note_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = db.execute(select(Note).filter(Note.id == note_id, Note.owner_id == user.id))
    db_note = result.scalars().first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Nota não encontrada")
    
    db.delete(db_note)
    db.commit()
    return {"message": "Nota deletada com sucesso"}
