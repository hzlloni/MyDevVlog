import { Post } from "./blogTypes";

export const initialPosts: Post[] = [
  {
    id: "ml-math-latex",
    title: "머신러닝 이해를 위한 기초 선형대수학 & 경사하강법 수학 공식",
    summary: "머신러닝의 최적화 기초가 되는 선형 회귀와 경사 하강법(Gradient Descent)의 수학적 원리를 LaTeX 수식을 통해 상세히 알아봅니다.",
    category: "AI",
    tags: ["Machine Learning", "Mathematics", "LaTeX"],
    createdAt: "2026-07-15",
    views: 120,
    likes: 18,
    isPublished: true,
    readTime: 4,
    comments: [
      {
        id: "c1",
        author: "김수학",
        content: "어려운 미적분 기호들이 정리되어 있어서 이해하기 훨씬 수월해졌네요!",
        createdAt: "2026-07-15 17:20"
      }
    ],
    content: `머신러닝 모델, 특히 딥러닝 모델의 학습은 본질적으로 수학적인 최적화 과정입니다. 가장 단순하지만 강력한 알고리즘인 **선형 회귀(Linear Regression)**와 이를 최적화하는 **경사 하강법(Gradient Descent)**의 수학적 관계를 알아봅니다.

## 1. 선형 회귀 모델

선형 회귀는 입력값 x와 출력값 y의 관계를 다음과 같은 단순한 선형 함수로 가정합니다.

> **y = wx + b**

여기서 **w**는 기울기 혹은 가중치(Weight)를 의미하며, **b**는 절편 혹은 편향(Bias)을 나타냅니다. 

특성(Feature)이 여러 개인 다차원 공간에서는 행렬 곱셈을 사용하여 예측값(ŷ)을 다음과 같이 연산합니다.

> **ŷ = wᵀx + b**

---

## 2. 손실 함수 (Loss Function)

예측값 ŷ와 실제값 y 사이의 오차를 구하여 모델의 성능을 평가하기 위해 **평균 제곱 오차(Mean Squared Error, MSE)**를 사용합니다. 데이터 개수가 m개일 때 손실 공식은 다음과 같습니다.

> **L(w, b) = (1 / 2m) * Σ (ŷ⁽ⁱ⁾ - y⁽ⁱ⁾)²**

우리는 이 손실 함수 L의 결과값을 최소화할 수 있는 최적의 w와 b를 찾아내야 합니다.

---

## 3. 경사 하강법 (Gradient Descent)

손실 함수 그래프상에서 기울기(Gradient)를 구하여, 최저점(손실 최소값)을 향해 가중치를 조금씩 조절해 나가는 최적화 알고리즘입니다.

업데이트 공식은 다음과 같이 손실 함수에 대한 편미분을 사용하여 정의됩니다. (여기서 α는 학습률 Learning Rate입니다.)

> **w ← w - α * (∂L / ∂w)**
>
> **b ← b - α * (∂L / ∂b)**

이 편미분 방정식을 반복 실행함으로써 기울기가 0에 수렴하는 글로벌 최소값(Global Minimum) 지점에 도달하게 됩니다.`
  },
  {
    id: "react-vs-nextjs",
    title: "React와 Next.js, 정확히 뭐가 다른가?",
    summary: "싱글 페이지 어플리케이션(SPA) 라이브러리인 React와 서버 사이드 렌더링(SSR) 및 풀스택 프레임워크인 Next.js의 근본적인 차이점과 선택 기준을 알아봅니다.",
    category: "Frontend",
    tags: ["React", "Next.js", "Web Dev"],
    createdAt: "2026-07-10",
    views: 245,
    likes: 35,
    isPublished: true,
    readTime: 4,
    comments: [],
    content: `웹 프론트엔드 생태계에서 가장 널리 쓰이는 두 기술인 React와 Next.js의 근본적인 철학과 기능적 차이를 분석합니다.

## 1. 라이브러리(Library) vs 프레임워크(Framework)

가장 큰 차이는 **주도권(Inversion of Control)**에 있습니다.

* **React는 라이브러리입니다.**
  * 개발자가 전체적인 애플리케이션 구조를 직접 설계하고 제어합니다.
  * 라우팅(React Router), 상태 관리(Redux, Recoil), 빌드 설정(Webpack, Vite) 등을 자유롭게 선택하여 장착해야 합니다.
  
* **Next.js는 프레임워크입니다.**
  * 규칙과 틀이 이미 정해져 있으며, 개발자는 그 규칙 안에서 코드를 작성합니다.
  * 폴더 구조 기반의 자동 라우팅, 내장 빌드 시스템, 스타일링 가이드 등이 기본 제공되므로 빠른 생산성을 보장합니다.

## 2. 클라이언트 사이드 렌더링(CSR) vs 서버 사이드 렌더링(SSR)

* **React (기본적으로 CSR)**
  * 브라우저가 빈 HTML과 거대한 Javascript 번들을 다운로드한 뒤, 클라이언트 단에서 화면을 그립니다.
  * 초기 로딩 속도가 비교적 느리고, 검색엔진 최적화(SEO)에 불리할 수 있습니다.
  
* **Next.js (다양한 렌더링 지원)**
  * 서버에서 HTML을 미리 렌더링하여 브라우저에 전달합니다 (SSR / SSG).
  * 검색엔진 봇이 렌더링된 완벽한 HTML을 읽을 수 있으므로 **SEO에 강력**하며, 사용자는 첫 화면을 매우 빠르게 마주하게 됩니다.`
  }
];
