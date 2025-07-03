import React from 'react';
import { View, Text } from 'react-native';

const CustomBadge = ({ children, style, textStyle }: any) => (
  <View style={[{
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    backgroundColor: '#e0e7ff',
    marginLeft: 6,
  }, style]}>
    <Text style={[{ color: '#3730a3', fontSize: 12 }, textStyle]}>{children}</Text>
  </View>
);

export default CustomBadge; 