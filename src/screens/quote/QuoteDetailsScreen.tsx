import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Divider, Card, useTheme, Button, List, Chip } from 'react-native-paper';
import { IQuote, IQuoteItem } from '../../models/QuoteModel';
import { format } from 'date-fns';

interface QuoteDetailsScreenProps {
  quote: IQuote;
  patientName: string;
  onEdit: (quote: IQuote) => void;
  onDelete: (quoteId: string) => void;
  onConvertToBill?: (quote: IQuote) => void;
  onSharePdf?: (quote: IQuote) => void;
}

const QuoteDetailsScreen: React.FC<QuoteDetailsScreenProps> = ({ 
  quote, 
  patientName,
  onEdit,
  onDelete,
  onConvertToBill,
  onSharePdf
}) => {
  const theme = useTheme();

  // Format status text
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return theme.colors.primary;
      case 'final':
        return theme.colors.secondary;
      case 'converted':
        return theme.colors.tertiary;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Text variant="headlineSmall" style={styles.title}>Quote #{quote.id.substring(0, 8)}</Text>
            <Chip 
              style={[styles.statusChip, { backgroundColor: getStatusColor(quote.status) + '40' }]}
            >
              {formatStatus(quote.status)}
            </Chip>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.detailItem}>
            <Text variant="labelMedium" style={styles.label}>Patient</Text>
            <Text variant="bodyLarge">{patientName}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text variant="labelMedium" style={styles.label}>Date</Text>
            <Text variant="bodyLarge">{format(new Date(quote.date), 'MMMM dd, yyyy')}</Text>
          </View>
          
          {quote.notes && (
            <View style={styles.detailItem}>
              <Text variant="labelMedium" style={styles.label}>Notes</Text>
              <Text variant="bodyLarge">{quote.notes}</Text>
            </View>
          )}
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Services</Text>
          <Divider style={styles.divider} />
          
          {quote.items.map((item, index) => (
            <List.Item
              key={item.id}
              title={item.serviceName}
              description={item.notes || undefined}
              right={() => (
                <View style={styles.itemPriceContainer}>
                  <Text variant="bodyMedium" style={styles.itemQuantity}>
                    {item.quantity} x ${item.unitPrice.toFixed(2)}
                  </Text>
                  <Text variant="bodyLarge" style={styles.itemAmount}>
                    ${item.amount.toFixed(2)}
                  </Text>
                </View>
              )}
              style={index < quote.items.length - 1 ? styles.listItem : undefined}
            />
          ))}
          
          <Divider style={styles.divider} />
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium">Subtotal</Text>
              <Text variant="bodyMedium">${quote.subtotal.toFixed(2)}</Text>
            </View>
            
            {quote.discountAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text variant="bodyMedium">
                  Discount {quote.discountType === 'percentage' ? `(${quote.discountValue}%)` : ''}
                </Text>
                <Text variant="bodyMedium">-${quote.discountAmount.toFixed(2)}</Text>
              </View>
            )}
            
            {quote.taxAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text variant="bodyMedium">Tax ({quote.taxPercentage}%)</Text>
                <Text variant="bodyMedium">${quote.taxAmount.toFixed(2)}</Text>
              </View>
            )}
            
            <View style={styles.totalRow}>
              <Text variant="titleMedium" style={styles.totalLabel}>Total</Text>
              <Text variant="titleMedium" style={[styles.totalAmount, { color: theme.colors.primary }]}>
                ${quote.total.toFixed(2)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      {quote.status !== 'converted' && quote.status !== 'cancelled' && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Actions</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.actionsContainer}>
              <Button 
                mode="outlined" 
                icon="pencil" 
                onPress={() => onEdit(quote)}
                style={styles.actionButton}
              >
                Edit Quote
              </Button>
              
              {onSharePdf && (
                <Button 
                  mode="outlined" 
                  icon="share-variant" 
                  onPress={() => onSharePdf(quote)}
                  style={styles.actionButton}
                >
                  Share PDF
                </Button>
              )}
              
              {quote.status === 'final' && onConvertToBill && (
                <Button 
                  mode="contained" 
                  icon="file-document-edit" 
                  onPress={() => onConvertToBill(quote)}
                  style={styles.actionButton}
                >
                  Convert to Bill
                </Button>
              )}
              
              <Button 
                mode="outlined" 
                icon="delete" 
                onPress={() => onDelete(quote.id)}
                style={[styles.actionButton, styles.deleteButton]}
                textColor={theme.colors.error}
              >
                Delete Quote
              </Button>
            </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  statusChip: {
    marginLeft: 8,
  },
  divider: {
    marginVertical: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  label: {
    color: '#666',
    marginBottom: 4,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemPriceContainer: {
    alignItems: 'flex-end',
  },
  itemQuantity: {
    color: '#666',
    fontSize: 12,
  },
  itemAmount: {
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalAmount: {
    fontWeight: 'bold',
  },
  actionsContainer: {
    marginTop: 8,
  },
  actionButton: {
    marginBottom: 12,
  },
  deleteButton: {
    borderColor: 'rgba(255, 0, 0, 0.2)',
  },
});

export default QuoteDetailsScreen;
