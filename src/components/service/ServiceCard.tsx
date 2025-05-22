import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, useTheme, IconButton } from 'react-native-paper';
import { IService } from '../../models/ServiceModel';

interface ServiceCardProps {
  service: IService;
  categoryName: string;
  onPress: (service: IService) => void;
  onEdit: (service: IService) => void;
  onDelete: (serviceId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  categoryName,
  onPress,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();

  return (
    <Card 
      style={styles.card}
      onPress={() => onPress(service)}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.mainContent}>
          <View style={styles.headerRow}>
            <Text variant="titleMedium" style={styles.title}>{service.name}</Text>
            <Chip style={[styles.categoryChip, { backgroundColor: theme.colors.primary + '20' }]}>
              {categoryName}
            </Chip>
          </View>
          
          {service.description && (
            <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
              {service.description}
            </Text>
          )}
          
          <View style={styles.detailsRow}>
            <Text variant="titleMedium" style={[styles.price, { color: theme.colors.primary }]}>
              ${service.price.toFixed(2)}
            </Text>
            <Text variant="bodyMedium" style={styles.duration}>
              {service.duration} min
            </Text>
          </View>
        </View>
        
        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => onEdit(service)}
            iconColor={theme.colors.primary}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={() => onDelete(service.id)}
            iconColor={theme.colors.error}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 16,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  mainContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
  },
  categoryChip: {
    marginLeft: 8,
  },
  description: {
    marginBottom: 8,
    color: '#666',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontWeight: 'bold',
  },
  duration: {
    marginLeft: 16,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
  },
});

export default ServiceCard;
