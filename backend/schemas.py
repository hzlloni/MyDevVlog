from pydantic import BaseModel, Field
from typing import List, Optional

# ==========================================
# 💬 Comment Schemas
# ==========================================
class CommentBase(BaseModel):
    author: str
    content: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: str
    postId: str
    createdAt: str

    class Config:
        from_attributes = True


# ==========================================
# 📝 Post Schemas
# ==========================================
class PostBase(BaseModel):
    title: str
    summary: str
    content: str
    category: str
    tags: List[str]
    isPublished: bool

class PostCreate(PostBase):
    pass

class PostUpdate(PostBase):
    pass

class Post(BaseModel):
    id: str
    title: str
    summary: str
    content: str
    category: str
    tags: List[str]
    createdAt: str
    views: int
    likes: int
    isPublished: bool = Field(..., serialization_alias="isPublished")
    readTime: int
    comments: List[Comment] = []

    class Config:
        from_attributes = True

    @classmethod
    def model_validate(cls, obj, **kwargs):
        if hasattr(obj, "tags") and isinstance(obj.tags, str):
            tags_list = [t.strip() for t in obj.tags.split(",") if t.strip()]
            data = {c.name: getattr(obj, c.name) for c in obj.__table__.columns}
            data["tags"] = tags_list
            data["comments"] = [Comment.model_validate(c) for c in obj.comments]
            return cls(**data)
        return super().model_validate(obj, **kwargs)


# ==========================================
# 🔑 Authentication Schemas
# ==========================================
class LoginRequest(BaseModel):
    password: str

class LoginResponse(BaseModel):
    success: bool
    token: Optional[str] = None
    message: str

class GenericResponse(BaseModel):
    success: bool
    message: str

class CreatePostResponse(BaseModel):
    success: bool
    post: Post

class CreateCommentResponse(BaseModel):
    success: bool
    comment: Comment
