import * as MediaLibrary from 'expo-media-library';

/**
 * 이미지 URI를 갤러리에 저장
 * @param uri 저장할 이미지 파일의 URI
 * @returns 저장 성공 여부(boolean)
 */
export async function saveImageToGallery(uri: string): Promise<boolean> {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') return false;
    await MediaLibrary.saveToLibraryAsync(uri);
    return true;
  } catch (e) {
    return false;
  }
} 