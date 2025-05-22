import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Divider, Card, useTheme } from 'react-native-paper';
import { IService, IServiceCategory } from '../../models/ServiceModel';

interface ServiceDetailsScreenProps {
  service: IService;
  category: IServiceCategory | null;
}

const ServiceDetailsScreen: React.FC<ServiceDetailsScreenProps> = ({ 
  service, 
  category 
}) => {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>{service.name}</Text>
          
          <View style={styles.detailItem}>
            <Text variant="labelMedium" style={styles.label}>Category</Text>
            <Text variant="bodyLarge">{category ? category.name : 'Uncategorized'}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text variant="labelMedium" style={styles.label}>Price</Text>
            <Text variant="bodyLarge" style={styles.price}>${service.price.toFixed(2)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text variant="labelMedium" style={styles.label}>Duration</Text>
            <Text variant="bodyLarge">{service.duration} minutes</Text>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Description</Text>
          <Divider style={styles.divider} />
          
          <Text variant="bodyLarge">
            {service.description || 'No description provided for this service.'}
          </Text>
        </Card.Content>
      </Card>
      
      {category && category.description && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Category Description</Text>
            <Divider style={styles.divider} />
            
            <Text variant="bodyLarge">
              {category.description}
            </Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  label: {
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontWeight: 'bold',
  },
});

export default ServiceDetailsScreen;
