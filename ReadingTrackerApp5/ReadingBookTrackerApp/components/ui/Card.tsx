import React from 'react';
import { View, Text, StyleSheet, ViewProps, TextProps, StyleProp, ViewStyle } from 'react-native';

const Card = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.card, style]} {...props} />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.cardHeader, style]} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<Text, TextProps>(({ style, ...props }, ref) => (
  <Text ref={ref} style={[styles.cardTitle, style]} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<Text, TextProps>(({ style, ...props }, ref) => (
  <Text ref={ref} style={[styles.cardDescription, style]} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.cardContent, style]} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.cardFooter, style]} {...props} />
));
CardFooter.displayName = 'CardFooter';

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB', // border
    backgroundColor: '#FFFFFF', // bg-card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1, // shadow-sm
  },
  cardHeader: {
    padding: 24,
    paddingBottom: 0,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827', // text-card-foreground
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280', // text-muted-foreground
    marginTop: 4,
  },
  cardContent: {
    padding: 24,
  },
  cardFooter: {
    padding: 24,
    paddingTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }; 