import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Card, useTheme, IconButton } from 'react-native-paper';
import { IServiceCategory } from '../../models/ServiceModel';

interface CategoryCardProps {
  category: IServiceCategory;
  serviceCount: number;
  onPress: (category: IServiceCategory) => void;
  onEdit: (category: IServiceCategory) => void;
  onDelete: (categoryId: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  serviceCount,
  onPress,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();

  return (
    <Card 
      style={styles.card}
      onPress={() => onPress(category)}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.mainContent}>
          <Text variant="titleMedium" style={styles.title}>{category.name}</Text>
          
          {category.description && (
            <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
              {category.description}
            </Text>
          )}
          
          <Text variant="bodySmall" style={styles.count}>
            {serviceCount} {serviceCount === 1 ? 'service' : 'services'}
          </Text>
        </View>
        
        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => onEdit(category)}
            iconColor={theme.colors.primary}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={() => onDelete(category.id)}
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
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    marginBottom: 8,
    color: '#666',
  },
  count: {
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
  },
});

export default CategoryCard;
