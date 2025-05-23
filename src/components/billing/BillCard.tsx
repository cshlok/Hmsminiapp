import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, useTheme, IconButton } from 'react-native-paper';
import { IBill } from '../../models/BillingModel';
import { format } from 'date-fns';

interface BillCardProps {
  bill: IBill;
  patientName: string;
  onPress: (bill: IBill) => void;
  onEdit: (bill: IBill) => void;
  onDelete: (billId: string) => void;
  onAddPayment?: (bill: IBill) => void;
}

const BillCard: React.FC<BillCardProps> = ({
  bill,
  patientName,
  onPress,
  onEdit,
  onDelete,
  onAddPayment,
}) => {
  const theme = useTheme();

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unpaid':
        return theme.colors.error + '40';
      case 'partially_paid':
        return theme.colors.warning + '40';
      case 'paid':
        return theme.colors.success + '40';
      case 'cancelled':
        return theme.colors.surface + '40';
      case 'overdue':
        return theme.colors.error + '80';
      default:
        return theme.colors.primary + '40';
    }
  };

  // Format status text
  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Card 
      style={styles.card}
      onPress={() => onPress(bill)}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.mainContent}>
          <View style={styles.headerRow}>
            <Text variant="titleMedium" style={styles.title}>
              Invoice #{bill.id.substring(0, 8)}
            </Text>
            <Chip 
              style={[styles.statusChip, { backgroundColor: getStatusColor(bill.status) }]}
            >
              {formatStatus(bill.status)}
            </Chip>
          </View>
          
          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={styles.label}>Patient:</Text>
            <Text variant="bodyMedium" style={styles.value}>{patientName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={styles.label}>Date:</Text>
            <Text variant="bodyMedium" style={styles.value}>
              {format(new Date(bill.date), 'MMM dd, yyyy')}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={styles.label}>Due:</Text>
            <Text variant="bodyMedium" style={styles.value}>
              {format(new Date(bill.dueDate), 'MMM dd, yyyy')}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={styles.label}>Items:</Text>
            <Text variant="bodyMedium" style={styles.value}>{bill.items.length}</Text>
          </View>
          
          <View style={styles.paymentRow}>
            <View style={styles.amountColumn}>
              <Text variant="bodySmall" style={styles.amountLabel}>Total</Text>
              <Text variant="titleMedium" style={[styles.amount, { color: theme.colors.primary }]}>
                ${bill.total.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.amountColumn}>
              <Text variant="bodySmall" style={styles.amountLabel}>Paid</Text>
              <Text variant="titleMedium" style={[styles.amount, { color: theme.colors.success }]}>
                ${bill.amountPaid.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.amountColumn}>
              <Text variant="bodySmall" style={styles.amountLabel}>Balance</Text>
              <Text variant="titleMedium" style={[styles.amount, { color: bill.balance > 0 ? theme.colors.error : theme.colors.success }]}>
                ${bill.balance.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actions}>
          {bill.status !== 'cancelled' && (
            <>
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => onEdit(bill)}
                iconColor={theme.colors.primary}
              />
              {(bill.status === 'unpaid' || bill.status === 'partially_paid' || bill.status === 'overdue') && onAddPayment && (
                <IconButton
                  icon="cash-plus"
                  size={20}
                  onPress={() => onAddPayment(bill)}
                  iconColor={theme.colors.success}
                />
              )}
              <IconButton
                icon="delete"
                size={20}
                onPress={() => onDelete(bill.id)}
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
  paymentRow: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  amountColumn: {
    alignItems: 'center',
  },
  amountLabel: {
    color: '#666',
    marginBottom: 2,
  },
  amount: {
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
  },
});

export default BillCard;
