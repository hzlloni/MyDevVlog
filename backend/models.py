from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    category = Column(String, default="Frontend")
    tags = Column(String, default="")  # Comma-separated tags (e.g. "React,Next.js")
    createdAt = Column(String, default=lambda: datetime.date.today().isoformat())
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    isPublished = Column(Boolean, default=True)
    readTime = Column(Integer, default=1)

    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(String, primary_key=True, index=True)
    postId = Column(String, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    author = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    createdAt = Column(String, default=lambda: datetime.datetime.now().strftime("%Y-%m-%d %H:%M"))

    post = relationship("Post", back_populates="comments")
