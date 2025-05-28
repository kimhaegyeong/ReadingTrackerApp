# 바이브 코딩을 위한 ReactNative 독서기록 앱 개발 문서

## 1. 프로젝트 컨텍스트 문서

### 프로젝트 개요
"북트래커(BookTracker)"는 사용자가 읽은 책을 기록하고 관리할 수 있는 모바일 애플리케이션입니다. 사용자들은 읽은 책, 현재 읽고 있는 책, 그리고 읽고 싶은 책들을 관리하고, 독서 진행 상황을 추적하며, 독서 감상과 인상 깊은 구절을 기록할 수 있습니다.

### 기술 스택
- **프레임워크**: React Native (Cross-platform), Expo SDK 53
- **상태 관리**: Redux Toolkit
- **로컬 데이터베이스**: SQLite
- **UI 라이브러리**: React Native Paper
- **네비게이션**: React Navigation v6
- **외부 API**: Google Books API (책 정보 검색)
- **인증**: Firebase Authentication
- **클라우드 저장소**: Firebase Firestore (선택적)



### 필요한 라이브러리 설치
- 최대한 설치된 라이브러리를 사용해서 개발해줘.
- 필요한 라이브러리는 npx expo install 명령어를 사용해서 설치해줘.

### 아키텍처
```
북트래커 앱
├── 프레젠테이션 레이어 (UI 컴포넌트, 화면)
├── 비즈니스 로직 레이어 (Redux, 훅)
├── 데이터 액세스 레이어 (API 클라이언트, 로컬 저장소) 
└── 인프라 레이어 (Firebase, 외부 서비스)
```


### 주요 컴포넌트
1. **인증 시스템**: 사용자 등록, 로그인, 프로필 관리
2. **책 관리 시스템**: 책 추가, 편집, 삭제, 카테고리화
3. **독서 진행 추적기**: 페이지 진행 상황, 완료율, 독서 시간 기록
4. **메모 및 인용구 관리**: 독서 중 메모, 인용구 저장 기능
5. **통계 및 분석**: 독서 패턴, 완료율, 장르별 통계 등
6. **백업 및 동기화**: 클라우드 백업 및 여러 기기 간 동기화

### 폴더 구조
```
src/
├── assets/            # 이미지, 폰트, 기타 정적 파일
├── components/        # 재사용 가능한 UI 컴포넌트
│   ├── common/        # 범용 컴포넌트
│   ├── books/         # 책 관련 컴포넌트
│   └── reading/       # 독서 관련 컴포넌트
├── navigation/        # 라우팅 및 내비게이션 설정
├── screens/           # 앱 화면
│   ├── auth/          # 인증 관련 화면
│   ├── bookshelf/     # 책장 관련 화면
│   ├── reading/       # 독서 관련 화면
│   └── stats/         # 통계 관련 화면
├── store/             # Redux 스토어 설정
│   ├── slices/        # Redux 슬라이스
│   └── hooks.js       # 커스텀 Redux 훅
├── services/          # 외부 서비스 및 API 통신
│   ├── api/           # API 클라이언트
│   ├── storage/       # 로컬 스토리지 작업
│   └── firebase/      # Firebase 서비스
├── utils/             # 유틸리티 함수
├── constants/         # 상수 정의
└── App.js             # 앱 진입점
```


## 2. 요구사항 명세서

### 기능적 요구사항

## 1. 사용자 인증 시스템
### 회원가입 과정
1. **이메일 회원가입** (필수)
    - 사용자는 단계별 회원가입 과정을 진행할 수 있다:
        - **1단계**: 이메일 주소 입력 및 유효성 검증
            - 유효한 이메일 형식 검사
            - 실시간 이메일 중복 확인
            - 이메일 인증 코드 발송 (6자리 숫자)

        - **2단계**: 비밀번호 설정 및 기본 정보 입력
            - 비밀번호 및 비밀번호 확인 입력
            - 닉네임 입력 (2-20자, 특수문자 제한)
            - 생년월일 선택 (선택 사항)

        - **3단계**: 독서 프로필 설정
            - 선호 장르 선택 (최소 1개, 최대 5개)
            - 평균 독서량 선택 (주간 기준)
            - 독서 목표 초기 설정

    - 필수 입력 필드에 대한 인라인 유효성 검사가 실시간으로 제공된다.
    - 회원가입 도중 앱을 종료하더라도 입력 데이터가 임시 저장되어 7일 내 복귀 시 이어서 진행할 수 있다.
    - 이메일 인증은 회원가입 완료 후 30일 이내에 완료해야 하며, 미인증 시 알림이 제공된다 (7일, 15일, 25일, 29일차).
    - 미인증 상태에서는 다음 기능이 제한된다:
        - 책 메모 클라우드 동기화
        - 소셜 기능 사용
        - 프리미엄 기능 구매

2. **비밀번호 요구사항** (필수)
    - 사용자 비밀번호는 다음 조건을 충족해야 한다:
        - 최소 8자 이상, 최대 64자 이하
        - 다음 중 3가지 이상 포함:
            - 영문 대문자 (A-Z)
            - 영문 소문자 (a-z)
            - 숫자 (0-9)
            - 특수문자 (!@#$%^&*()-_=+[]{}|;:'",.<>/?`)

        - 연속된 문자/숫자 4개 이상 사용 불가 (예: 1234, abcd)
        - 키보드 배열 연속 4개 이상 사용 불가 (예: qwer, asdf)
        - 이메일 주소, 닉네임과 60% 이상 일치하는 비밀번호 사용 불가

    - 비밀번호 강도는 5단계로 시각적 표시:
        - 매우 약함 (빨강): 기본 요구사항 미충족
        - 약함 (주황): 기본 요구사항만 충족
        - 보통 (노랑): 10자 이상 & 모든 문자 유형 포함
        - 강함 (연두): 12자 이상 & 모든 문자 유형 포함 & 일반 패턴 미사용
        - 매우 강함 (초록): 16자 이상 & 모든 문자 유형 포함 & 고유한 패턴

    - 비밀번호 변경 시 이전 3개 비밀번호와 동일한 비밀번호 사용 불가
    - 비밀번호 생성 도우미 기능 제공 (요구사항을 충족하는 안전한 비밀번호 생성)

3. **소셜 로그인 통합** (권장)
    - 사용자는 다음 소셜 계정으로 인증할 수 있다:
        - Google (필수): 프로필 기본 정보, 이메일 접근 권한만 요청
        - Apple (필수): 이름, 이메일 접근 권한만 요청
        - Facebook (권장): 공개 프로필, 이메일 접근 권한만 요청
        - Twitter/X (선택): 공개 프로필 접근 권한만 요청

    - 소셜 로그인 프로세스:
        - 인증 요청 및 권한 동의 화면 표시
        - 소셜 계정으로부터 기본 정보 수신 (이메일, 이름, 프로필 사진)
        - 이메일 중복 확인:
            - 새 계정: 독서 프로필 설정 단계로 이동
            - 기존 계정: 계정 연결 제안 또는 다른 이메일 사용 안내

    - 소셜 계정 연결 관리:
        - 하나의 북트래커 계정에 여러 소셜 계정 연결 가능 (최대 5개)
        - 계정 페이지에서 연결/해제 관리
        - 마지막 남은 인증 방법 해제 시 경고 메시지 표시

    - 소셜 로그인 오류 처리:
        - 네트워크 오류: 재시도 옵션 및 오프라인 로그인 대안 제공
        - 권한 거부: 필요한 권한과 사유 설명
        - 토큰 만료: 자동 갱신 시도 또는 재인증 안내

4. **프로필 관리** (필수)
    - 사용자는 다음 프로필 정보를 편집할 수 있다:
        - **기본 정보**:
            - 닉네임 (2-20자, 특수문자 일부 허용, 중복 확인)
            - 프로필 사진 (최대 5MB, 지원 형식: JPG, PNG, GIF)
            - 자기소개 (최대 500자)
            - 프로필 테마 색상 (10가지 프리셋 또는 커스텀 색상)

        - **독서 프로필**:
            - 선호 장르 (최대 10개, 우선순위 설정 가능)
            - 좋아하는 작가 (최대 20명)
            - 독서 스타일 (빠른 독서, 깊은 독서, 다중 독서 등)

        - **알림 설정**:
            - 독서 리마인더 (시간 및 주기 설정)
            - 목표 알림 (완료, 지연 등)
            - 앱 업데이트 및 이벤트 알림

        - **공개 설정**:
            - 프로필 공개 범위 (공개, 친구 공개, 비공개)
            - 독서 상태 공개 범위
            - 리뷰 및 메모 공개 범위

    - 프로필 변경 관련 규칙:
        - 닉네임 변경: 30일마다 1회 허용
        - 프로필 사진: 일일 최대 5회 변경 가능
        - 이메일 변경: 본인 확인 절차 필요 (현재 비밀번호 입력 또는 이메일 인증)
        - 계정 연결/해제: 보안 확인 필요 (비밀번호 또는 2단계 인증)

    - 프로필 완성도 표시:
        - 단계별 프로필 완성도 시각화 (0-100%)
        - 추가 정보 입력 시 완성도 상승
        - 80% 이상 완성 시 "프로필 마스터" 뱃지 제공

5. **인증 상태 및 접근 제한** (필수)
    - 인증 상태 관리:
        - 로그인 세션 유지 기간: 기본 90일, 사용자 설정 가능 (1일-1년)
        - 자동 로그인: 토큰 기반 인증으로 앱 재시작 시 자동 로그인
        - 장치 관리: 현재 로그인된 모든 장치 목록 확인 및 원격 로그아웃
        - 비활성 세션: 설정된 기간(기본 30일) 동안 미사용 시 자동 로그아웃

    - 접근 제한 레벨:
        - **레벨 0** (비로그인):
            - 앱 기능 미리보기
            - 공개 도서 정보 검색 및 조회
            - 회원가입 및 로그인

        - **레벨 1** (기본 인증):
            - 개인 책장 관리
            - 독서 상태 기록
            - 기본 통계 확인

        - **레벨 2** (이메일 인증 완료):
            - 클라우드 동기화
            - 메모 및 하이라이트 저장
            - 소셜 기능 사용

        - **레벨 3** (프리미엄):
            - 고급 분석 및 통계
            - 무제한 백업 및 내보내기
            - 광고 제거 및 테마 커스터마이징

    - 보안 관련 기능:
        - 로그인 기록: 최근 10회 로그인 시간, 위치, 장치 정보 제공
        - 의심스러운 활동 감지: 새로운 위치/장치에서 로그인 시 알림
        - 장치 인증: 새 장치 최초 로그인 시 이메일 확인 코드 요구
        - 계정 잠금: 5회 연속 로그인 실패 시 15분간 계정 잠금

## 2. 책 관리 기능
### 책 검색 및 추가
1. **책 검색 기능** (필수)
    - 검색 입력 방식:
        - 텍스트 검색:
            - 실시간 자동 완성 제안
            - 오타 수정 및 유사어 제안
            - 고급 검색 구문 지원 (예: title:"해리 포터" author:롤링)

        - 바코드 스캔:
            - ISBN-10 및 ISBN-13 인식
            - 스캔 후 즉시 결과 표시

        - 음성 검색:
            - 책 제목 및 저자 음성 인식
            - 자연어 쿼리 지원 (예: "JK 롤링이 쓴 해리포터 시리즈")

    - 검색 필터 및 조건:
        - **기본 필터**:
            - 제목: 전체 일치, 부분 일치, 시작/끝 일치
            - 저자: 전체 이름, 성만, 이름만
            - ISBN: 정확한 10자리/13자리 코드
            - 출판사: 출판사명 전체/부분 일치

        - **고급 필터**:
            - 출판년도: 단일 년도 또는 범위 (1900-현재)
            - 언어: 다국어 지원 (한국어, 영어, 일본어, 중국어 우선)
            - 장르/카테고리: 주요 장르 및 하위 카테고리
            - 페이지 수: 범위 지정 (예: 100-300페이지)
            - 평점: 별점 기준 필터링 (4점 이상 등)

    - 검색 결과 표시 및 정렬:
        - 기본 표시 항목:
            - 표지 이미지 (썸네일)
            - 제목 및 부제
            - 저자명
            - 출판 정보 (출판사, 년도)
            - 평균 평점 및 리뷰 수

        - 정렬 옵션:
            - 관련성 (기본값, 검색어 일치도)
            - 출판일 (최신순/오래된순)
            - 인기도 (독자 수 기준)
            - 평점 (높은순/낮은순)
            - 페이지 수 (많은순/적은순)

    - 검색 캐싱 및 오프라인 지원:
        - 최근 검색어 저장 (최대 100개)
        - 최근 검색 결과 캐싱 (최대 500개 책 정보)
        - 자주 검색하는 용어 기록 및 빠른 액세스 제공
        - 오프라인 모드 시 캐시된 검색 결과만 표시 (오프라인 표시)

2. **책 정보 수동 입력** (필수)
    - 필수 입력 필드:
        - **제목**: 1-200자 제한, 특수문자 허용
        - **저자**: 최소 1명, 최대 10명까지 추가 가능
        - **총 페이지 수**: 1-99999 사이 숫자

    - 선택 입력 필드:
        - **ISBN**: 10자리 또는 13자리, 유효성 검사 포함
        - **부제**: 최대 500자
        - **출판사**: 출판사명, 자동완성 지원
        - **출판일**: 날짜 선택기 (년/월/일)
        - **표지 이미지**: 갤러리에서 선택 또는 카메라로 촬영
        - **장르/카테고리**: 최대 3개 선택
        - **언어**: 기본값은 앱 설정 언어
        - **설명/소개**: 최대 2000자
        - **시리즈 정보**: 시리즈명 및 권수

    - 입력 지원 기능:
        - 실시간 자동 저장: 15초마다 또는 필드 변경 시
        - 자동 완성: 제목, 저자명, 출판사명 입력 시 추천
        - 중복 검사: 제목+저자 조합으로 유사 책 존재 시 경고
        - 임시 저장: 불완전한 입력 상태로 최대 30일 저장
        - 일괄 입력: 동일 시리즈/저자의 여러 책 일괄 등록 지원

    - 오류 처리 및 유효성 검사:
        - 필수 필드 누락 시 시각적 표시 및 저장 방지
        - ISBN 형식 오류 시 자동 수정 제안
        - 비정상적 페이지 수 입력 시 확인 요청 (예: 10,000페이지 이상)
        - 출판일이 미래인 경우 경고 표시

3. **책 표지 인식 기능** (권장)
    - 인식 방법:
        - **바코드 스캔 모드**:
            - ISBN 바코드 인식 후 자동 메타데이터 검색
            - 인식 정확도 목표: 99% 이상 (적절한 조명 조건)
            - 흐릿한 바코드 보정 알고리즘 적용

        - **표지 이미지 인식 모드**:
            - 책 표지 이미지 분석 후 유사 도서 검색
            - 인식 정확도 목표: 평균 85% 이상
            - 조명, 각도, 부분 가림에 대한 보정 처리

        - **텍스트 인식 모드**:
            - 표지의 제목/저자 텍스트 OCR 추출
            - 추출된 텍스트로 도서 데이터베이스 검색
            - 다국어 텍스트 인식 지원 (주요 10개 언어)

    - 인식 프로세스 및 UX:
        - 카메라 뷰파인더 가이드 표시 (최적 인식 위치 안내)
        - 실시간 피드백 (인식 중, 성공, 실패 상태 표시)
        - 인식 단계 진행률 표시:
            1. 이미지 캡처/분석
            2. 특징 추출
            3. 데이터베이스 검색
            4. 결과 매칭 및 검증

        - 결과 신뢰도 표시 (낮은/중간/높은 신뢰도)

    - 일괄 스캔 기능:
        - 연속 스캔 모드: 한 책 인식 후 자동으로 다음 스캔 준비
        - 스캔 대기열: 최대 20권까지 대기열에 추가
        - 배치 처리: 모든 스캔 완료 후 일괄 결과 검토
        - 진행 상황 저장: 스캔 중단 시 현재까지 결과 유지

    - 오류 처리 및 대안:
        - 인식 실패 시 대체 방법 제안:
            - 바코드 수동 입력
            - 제목/저자 텍스트 검색
            - 유사 표지 선택 (시각적 유사성 기반)

        - 낮은 조명 감지 시 플래시 자동 활성화 제안
        - 흔들림 감지 시 안정화 안내 메시지
        - 오프라인 모드: 이미지 저장 후 연결 시 일괄 처리

4. **책 상태 관리** (필수)
    - 상태 정의 및 속성:
        - **읽고 싶은 책 (To Read)**:
            - 우선순위 설정 (상/중/하)
            - 관심 표시 날짜 기록
            - 알림 설정 가능 (특정 날짜에 읽기 시작 리마인더)

        - **읽는 중 (Reading)**:
            - 시작 날짜 자동/수동 설정
            - 현재 페이지 및 진행률 표시
            - 마지막 독서 세션 정보 표시
            - 예상 완료일 계산

        - **읽은 책 (Completed)**:
            - 완료 날짜 자동/수동 설정
            - 독서 기간 계산 (시작일부터 완료일까지)
            - 평점 및 리뷰 입력 요청
            - 재독 횟수 기록

        - **중단 (DNF: Did Not Finish)**:
            - 중단 날짜 및 페이지 기록
            - 중단 사유 선택 또는 입력 (선택 사항)
            - 나중에 다시 시도할지 여부 표시

    - 상태 전환 흐름 및 자동화:
        - **자동 상태 전환 규칙**:
            - To Read → Reading: 첫 페이지 업데이트 시
            - Reading → Completed: 마지막 페이지 도달 또는 95% 이상 진행 시 제안
            - 30일 이상 페이지 업데이트 없음: "일시중단" 상태 제안

        - **전환 시 자동 액션**:
            - Reading 시작: 첫 독서 세션 생성, 시작일 기록
            - Completed 설정: 독서 통계 업데이트, 리뷰 창 표시
            - DNF 설정: 독서 목표에서 제외 옵션 제공

        - **일괄 상태 변경**:
            - 다중 책 선택 후 상태 일괄 변경
            - 시리즈 책 자동 상태 관리 (이전 권 완료 시 다음 권 Reading 제안)

    - 상태별 정렬 및 필터링:
        - **보기 옵션**:
            - 전체 책 통합 보기
            - 상태별 분리 보기
            - 커스텀 필터 저장 및 적용

        - **정렬 기준**:
            - 추가 날짜 (최신/오래된순)
            - 제목 (알파벳/가나다순)
            - 저자명
            - 우선순위
            - 진행률 (높은/낮은순)
            - 최근 활동

5. **컬렉션 관리** (권장)
    - 컬렉션 생성 및 구조:
        - **컬렉션 유형**:
            - 기본 컬렉션: 자동 생성 (읽는 중, 완독, 위시리스트)
            - 사용자 정의 컬렉션: 무제한 생성 (권장 최대 50개)
            - 스마트 컬렉션: 규칙 기반 자동 업데이트 (예: "4점 이상 평가한 책")

        - **구조 요소**:
            - 컬렉션명 (2-50자)
            - 설명 (최대 500자)
            - 커버 이미지 (기본/커스텀)
            - 색상 테마 (10가지 프리셋 또는 커스텀)
            - 공개 설정 (공개/비공개/친구공개)

        - **계층 구조**:
            - 주 컬렉션: 최대 50개 (성능 최적화)
            - 하위 컬렉션: 주 컬렉션당 최대 10개
            - 중첩 깊이: 최대 2단계

    - 책 및 컬렉션 관리:
        - **추가 방법**:
            - 책 상세 페이지에서 컬렉션에 추가
            - 컬렉션 페이지에서 책 검색 및 추가
            - 드래그 앤 드롭으로 책 이동
            - 일괄 선택 및 추가

        - **중복 및 교차 관리**:
            - 한 책은 여러 컬렉션에 동시 소속 가능
            - 컬렉션 간 책 복제 아닌 참조 방식 사용
            - 컬렉션별 책 순서 독립적 관리
            - 컬렉션에서 제거해도 라이브러리에서는 유지

    - 컬렉션 표시 및 인터페이스:
        - **보기 옵션**:
            - 그리드 보기: 표지 중심 (2x2, 3x3, 4x4 옵션)
            - 리스트 보기: 상세 정보 포함
            - 커버 플로우: 시각적 탐색
            - 통계 보기: 컬렉션 내 책 통계 요약

        - **정렬 및 필터**:
            - 수동 정렬 (드래그로 순서 변경)
            - 자동 정렬 (제목, 저자, 추가일 등)
            - 컬렉션 내 검색 및 필터링

    - 공유 및 협업:
        - **공유 옵션**:
            - 읽기 전용 링크 생성
            - 소셜 미디어 공유 (이미지 또는 링크)
            - 내보내기 형식 (PDF, CSV, JSON)

        - **협업 기능** (프리미엄):
            - 공동 컬렉션 생성
            - 편집 권한 관리
            - 변경 이력 추적
            - 댓글 및 추천

## 3. 독서 추적 기능
### 독서 진행 관리
1. **페이지 업데이트 인터페이스** (필수)
    - 입력 방식 및 UX:
        - **직접 입력**:
            - 숫자 키패드로 페이지 번호 입력
            - 스와이프로 페이지 증가/감소 (+1, +5, +10)
            - 특정 챕터/섹션으로 빠른 이동

        - **슬라이더 입력**:
            - 시각적 슬라이더로 위치 조정
            - 확대 모드: 정밀한 페이지 선택
            - 핸들 크기 조정 가능 (접근성)
            - 페이지 숫자 실시간 표시

        - **퍼센트 입력**:
            - 0-100% 범위 입력
            - 5% 단위 빠른 선택 버튼
            - 페이지 번호로 자동 변환 표시

    - UX 상세 요구사항:
        - **터치 피드백**:
            - 슬라이더 조작 시 햅틱 피드백 (단계별 진동)
            - 페이지 변경 시 시각적 애니메이션
            - 중요 이정표(25%, 50%, 75%, 100%) 도달 시 특별 피드백

        - **자동 저장**:
            - 페이지 입력 후 0.5초 지연 자동 저장
            - 저장 상태 표시 (저장 중, 저장됨, 오류)
            - 오프라인에서 변경 시 동기화 대기열에 추가

        - **컨텍스트 정보**:
            - 마지막 업데이트 시간 및 장치 표시
            - 일일/주간 읽은 페이지 수 요약
            - 현재 독서 속도 기준 완료 예상 시간

    - 다양한 책 형식 지원:
        - **실물 책**:
            - 페이지 번호 기준 진행률 추적
            - 양면 페이지 설정 (홀/짝수 처리)

        - **전자책**:
            - 위치 번호 또는 퍼센트 입력 지원
            - 기기별 다른 페이지 매핑 지원
            - EPUB/PDF/Kindle 포맷별 설정

        - **오디오북**:
            - 시간/분/초 단위 진행률 입력
            - 챕터별 진행 관리
            - 듣기 시간을 페이지 수로 환산 옵션

2. **독서 세션 기록** (필수)
    - 세션 관리 방식:
        - **수동 세션 관리**:
            - 시작/종료 버튼으로 명시적 제어
            - 세션 중 상태 표시 (읽는 중 아이콘)
            - 잠금 화면에서도 종료 가능한 알림 제공

        - **자동 세션 감지**:
            - 페이지 업데이트 시 자동 세션
            - 비활성 감지: 30분 이상 상호작용 없을 시 일시정지
            - 앱 활성/비활성

## 4. 홈 스크린 기획

### 1. 레이아웃 구성
- **상단 섹션**
  - 사용자 프로필 요약
    - 프로필 이미지
    - 닉네임
    - 독서 목표 진행률
  - 빠른 액션 버튼
    - 책 검색
    - 책 추가
    - 독서 시작

- **독서 진행 상황 섹션**
  - 현재 읽고 있는 책
    - 책 표지
    - 제목
    - 진행률
    - 마지막 독서 시간
  - 독서 목표 달성 현황
    - 일일/주간/월간 목표
    - 진행률 차트
    - 남은 페이지 수

- **최근 활동 섹션**
  - 최근 추가한 책
  - 최근 완독한 책
  - 최근 작성한 메모
  - 최근 북마크

- **추천 섹션**
  - 선호 장르 기반 추천
  - 인기 도서
  - 신간 도서
  - 친구들의 독서 활동

### 2. 기능 요구사항

#### 2.1 독서 진행 상황
- 현재 읽고 있는 책의 진행률 실시간 표시
- 독서 목표 달성 현황 시각화
- 독서 통계 요약 표시
  - 이번 주 읽은 페이지 수
  - 이번 달 완독한 책 수
  - 연속 독서 일수

#### 2.2 빠른 액션
- 책 검색 바로가기
- 새 책 추가 바로가기
- 마지막 읽던 책 계속 읽기
- 독서 세션 시작/종료

#### 2.3 활동 피드
- 최근 독서 활동 타임라인
- 독서 메모 미리보기
- 북마크한 책 목록
- 독서 목표 달성 알림

#### 2.4 추천 시스템
- 사용자 선호도 기반 도서 추천
- 인기 도서 추천
- 신간 도서 알림
- 친구들의 독서 활동 추천

#### 접근성
- 앱은 스크린 리더와 호환되어야 한다.
- 색상 대비는 WCAG 2.1 표준을 준수해야 한다.
- 글꼴 크기 조정이 가능해야 한다.

#### 확장성
- 새로운 기능을 쉽게 추가할 수 있는 모듈식 아키텍처여야 한다.
- 여러 언어 지원을 위한 국제화 프레임워크를 갖추어야 한다.

## 3. API 및 데이터 모델 문서

### 데이터 모델

#### User
```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
  readingGoals: {
    daily?: number; // 페이지 수
    weekly?: number;
    monthly?: number;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    privacySettings: PrivacySettings;
  };
}

interface PrivacySettings {
  shareReadingStats: boolean;
  shareBookshelf: boolean;
}
```


#### Book
```typescript
interface Book {
  id: string;
  isbn?: string;
  title: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount: number;
  categories?: string[];
  imageLinks?: {
    thumbnail: string;
    smallThumbnail?: string;
  };
  language?: string;
  addedBy: string; // User.id
  addedAt: Date;
  userSpecificData?: {
    [userId: string]: UserBookData;
  };
}

interface UserBookData {
  status: 'toRead' | 'reading' | 'completed';
  rating?: number; // 1-5
  startDate?: Date;
  finishDate?: Date;
  currentPage?: number;
  collections?: string[]; // Collection.id[]
  notes?: Note[];
  readingSessions?: ReadingSession[];
  isPrivate: boolean;
}
```


#### Note
```typescript
interface Note {
  id: string;
  bookId: string;
  userId: string;
  page?: number;
  content: string;
  type: 'note' | 'highlight' | 'question';
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  color?: string; // 하이라이트 색상
}
```


#### Collection
```typescript
interface Collection {
  id: string;
  name: string;
  description?: string;
  createdBy: string; // User.id
  createdAt: Date;
  updatedAt: Date;
  coverImage?: string;
  bookIds: string[]; // Book.id[]
  isPrivate: boolean;
}
```


#### ReadingSession
```typescript
interface ReadingSession {
  id: string;
  bookId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  startPage: number;
  endPage?: number;
  duration?: number; // 분 단위
  notes?: string;
}
```


#### ReadingStats
```typescript
interface ReadingStats {
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  booksCompleted: number;
  pagesRead: number;
  timeSpent: number; // 분 단위
  averageSpeed: number; // 페이지/시간
  genres: {
    [genre: string]: number; // 각 장르별 읽은 책 수
  };
}
```


### API 엔드포인트

#### 인증 API
```
POST /api/auth/register - 회원가입
POST /api/auth/login - 로그인
POST /api/auth/logout - 로그아웃
POST /api/auth/password/reset - 비밀번호 재설정
GET /api/auth/me - 현재 사용자 정보 조회
PUT /api/auth/me - 사용자 정보 업데이트
```


#### 책 API
```
GET /api/books/search?q={query} - 책 검색
POST /api/books - 새 책 추가
GET /api/books/{id} - 책 상세 정보 조회
PUT /api/books/{id} - 책 정보 업데이트
DELETE /api/books/{id} - 책 삭제
POST /api/books/import - 외부 데이터에서 책 가져오기
```


#### 독서 상태 API
```
GET /api/reading-status?userId={userId} - 사용자 독서 상태 조회
POST /api/reading-status/book/{bookId} - 책 독서 상태 업데이트
GET /api/reading-status/book/{bookId}/sessions - 독서 세션 조회
POST /api/reading-status/book/{bookId}/sessions - 독서 세션 추가
PUT /api/reading-status/book/{bookId}/sessions/{sessionId} - 독서 세션 업데이트
```


#### 메모 API
```
GET /api/notes?bookId={bookId} - 책 메모 조회
POST /api/notes - 메모 추가
PUT /api/notes/{id} - 메모 업데이트
DELETE /api/notes/{id} - 메모 삭제
GET /api/notes/search?q={query} - 메모 검색
```


#### 컬렉션 API
```
GET /api/collections?userId={userId} - 사용자 컬렉션 조회
POST /api/collections - 컬렉션 생성
PUT /api/collections/{id} - 컬렉션 업데이트
DELETE /api/collections/{id} - 컬렉션 삭제
POST /api/collections/{id}/books/{bookId} - 컬렉션에 책 추가
DELETE /api/collections/{id}/books/{bookId} - 컬렉션에서 책 제거
```


#### 통계 API
```
GET /api/stats?userId={userId}&period={period} - 독서 통계 조회
GET /api/stats/goals?userId={userId} - 독서 목표 조회
PUT /api/stats/goals - 독서 목표 설정
```


## 4. 코딩 컨벤션 및 스타일 가이드

### 파일 및 폴더 명명 규칙
- **컴포넌트 파일**: PascalCase (예: `BookCard.js`, `ReadingProgress.js`)
- **비 컴포넌트 파일**: camelCase (예: `apiClient.js`, `useBooks.js`)
- **폴더**: camelCase (예: `components`, `hooks`, `screens`)
- **스타일시트**: 관련 컴포넌트 이름 + `Styles.js` (예: `BookCardStyles.js`)

### 코드 작성 규칙

#### 일반 규칙
- 세미콜론 사용
- 문자열은 작은따옴표(`'`) 사용
- 탭 대신 2 공백 사용
- 파일 끝에 빈 줄 추가
- 최대 줄 길이 100자

#### React Native 컴포넌트
```javascript
// 좋은 예
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { styles } from './ComponentStyles';

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // 부수 효과 로직
  }, [dependencies]);

  const handleSomething = () => {
    // 이벤트 핸들러 로직
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{prop1}</Text>
    </View>
  );
};

export default ComponentName;
```


#### Redux 액션 및 리듀서
```javascript
// 액션 타입
export const ACTION_TYPE = 'feature/ACTION_NAME';

// 액션 생성자
export const actionCreator = (payload) => ({
  type: ACTION_TYPE,
  payload,
});

// 리듀서
const initialState = {
  data: null,
  loading: false,
  error: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPE:
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
}
```


#### RTK 슬라이스
```javascript
import { createSlice } from '@reduxjs/toolkit';

const booksSlice = createSlice({
  name: 'books',
  initialState: {
    allBooks: [],
    loading: false,
    error: null,
  },
  reducers: {
    addBook: (state, action) => {
      state.allBooks.push(action.payload);
    },
    removeBook: (state, action) => {
      state.allBooks = state.allBooks.filter(book => book.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // 비동기 액션 처리
  }
});

export const { addBook, removeBook } = booksSlice.actions;
export default booksSlice.reducer;
```


#### 스타일
```javascript
import { StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.medium,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.heading,
    marginBottom: spacing.small,
  },
  // 컴포넌트별 스타일 계속...
});
```


### 주석 작성 규칙
```javascript
/**
 * 컴포넌트 설명
 * @param {string} prop1 - 첫 번째 속성 설명
 * @param {number} prop2 - 두 번째 속성 설명
 * @returns {React.ReactElement} 컴포넌트 설명
 */

// TODO: 향후 개선 사항
// FIXME: 문제가 있는 코드
// NOTE: 중요한 설명
```


### 코드 품질 기준
- ESLint와 Prettier를 사용한 코드 형식화
- PropTypes 또는 TypeScript를 사용한 타입 체크
- 순수 함수 우선 사용
- 중복 코드 최소화 (DRY 원칙)
- 컴포넌트 책임 단일화 (SRP 원칙)
- 최대 복잡도 점수 제한 (McCabe의 순환 복잡도)

## 5. 테스트 전략 문서

### 테스트 유형

#### 1. 단위 테스트
- **도구**: Jest
- **대상**: 유틸리티 함수, 커스텀 훅, 리듀서, 서비스
- **범위**: 각 함수와 컴포넌트의 개별 동작 테스트

#### 2. 컴포넌트 테스트
- **도구**: React Native Testing Library
- **대상**: UI 컴포넌트
- **범위**: 렌더링, 이벤트 핸들링, 상태 변화

#### 3. 통합 테스트
- **도구**: Jest + RNTL
- **대상**: 연결된 컴포넌트, 화면, 리덕스와의 통합
- **범위**: 컴포넌트 간 상호작용, 데이터 흐름

#### 4. E2E 테스트
- **도구**: Detox
- **대상**: 전체 앱 흐름
- **범위**: 사용자 시나리오, 앱 내비게이션

### 테스트 케이스 예시

#### 도서 추가 기능 테스트
```javascript
// 단위 테스트 예시 (리듀서)
describe('books reducer', () => {
  it('should handle adding a new book', () => {
    const initialState = { allBooks: [] };
    const action = { 
      type: 'books/addBook', 
      payload: { id: '1', title: '1984', author: 'George Orwell' } 
    };
    const nextState = booksReducer(initialState, action);
    
    expect(nextState.allBooks).toHaveLength(1);
    expect(nextState.allBooks[0].title).toBe('1984');
  });
});

// 컴포넌트 테스트 예시
describe('BookForm', () => {
  it('should submit form with correct book data', () => {
    const mockSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <BookForm onSubmit={mockSubmit} />
    );
    
    fireEvent.changeText(getByPlaceholderText('제목'), '1984');
    fireEvent.changeText(getByPlaceholderText('저자'), 'George Orwell');
    fireEvent.press(getByText('저장'));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      title: '1984',
      author: 'George Orwell'
    });
  });
});
```


### 테스트 데이터
- 모의(Mock) 데이터는 `__mocks__` 폴더에 저장
- API 응답 모의는 MSW(Mock Service Worker) 사용
- 테스트 데이터 생성에 팩토리 패턴 적용

```javascript
// 테스트 데이터 팩토리 예시
const createBook = (overrides = {}) => ({
  id: 'book-1',
  title: '습관의 힘',
  authors: ['제임스 클리어'],
  pageCount: 312,
  status: 'toRead',
  ...overrides
});
```


### 코드 커버리지 목표
- 유틸리티 함수: 90% 이상
- 리듀서: 90% 이상
- 컴포넌트: 80% 이상
- 전체 코드 커버리지: 75% 이상

### 테스트 실행 방법
```shell script
# 모든 테스트 실행
npm test

# 특정 파일 테스트
npm test -- BookList.test.js

# 커버리지 보고서 생성
npm test -- --coverage

# E2E 테스트
npm run e2e
```

