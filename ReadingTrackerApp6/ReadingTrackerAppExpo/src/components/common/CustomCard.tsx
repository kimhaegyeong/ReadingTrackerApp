import React from 'react';
import { View, Text } from 'react-native';

const CustomCard = ({ children, style }: any) => {
  const wrappedChildren = React.Children.map(children, (child) => {
    if (typeof child === 'string' && child.trim() !== '') {
      return <Text>{child}</Text>;
    }
    if (typeof child === 'string') {
      return null;
    }
    return child;
  });
  return <View style={[{ backgroundColor: '#fff', padding: 16, borderRadius: 10 }, style]}>{wrappedChildren}</View>;
};

export default CustomCard; 