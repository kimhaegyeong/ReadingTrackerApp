# 한국어 앱을 위한 디자인 원칙

한국어 앱을 개발할 때 적용할 수 있는 효과적인 디자인 원칙을 제시해드립니다.

## 핵심 디자인 원칙

1. **가독성 최우선**
   - 한글의 특성을 고려한 적절한 글꼴 크기와 행간 사용
   - 고딕체 계열 폰트를 기본으로 하되, 브랜드 특성에 맞게 조정
   - 국문 텍스트는 최소 14sp 이상으로 설정

2. **문화적 맥락 고려**
   - 한국 사용자의 문화적 배경과 선호도를 반영한 색상과 이미지 사용
   - 정중함과 신뢰도를 전달하는 디자인 요소 활용

3. **효율적인 정보 계층**
   - 주요 정보는 화면 상단에 배치하고 명확한 시각적 계층 구조 제공
   - '줄임말'이나 한국어 특유의 축약 표현을 적절히 활용

4. **모바일 환경 최적화**
   - 한 손 조작을 고려한 인터페이스 설계 (하단 네비게이션 바 선호)
   - 터치 영역은 최소 44x44pt 이상으로 설계

5. **포괄적인 피드백**
   - 시각적, 촉각적 피드백을 함께 제공하여 사용자 경험 향상
   - 오류 메시지는 정중하고 해결책을 제시하는 방식으로 작성

## 색상 체계

```jsx
// 주요 색상 팔레트
const colors = {
  primary: '#3B7DFF',        // 주 강조색: 신뢰감을 주는 파란색
  secondary: '#FF6B6B',      // 보조 강조색: 활기찬 레드
  background: '#FFFFFF',     // 배경색: 깔끔한 화이트
  text: {
    primary: '#333333',      // 주요 텍스트: 부드러운 블랙
    secondary: '#777777',    // 보조 텍스트: 중간 그레이
    tertiary: '#AAAAAA',     // 세부 텍스트: 밝은 그레이
  },
  border: '#EEEEEE',         // 경계선: 매우 밝은 그레이
  success: '#4CAF50',        // 성공 상태: 그린
  error: '#F44336',          // 오류 상태: 레드
  warning: '#FFC107',        // 경고 상태: 앰버
};
```

## 타이포그래피

```jsx
// 타이포그래피 스타일
const typography = {
  fontFamily: {
    regular: 'Noto Sans KR',
    medium: 'Noto Sans KR Medium',
    bold: 'Noto Sans KR Bold',
  },
  fontSize: {
    tiny: 12,
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 20,
    xxlarge: 24,
    headline: 28,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  },
};
```

## 공간 및 레이아웃

```jsx
// 공간 및 여백 시스템
const spacing = {
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 48,
};

// 그림자 스타일
const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
};
```

## 컴포넌트 예시: 버튼

```jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ 
  title, 
  onPress, 
  type = 'primary', 
  size = 'medium',
  disabled = false 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[`${type}Button`],
        styles[`${size}Button`],
        disabled && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text 
        style={[
          styles.text, 
          styles[`${type}Text`],
          styles[`${size}Text`],
          disabled && styles.disabledText
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3B7DFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3B7DFF',
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  disabledButton: {
    backgroundColor: '#DDDDDD',
    borderColor: '#DDDDDD',
  },
  text: {
    fontFamily: 'Noto Sans KR',
    fontWeight: '500',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#3B7DFF',
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  smallText: {
    fontSize: 14,
  },
  disabledText: {
    color: '#999999',
  },
});

export default Button;
```

## 사용자 인터페이스 지침

1. **명확한 피드백 제공**
   - 모든 사용자 액션에 시각적, 촉각적 피드백 제공
   - 로딩 상태를 명확히 표시

2. **한국어 특성에 맞는 레이아웃**
   - 한글은 영문보다 시각적으로 복잡하므로 충분한 여백 확보
   - 텍스트 밀도를 적절히 조절하여 정보 과부하 방지

3. **검색 및 필터링 최적화**
   - 한글 초성 검색 지원
   - 자주 사용되는 카테고리와 필터를 상단에 배치

4. **접근성 고려**
   - 고대비 모드 지원
   - 텍스트 크기 조절 가능성 고려
   - 컬러블라인드를 위한 색상 외 시각적 구분 제공

이러한 디자인 원칙을 적용하면 한국 사용자들에게 친숙하고 효율적인 사용자 경험을 제공할 수 있습니다.