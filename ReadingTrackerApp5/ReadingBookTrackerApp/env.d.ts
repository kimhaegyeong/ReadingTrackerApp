declare module 'expo-constants' {
  export interface AppManifest {
    extra?: {
      aladinApiKey?: string;
      googleBooksApiKey?: string;
    };
  }
} 