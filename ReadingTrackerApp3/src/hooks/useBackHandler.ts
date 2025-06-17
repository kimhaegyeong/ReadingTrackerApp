import { useCallback, useEffect, useRef } from 'react';
import { BackHandler, BackHandlerStatic } from 'react-native';

type BackHandlerSubscription = {
  remove: () => void;
};

type ExtendedBackHandler = BackHandlerStatic & {
  // The actual implementation returns an object with a remove method
  addEventListener: (
    eventName: 'hardwareBackPress',
    callback: () => boolean
  ) => BackHandlerSubscription;
};

type Callback = () => boolean;

export const useBackHandler = (callback: Callback) => {
  const callbackRef = useRef(callback);

  // Update the callback if it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the event listener
  useEffect(() => {
    const backHandler = () => {
      return callbackRef.current();
    };

    // Add event listener with proper typing
    const handler = BackHandler as unknown as ExtendedBackHandler;
    const subscription = handler.addEventListener('hardwareBackPress', backHandler);

    // Clean up
    return () => {
      subscription.remove();
    };
  }, []);
};
