import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const onChange = ({ window }: { window: { width: number } }) => {
      setIsMobile(window.width < MOBILE_BREAKPOINT);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    setIsMobile(Dimensions.get('window').width < MOBILE_BREAKPOINT);
    return () => subscription.remove();
  }, []);

  return isMobile;
} 