import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

const CustomButton = ({ onPress, icon, text, color, outline, disabled, style }: any) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: outline ? '#fff' : color || '#1976d2',
      borderWidth: outline ? 1 : 0,
      borderColor: color || '#1976d2',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      opacity: disabled ? 0.5 : 1,
      marginHorizontal: 4,
      justifyContent: 'center',
    }, style]}
  >
    {icon}
    <Text style={{ color: outline ? (color || '#1976d2') : '#fff', fontWeight: 'bold', marginLeft: icon ? 6 : 0 }}>{text}</Text>
  </TouchableOpacity>
);

export default CustomButton; 