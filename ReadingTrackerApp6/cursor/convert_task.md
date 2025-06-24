---
description: 
globs: 
alwaysApply: false
---
# React Web(@/lovable) → React Native 변환 계획 (convert_task.mdc)
- 변환된 소스코드는 `ReadingTrackerAppExpo`에 생성해줘

## 1. 프로젝트 준비
- [x] 1.1. Expo(React Native) 프로젝트 생성 및 초기화. 프로젝트 명을 ReadingTrackerAppExpo으로 지정해줘.
- [x] 1.2. 필수 패키지 설치 (react-native-web, @expo/vector-icons 등)
- [x] 1.3. 폴더 구조 설계 및 src/ 디렉토리 준비

## 2. 디자인 시스템/토큰 분리
- [x] 2.1. index.css, App.css 등에서 색상, 폰트, radius 등 디자인 토큰 추출
- [x] 2.2. JS/TS 객체(theme.ts)로 변환

## 3. 공통 로직/유틸 분리
- [x] 3.1. hooks, lib 등 비즈니스 로직/유틸 함수 분리 및 이동
- [x] 3.2. 타입/인터페이스 정의 (Book, User 등)

## 4. UI 컴포넌트 변환
- [ ] 4.1. 주요 컴포넌트(예: BookLibrary, BookDetail, AddBookDialog 등)부터 View/Text 등으로 변환
- [ ] 4.2. expo/vector-icons로 아이콘 교체
- [ ] 4.3. FlatList, ScrollView 등 네이티브 리스트/스크롤 적용
- [ ] 4.4. 스타일은 StyleSheet 또는 theme 기반으로 적용

## 5. 페이지/화면 변환
- [ ] 5.1. Index, NotFound 등 페이지를 Stack/Modal 구조로 변환
- [ ] 5.2. 네비게이션(하단 탭, 모달 등) 구현

## 6. 기능별 세부 구현
- [ ] 6.1. 책 추가/삭제/수정 기능 구현
- [ ] 6.2. 검색 기능 구현 (TextInput + FlatList)
- [ ] 6.3. 타이머, 통계, 설정 등 부가 기능 변환

## 7. 테스트 및 디버깅
- [ ] 7.1. Expo 앱에서 전체 동작 테스트
- [ ] 7.2. UI/UX 개선 및 버그 수정

## 8. 문서화 및 마무리
- [ ] 8.1. README, 사용법, 주요 구조 문서화
- [ ] 8.2. 코드 정리 및 최종 배포
