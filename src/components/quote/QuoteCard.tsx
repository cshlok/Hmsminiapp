import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, useTheme, IconButton } from 'react-native-paper';
import { IQuote } from '../../models/QuoteModel';
import { format } from 'date-fns';

interface QuoteCardProps {
  quote: IQuote;
  patientName: string;
  onPress: (quote: IQuote) => void;
  onEdit: (quote: IQuote) => void;
  onDelete: (quoteId: string) => void;
  onConvert?: (quote: IQuote) => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  patientName,
  onPress,
  onEdit,
  onDelete,
  onConvert,
}) => {
  const theme = useTheme();

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return theme.colors.primary + '40';
      case 'final':
        return theme.colors.secondary + '40';
      case 'converted':
        return theme.colors.tertiary + '40';
      case 'cancelled':
        return theme.colors.error + '40';
      default:
        return theme.colors.primary + '40';
    }
  };

  // Format status text
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card 
      style={styles.card}
      onPress={() => onPress(quote)}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.mainContent}>
          <View style={styles.headerRow}>
            <Text variant="titleMedium" style={styles.title}>
              Quote #{quote.id.substring(0, 8)}
            </Text>
            <Chip 
              style={[styles.statusChip, { backgroundColor: getStatusColor(quote.status) }]}
            >
              {formatStatus(quote.status)}
            </Chip>
          </View>
          
          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={styles.label}>Patient:</Text>
            <Text variant="bodyMedium" style={styles.value}>{patientName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={styles.label}>Date:</Text>
            <Text variant="bodyMedium" style={styles.value}>
              {format(new Date(quote.date), 'MMM dd, yyyy')}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={styles.label}>Items:</Text>
            <Text variant="bodyMedium" style={styles.value}>{quote.items.length}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text variant="titleMedium" style={[styles.total, { color: theme.colors.primary }]}>
              Total: ${quote.total.toFixed(2)}
            </Text>
          </View>
        </View>
        
        <View style={styles.actions}>
          {quote.status !== 'converted' && quote.status !== 'cancelled' && (
            <>
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => onEdit(quote)}
                iconColor={theme.colors.primary}
              />
              {quote.status === 'final' && onConvert && (
                <IconButton
                  icon="file-document-edit"
                  size={20}
                  onPress={() => onConvert(quote)}
                  iconColor={theme.colors.tertiary}
                />
              )}
              <IconButton
                icon="delete"
                size={20}
                onPress={() => onDelete(quote.id)}
                iconColor={theme.colors.error}
              />
            </>
          )}
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
  statusChip: {
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    color: '#666',
    marginRight: 8,
    width: 60,
  },
  value: {
    flex: 1,
  },
  total: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
  },
});

export default QuoteCard;
