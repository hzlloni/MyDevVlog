from sqlalchemy.orm import Session
from . import models, schemas
import uuid
import datetime

# ==========================================
# 📝 Post CRUD
# ==========================================

def get_posts(db: Session, published_only: bool = True):
    query = db.query(models.Post)
    if published_only:
        query = query.filter(models.Post.isPublished == True)
    return query.order_by(models.Post.createdAt.desc()).all()

def get_post(db: Session, post_id: str):
    return db.query(models.Post).filter(models.Post.id == post_id).first()

def create_post(db: Session, post: schemas.PostCreate):
    # Calculate estimated read time: ~400 characters per minute
    estimated_read_time = max(1, round(len(post.content) / 400))
    
    # Generate URL-friendly slug ID or UUID
    post_id = str(uuid.uuid4())[:8] # Short unique ID
    
    db_post = models.Post(
        id=post_id,
        title=post.title,
        summary=post.summary,
        content=post.content,
        category=post.category,
        tags=",".join(post.tags),
        isPublished=post.isPublished,
        readTime=estimated_read_time
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def update_post(db: Session, post_id: str, post: schemas.PostUpdate):
    db_post = get_post(db, post_id)
    if not db_post:
        return None
    
    db_post.title = post.title
    db_post.summary = post.summary
    db_post.content = post.content
    db_post.category = post.category
    db_post.tags = ",".join(post.tags)
    db_post.isPublished = post.isPublished
    db_post.readTime = max(1, round(len(post.content) / 400))
    
    db.commit()
    db.refresh(db_post)
    return db_post

def delete_post(db: Session, post_id: str):
    db_post = get_post(db, post_id)
    if not db_post:
        return False
    db.delete(db_post)
    db.commit()
    return True

def increment_views(db: Session, post_id: str):
    db_post = get_post(db, post_id)
    if db_post:
        db_post.views += 1
        db.commit()
        db.refresh(db_post)
    return db_post


# ==========================================
# 💬 Comment CRUD
# ==========================================

def create_comment(db: Session, post_id: str, comment: schemas.CommentCreate):
    comment_id = str(uuid.uuid4())
    db_comment = models.Comment(
        id=comment_id,
        postId=post_id,
        author=comment.author,
        content=comment.content
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def delete_comment(db: Session, comment_id: str):
    db_comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not db_comment:
        return False
    db.delete(db_comment)
    db.commit()
    return True
