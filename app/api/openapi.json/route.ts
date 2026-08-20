import { NextResponse } from "next/server";

export async function GET() {
  const openapiSpec = {
    openapi: "3.0.0",
    info: {
      title: "MyDevVlog Serverless REST API",
      version: "1.0.0",
      description: "전혜원의 미니멀 기술 블로그에서 사용하는 서버리스 REST API 명세서입니다.",
    },
    servers: [
      {
        url: "/",
        description: "현재 호스트 서버 (Vercel 또는 localhost)",
      },
    ],
    paths: {
      "/api/posts": {
        get: {
          summary: "전체 블로그 포스트 목록 조회",
          parameters: [
            {
              name: "published",
              in: "query",
              required: false,
              schema: {
                type: "boolean",
                default: true,
              },
              description: "true인 경우 발행된 글만, false인 경우 전체 글(임시저장 포함)을 반환합니다.",
            },
          ],
          responses: {
            "200": {
              description: "성공적으로 목록을 반환함",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Post",
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "새 블로그 포스트 생성 (어드민 전용)",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PostCreate",
                },
              },
            },
          },
          responses: {
            "201": {
              description: "포스트 생성 성공",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/CreatePostResponse",
                  },
                },
              },
            },
          },
        },
      },
      "/api/posts/{id}": {
        get: {
          summary: "특정 블로그 포스트 상세 조회",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "포스트의 고유 슬러그 ID",
            },
          ],
          responses: {
            "200": {
              description: "포스트 상세 정보 반환",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Post",
                  },
                },
              },
            },
            "404": {
              description: "포스트를 찾을 수 없음",
            },
          },
        },
        put: {
          summary: "기존 블로그 포스트 수정 (어드민 전용)",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "수정할 포스트의 고유 ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PostUpdate",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "포스트 수정 완료",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/GenericResponse",
                  },
                },
              },
            },
            "404": {
              description: "포스트를 찾을 수 없음",
            },
          },
        },
        delete: {
          summary: "포스트 삭제 (어드민 전용)",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "삭제할 포스트의 고유 ID",
            },
          ],
          responses: {
            "200": {
              description: "포스트 삭제 성공",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/GenericResponse",
                  },
                },
              },
            },
            "404": {
              description: "포스트를 찾을 수 없음",
            },
          },
        },
      },
      "/api/posts/{id}/view": {
        post: {
          summary: "포스트 조회수 1 증가 (중복 방지 필터 거침)",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "포스트의 고유 ID",
            },
          ],
          responses: {
            "200": {
              description: "조회수 증가 성공",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/GenericResponse",
                  },
                },
              },
            },
          },
        },
      },
      "/api/posts/{id}/comments": {
        post: {
          summary: "포스트에 새 댓글 작성",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "댓글을 달 포스트의 고유 ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CommentCreate",
                },
              },
            },
          },
          responses: {
            "201": {
              description: "댓글 작성 완료",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/CreateCommentResponse",
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Post: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            summary: { type: "string" },
            content: { type: "string" },
            category: { type: "string" },
            tags: {
              type: "array",
              items: { type: "string" },
            },
            createdAt: { type: "string" },
            views: { type: "integer" },
            likes: { type: "integer" },
            isPublished: { type: "boolean" },
            readTime: { type: "integer" },
            comments: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Comment",
              },
            },
          },
        },
        PostCreate: {
          type: "object",
          required: ["title", "content", "category"],
          properties: {
            title: { type: "string" },
            summary: { type: "string" },
            content: { type: "string" },
            category: { type: "string" },
            tags: {
              type: "array",
              items: { type: "string" },
            },
            isPublished: { type: "boolean", default: true },
          },
        },
        PostUpdate: {
          type: "object",
          properties: {
            title: { type: "string" },
            summary: { type: "string" },
            content: { type: "string" },
            category: { type: "string" },
            tags: {
              type: "array",
              items: { type: "string" },
            },
            isPublished: { type: "boolean" },
          },
        },
        Comment: {
          type: "object",
          properties: {
            id: { type: "string" },
            postId: { type: "string" },
            author: { type: "string" },
            content: { type: "string" },
            createdAt: { type: "string" },
          },
        },
        CommentCreate: {
          type: "object",
          required: ["author", "content"],
          properties: {
            author: { type: "string" },
            content: { type: "string" },
          },
        },
        CreatePostResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            post: { $ref: "#/components/schemas/Post" },
          },
        },
        CreateCommentResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            comment: { $ref: "#/components/schemas/Comment" },
          },
        },
        GenericResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
          },
        },
      },
    },
  };

  return NextResponse.json(openapiSpec);
}
