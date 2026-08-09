# 📝 MyDevVlog: 전혜원의 서버리스 미니멀 기술 블로그 프로젝트 명세서

본 문서는 개발자 전혜원의 개인 기술 블로그 및 포트폴리오 플랫폼 **MyDevVlog**의 기술 아키텍처, 기능 명세, 데이터베이스 스키마 및 가동 방법을 상세하게 정리한 종합 기술 사양서입니다.

---

## 💻 1. 프로젝트 개요 (Overview)

* **목표**: 복잡한 서버 가동 비용과 인프라 설정 공수 없이 24시간 가동되는 미니멀리즘 감성의 블로그 플랫폼 구축.
* **아키텍처**: 백엔드 서버(FastAPI) 개발 단계를 거친 후, 배포 및 관리 편의성을 극대화하기 위해 백엔드를 생략하고 **Next.js 프론트엔드가 Supabase(PostgreSQL) 클라우드 DB와 직접 암호화 통신을 처리하는 '완전 무서버(Serverless) 풀스택 구조'**로 전환하였습니다.
* **디자인 특징**: 1열 형태의 미니멀 배치, 딥 인디고-바이올렛 포인트 라인, 귀여운 몬치치 프로필 위젯 적용.

---

## 🛠️ 2. 기술 스택 명세 (Technology Stack)

### ① Frontend Spec
* **Framework**: `Next.js v16 (App Router)`
* **Language**: `TypeScript (TS)`
* **CSS Engine**: `Tailwind CSS v4`
* **Icons**: `Lucide React`
* **Parser**: `Markdown & LaTeX Equation Parser` (머신러닝 수학 공식 및 정규식 치환 탑재)

### ② Database Spec (Serverless)
* **Cloud DB**: `Supabase (PostgreSQL 15+)`
* **Client SDK**: `@supabase/supabase-js v2`
* **Access Control**: `Row Level Security (RLS)` 정책 활성화 및 Public 읽기/쓰기 허가

### ③ Hosting & DevOps
* **Hosting**: `Vercel`
* **CI/CD**: Git Push 시 자동 트리거 배포 및 Edge CDN 최적화

---

## ⚙️ 3. 핵심 기능 동작 원리 (Core Features)

### ① 다중 테마 모드 (Dark/Light/System)
* **Tailwind v4 설정**: `globals.css` 내부에 `@variant dark (&:where(.dark, .dark *));` 규칙을 명시하여 HTML 태그에 `dark` 클래스가 주입될 때 Tailwind가 다크 모드 속성(`dark:`)들을 정상 인식하고 부드러운 트랜지션 애니메이션과 함께 테마를 바꿉니다.

### ② 정밀 조회수(views) 어뷰징 차단 필터
* **작동**: 사용자가 글에 접속하면 브라우저의 임시 세션 데이터(`sessionStorage`)에 `viewed_글ID` 가 저장되어 있는지 검사합니다.
* **중복 방지**: 세션 데이터가 없을 때만 Supabase DB에 `views = views + 1` 업데이트 요청을 날리고 브라우저 세션에 조회 완료 도장을 찍습니다. 새로고침 연타 시 발생하는 불필요한 트래픽 및 수치 뻥튀기를 완벽하게 방어합니다.

### ③ 관계형 댓글(comments) 및 Cascade 연동
* **구조**: `comments` 테이블은 `posts` 테이블의 `id`를 외래키(`postId`)로 참조합니다.
* **영속성**: 관리자가 `/admin` 대시보드에서 글을 삭제하면, 데이터베이스 단에서 이와 엮여 있던 모든 댓글 데이터들이 `ON DELETE CASCADE` 규칙에 의해 자동 추적 소멸되어 유령 데이터가 남지 않습니다.

---

## 💾 4. 데이터베이스 테이블 구조 (DDL SQL)

Supabase 대시보드 내 **`SQL Editor`**에 아래 쿼리를 입력하고 실행(`Run`)하여 테이블을 빌드합니다.

```sql
-- 1. posts 테이블 생성
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Frontend',
  tags TEXT[] DEFAULT '{}',
  "createdAt" TEXT NOT NULL,
  views INT8 DEFAULT 0,
  likes INT8 DEFAULT 0,
  "isPublished" BOOLEAN DEFAULT TRUE,
  "readTime" INT8 DEFAULT 1
);

-- 2. comments 테이블 생성
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "postId" TEXT REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  "createdAt" TEXT NOT NULL
);

-- 3. RLS (행 단위 보안) 우회 허용 정책 (누구나 읽고 쓰기 가능하도록)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access on posts" 
ON posts FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public access on comments" 
ON comments FOR ALL TO public USING (true) WITH CHECK (true);

-- 4. 최초 웰컴용 더미 데이터 주입
INSERT INTO posts (id, title, summary, content, category, tags, "createdAt", views, likes, "isPublished", "readTime")
VALUES 
  (
    'react-vs-nextjs',
    'React와 Next.js, 정확히 뭐가 다른가?',
    '싱글 페이지 어플리케이션(SPA) 라이브러리인 React와 서버 사이드 렌더링(SSR) 및 풀스택 프레임워크인 Next.js의 근본적인 차이점과 선택 기준을 알아봅니다.',
    '웹 프론트엔드 생태계에서 가장 널리 쓰이는 두 기술인 React와 Next.js의 근본적인 철학과 기능적 차이를 분석합니다.\n\n## 1. 라이브러리(Library) vs 프레임워크(Framework)\n\n가장 큰 차이는 **주도권(Inversion of Control)**에 있습니다.\n\n* **React는 라이브러리입니다.**\n  * 개발자가 전체적인 애플리케이션 구조를 직접 설계하고 제어합니다.\n  * 라우팅(React Router), 상태 관리(Redux, Recoil), 빌드 설정(Webpack, Vite) 등을 자유롭게 선택하여 장착해야 합니다.\n  \n* **Next.js는 프레임워크입니다.**\n  * 규칙과 틀이 이미 정해져 있으며, 개발자는 그 규칙 안에서 코드를 작성합니다.\n  * 폴더 구조 기반의 자동 라우팅, 내장 빌드 시스템, 스타일링 가이드 등이 기본 제공되므로 빠른 생산성을 보장합니다.\n\n## 2. 클라이언트 사이드 렌더링(CSR) vs 서버 사이드 렌더링(SSR)\n\n* **React (기본적으로 CSR)**\n  * 브라우저가 빈 HTML과 거대한 Javascript 번들을 다운로드한 뒤, 클라이언트 단에서 화면을 그립니다.\n  * 초기 로딩 속도가 비교적 느리고, 검색엔진 최적화(SEO)에 불리할 수 있습니다.\n  \n* **Next.js (다양한 렌더링 지원)**\n  * 서버에서 HTML을 미리 렌더링하여 브라우저에 전달합니다 (SSR / SSG).\n  * 검색엔진 봇이 렌더링된 완벽한 HTML을 읽을 수 있으므로 **SEO에 강력**하며, 사용자는 첫 화면을 매우 빠르게 마주하게 됩니다.',
    'Frontend',
    ARRAY['React', 'Next.js', 'Web Dev'],
    '2026-07-10',
    0,
    0,
    TRUE,
    4
  );
```

---

## 🚀 5. 로컬 개발 환경 가동 프로세스

### Step 1. 패키지 모듈 설치
```bash
cd minimal-blog
npm install
```

### Step 2. 로컬 환경 변수 설정
`minimal-blog/.env.local` 파일 생성 후 아래 정보 기입:
```text
NEXT_PUBLIC_SUPABASE_URL=https://lgvpuepytluzzaagzmbw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_AWifvZXuaTwyEf4BOVP_uw_Sn7UOYIo
```

### Step 3. 개발 서버 구동
```bash
npm run dev
```
가동 후 웹 브라우저에서 `http://localhost:3000` 으로 정상 접속 확인.
