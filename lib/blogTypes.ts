export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  createdAt: string;
  views: number;
  likes: number;
  isPublished: boolean;
  readTime: number; // in minutes
  comments: Comment[];
}
