import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Button, 
  TouchableOpacity, 
  ActivityIndicator, 
  Animated, 
  Keyboard, 
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  useColorScheme
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';

export default function StartLoginScreen({ navigation }: any) {
  const { 
    isLoading, 
    isAuthenticated, 
    login, 
    loginWithGoogle, 
    loginWithApple, 
    loginAsGuest, 
    validateEmail, 
    validatePassword,
    loginAttempts,
    resetLoginAttempts
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');

  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Auto-login check
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigation.replace('MainTabs');
    }
  }, [isAuthenticated, isLoading, navigation]);

  // Animation on mount
  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, [logoAnim, formAnim]);

  // Email validation on change
  useEffect(() => {
    if (email) {
      setEmailError(validateEmail(email) ? '' : '유효한 이메일 주소를 입력해주세요');
    } else {
      setEmailError('');
    }
  }, [email, validateEmail]);

  // Password validation on change
  useEffect(() => {
    if (password) {
      const validation = validatePassword(password);
      setPasswordError(validation.isValid ? '' : validation.message);
    } else {
      setPasswordError('');
    }
  }, [password, validatePassword]);

  // Reset login attempts after 5 minutes
  useEffect(() => {
    if (loginAttempts >= 5) {
      const timer = setTimeout(() => {
        resetLoginAttempts();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearTimeout(timer);
    }
  }, [loginAttempts, resetLoginAttempts]);

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!validateEmail(email)) {
      setEmailError('유효한 이메일 주소를 입력해주세요');
      return;
    }

    if (password.length < 8) {
      setPasswordError('비밀번호는 최소 8자 이상이어야 합니다');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigation.replace('MainTabs');
      } else {
        Alert.alert('로그인 실패', '이메일 또는 비밀번호가 올바르지 않습니다');
      }
    } catch (error) {
      Alert.alert('오류', '로그인 중 오류가 발생했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async () => {
    // Registration logic would go here
    setIsRegistering(false);
    Alert.alert('회원가입', '회원가입 기능은 아직 구현되지 않았습니다');
  };

  const handleGoogleLogin = async () => {
    try {
      const success = await loginWithGoogle();
      if (success) {
        navigation.replace('MainTabs');
      }
    } catch (error) {
      Alert.alert('오류', '구글 로그인 중 오류가 발생했습니다');
    }
  };

  const handleAppleLogin = async () => {
    try {
      const success = await loginWithApple();
      if (success) {
        navigation.replace('MainTabs');
      }
    } catch (error) {
      Alert.alert('오류', 'Apple 로그인 중 오류가 발생했습니다');
    }
  };

  const handleGuestLogin = async () => {
    try {
      Alert.alert(
        '비회원으로 시작',
        '비회원으로 시작하면 모든 데이터는 이 기기에만 저장됩니다. 다른 기기에서는 데이터를 확인할 수 없습니다.',
        [
          {
            text: '취소',
            style: 'cancel'
          },
          {
            text: '시작하기',
            onPress: async () => {
              const success = await loginAsGuest();
              if (success) {
                Alert.alert(
                  '환영합니다!',
                  '비회원으로 시작했습니다. 나중에 회원가입을 하시면 모든 데이터를 그대로 가져갈 수 있습니다.',
                  [{ text: '확인', onPress: () => navigation.replace('MainTabs') }]
                );
              } else {
                Alert.alert('오류', '비회원 로그인 중 오류가 발생했습니다');
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('오류', '비회원 로그인 중 오류가 발생했습니다');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
          <Animated.Text 
            style={[
              styles.title, 
              isDarkMode && styles.darkText,
              { opacity: logoAnim, transform: [{ translateY: logoAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0]
              })}] }
            ]}
            accessibilityLabel="북로그 앱 로고"
          >
            북로그
          </Animated.Text>

          <Animated.View 
            style={[
              styles.formContainer, 
              { opacity: formAnim, transform: [{ translateY: formAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })}] }
            ]}
          >
            {isRegistering ? (
              <>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>이름</Text>
                <TextInput
                  style={[styles.input, isDarkMode && styles.darkInput]}
                  placeholder="이름"
                  placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
                  value={name}
                  onChangeText={setName}
                  accessibilityLabel="이름 입력"
                />
              </>
            ) : null}

            <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>이메일</Text>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null, isDarkMode && styles.darkInput]}
              placeholder="이메일"
              placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              accessibilityLabel="이메일 입력"
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>비밀번호</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input, 
                  styles.passwordInput, 
                  passwordError ? styles.inputError : null,
                  isDarkMode && styles.darkInput
                ]}
                placeholder="비밀번호"
                placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                accessibilityLabel="비밀번호 입력"
              />
              <TouchableOpacity 
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
                accessibilityLabel={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color={isDarkMode ? '#fff' : '#333'} />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <TouchableOpacity
              style={[styles.button, styles.primaryButton, isSubmitting && styles.disabledButton]}
              onPress={isRegistering ? handleRegister : handleLogin}
              disabled={isSubmitting || loginAttempts >= 5}
              accessibilityLabel={isRegistering ? "회원가입" : "로그인"}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>{isRegistering ? '회원가입' : '로그인'}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.link}
              onPress={() => setIsRegistering(!isRegistering)}
              accessibilityLabel={isRegistering ? "로그인으로 돌아가기" : "회원가입 페이지로 이동"}
            >
              <Text style={[styles.linkText, isDarkMode && styles.darkText]}>
                {isRegistering ? '로그인으로 돌아가기' : '회원가입'}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={[styles.dividerLine, isDarkMode && styles.darkDivider]} />
              <Text style={[styles.dividerText, isDarkMode && styles.darkText]}>또는</Text>
              <View style={[styles.dividerLine, isDarkMode && styles.darkDivider]} />
            </View>

            <TouchableOpacity
              style={[styles.button, styles.googleButton]}
              onPress={handleGoogleLogin}
              accessibilityLabel="구글로 로그인"
            >
              <Ionicons name="logo-google" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Google로 로그인</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[styles.button, styles.appleButton]}
                onPress={handleAppleLogin}
                accessibilityLabel="애플로 로그인"
              >
                <Ionicons name="logo-apple" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Apple로 로그인</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.guestButton]}
              onPress={handleGuestLogin}
              accessibilityLabel="비회원으로 시작"
            >
              <Ionicons name="person-outline" size={20} color="#333" style={styles.buttonIcon} />
              <Text style={[styles.buttonText, { color: '#333' }]}>비회원으로 시작</Text>
            </TouchableOpacity>

            <Text style={[styles.guestInfoText, isDarkMode && styles.darkText]}>
              비회원으로 시작하면 모든 데이터는 이 기기에만 저장됩니다.
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff',
    padding: 20
  },
  darkContainer: {
    backgroundColor: '#121212'
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: { 
    fontSize: 42, 
    fontWeight: 'bold', 
    marginBottom: 40,
    color: '#007bff'
  },
  darkText: {
    color: '#fff'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16
  },
  formContainer: {
    width: '100%',
    maxWidth: 400
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333'
  },
  input: { 
    width: '100%', 
    padding: 15, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9'
  },
  darkInput: {
    backgroundColor: '#333',
    borderColor: '#555',
    color: '#fff'
  },
  inputError: {
    borderColor: '#ff3b30'
  },
  errorText: {
    color: '#ff3b30',
    marginBottom: 16,
    fontSize: 14
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative'
  },
  passwordInput: {
    paddingRight: 50
  },
  passwordToggle: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center'
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    flexDirection: 'row'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  buttonIcon: {
    marginRight: 10
  },
  primaryButton: {
    backgroundColor: '#007bff'
  },
  googleButton: {
    backgroundColor: '#DB4437'
  },
  appleButton: {
    backgroundColor: '#000'
  },
  guestButton: {
    backgroundColor: '#f1f1f1'
  },
  disabledButton: {
    opacity: 0.7
  },
  link: {
    alignSelf: 'center',
    marginVertical: 16
  },
  linkText: {
    color: '#007bff',
    fontSize: 16
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd'
  },
  darkDivider: {
    backgroundColor: '#555'
  },
  dividerText: {
    paddingHorizontal: 10,
    color: '#999'
  },
  guestInfoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16
  }
});
