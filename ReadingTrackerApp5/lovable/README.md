# 프로젝트 폴더 구조 및 개발 규칙

## 폴더 구조(React Native 스타일)

```
src/
├── assets/           # 이미지, 폰트, 아이콘 등 정적 리소스
├── components/       # 재사용 가능한 UI/도메인 컴포넌트
│   └── ui/           # 버튼, 카드 등 순수 UI 컴포넌트
├── screens/          # 각 주요 화면(페이지) 단위 컴포넌트
├── navigations/      # 네비게이션(Stack, Tab 등) 관련 설정
├── hooks/            # 커스텀 훅
├── lib/              # 유틸리티, API, 서비스, 데이터 관리 등
├── contexts/         # 글로벌 상태/컨텍스트 관리
├── constants/        # 상수, 타입, 더미데이터 등
├── theme/            # 테마, 스타일, 색상 팔레트 등
└── App.tsx           # 앱 진입점
```

## 네이밍/컴포넌트 규칙
- 폴더/파일명: 카멜케이스 또는 파스칼케이스 (예: BookLibrary.tsx, useBookSearch.ts)
- 컴포넌트명: 파스칼케이스 (예: ReadingStats)
- 훅/유틸: use로 시작 (예: useReadingTimer, useIsMobile)
- 상수/타입: 대문자/파스칼케이스 (예: BOOK_STATUS, BookType)
- 경로 alias는 `@/`로 시작 (예: @/components/BookLibrary)

## 개발 규칙 요약
- 모든 소스는 lovable/src 하위에 작성
- UI 라이브러리: shadcn-ui, Radix UI, Lucide 아이콘
- 스타일: Tailwind CSS 유틸리티 우선
- 상태관리: React 내장 훅, 필요시 react-query
- 입력 폼은 유효성 검증 필수
- 컴포넌트는 최대한 재사용 가능하게 설계
- 모바일 우선 반응형, 다크모드 지원
- 주요 액션(등록/삭제/오류 등)은 토스트/알림으로 피드백
- 폼, 다이얼로그, 모달 등은 접근성 고려
- 외부 API 연동은 mock 또는 주석 처리, 실제 연동시 별도 명시
- 상세 규칙은 .cursorrules 참고

---

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/be8932b1-3aa5-409c-84bc-f70293765524

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/be8932b1-3aa5-409c-84bc-f70293765524) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/be8932b1-3aa5-409c-84bc-f70293765524) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
