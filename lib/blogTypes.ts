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

// ==========================================
// 🌐 API Request & Response Specifications
// ==========================================

export interface LoginRequest {
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  message: string;
}

export interface CreatePostRequest {
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  isPublished: boolean;
}

export interface CreatePostResponse {
  success: boolean;
  post: Post;
}

export interface UpdatePostRequest {
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  isPublished: boolean;
}

export interface GenericResponse {
  success: boolean;
  message: string;
}

export interface CreateCommentRequest {
  author: string;
  content: string;
}

export interface CreateCommentResponse {
  success: boolean;
  comment: Comment;
}
