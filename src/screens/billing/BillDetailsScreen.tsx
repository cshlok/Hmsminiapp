import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Divider, Card, useTheme, Button, List, Chip, Modal, Portal, TextInput } from 'react-native-paper';
import { IBill, IPayment } from '../../store/slices/billingSlice'; // Use slice definition
import { format } from 'date-fns';

interface BillDetailsScreenProps {
  bill: IBill;
  patientName: string;
  onEdit: (bill: IBill) => void;
  onDelete: (billId: string) => void;
  onAddPayment: (billId: string, payment: IPayment) => void;
  onDeletePayment: (billId: string, paymentId: string, amount: number) => void;
  onSharePdf?: (bill: IBill) => void;
}

const BillDetailsScreen: React.FC<BillDetailsScreenProps> = ({ 
  bill, 
  patientName,
  onEdit,
  onDelete,
  onAddPayment,
  onDeletePayment,
  onSharePdf
}) => {
  const theme = useTheme();
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank_transfer' | 'other'>('cash');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Format status text
  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unpaid':
        return theme.colors.error;
      case 'partially_paid':
        return theme.colors.warning;
      case 'paid':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.surface;
      case 'overdue':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  // Handle payment submission
  const handlePaymentSubmit = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      return; // Invalid amount
    }

    const payment: IPayment = {
      id: Date.now().toString(), // Simple ID generation
      billId: bill.id,
      date: new Date(),
      amount,
      method: paymentMethod,
      reference: paymentReference,
      notes: paymentNotes,
      createdAt: new Date(),
    };

    onAddPayment(bill.id, payment);
    setPaymentModalVisible(false);
    resetPaymentForm();
  };

  // Reset payment form
  const resetPaymentForm = () => {
    setPaymentAmount('');
    setPaymentMethod('cash');
    setPaymentReference('');
    setPaymentNotes('');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Text variant="headlineSmall" style={styles.title}>Invoice #{bill.id.substring(0, 8)}</Text>
            <Chip 
              style={[styles.statusChip, { backgroundColor: getStatusColor(bill.status) + '40' }]}
            >
              {formatStatus(bill.status)}
            </Chip>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.detailItem}>
            <Text variant="labelMedium" style={styles.label}>Patient</Text>
            <Text variant="bodyLarge">{patientName}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text variant="labelMedium" style={styles.label}>Invoice Date</Text>
            <Text variant="bodyLarge">{format(new Date(bill.date), 'MMMM dd, yyyy')}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text variant="labelMedium" style={styles.label}>Due Date</Text>
            <Text variant="bodyLarge">{format(new Date(bill.dueDate), 'MMMM dd, yyyy')}</Text>
          </View>
          
          {bill.quoteId && (
            <View style={styles.detailItem}>
              <Text variant="labelMedium" style={styles.label}>Quote Reference</Text>
              <Text variant="bodyLarge">#{bill.quoteId.substring(0, 8)}</Text>
            </View>
          )}
          
          {bill.notes && (
            <View style={styles.detailItem}>
              <Text variant="labelMedium" style={styles.label}>Notes</Text>
              <Text variant="bodyLarge">{bill.notes}</Text>
            </View>
          )}
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Services</Text>
          <Divider style={styles.divider} />
          
          {bill.items.map((item, index) => (
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
              style={index < bill.items.length - 1 ? styles.listItem : undefined}
            />
          ))}
          
          <Divider style={styles.divider} />
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium">Subtotal</Text>
              <Text variant="bodyMedium">${bill.subtotal.toFixed(2)}</Text>
            </View>
            
            {bill.discountAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text variant="bodyMedium">
                  Discount {bill.discountType === 'percentage' ? `(${bill.discountValue}%)` : ''}
                </Text>
                <Text variant="bodyMedium">-${bill.discountAmount.toFixed(2)}</Text>
              </View>
            )}
            
            {bill.taxAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text variant="bodyMedium">Tax ({bill.taxPercentage}%)</Text>
                <Text variant="bodyMedium">${bill.taxAmount.toFixed(2)}</Text>
              </View>
            )}
            
            <View style={styles.totalRow}>
              <Text variant="titleMedium" style={styles.totalLabel}>Total</Text>
              <Text variant="titleMedium" style={[styles.totalAmount, { color: theme.colors.primary }]}>
                ${bill.total.toFixed(2)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.paymentHeaderRow}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Payments</Text>
            {(bill.status === 'unpaid' || bill.status === 'partially_paid' || bill.status === 'overdue') && (
              <Button 
                mode="contained" 
                onPress={() => setPaymentModalVisible(true)}
                style={styles.addPaymentButton}
              >
                Add Payment
              </Button>
            )}
          </View>
          <Divider style={styles.divider} />
          
          {bill.payments.length === 0 ? (
            <Text variant="bodyMedium" style={styles.noPaymentsText}>No payments recorded yet.</Text>
          ) : (
            <>
              {bill.payments.map((payment, index) => (
                <View key={payment.id} style={styles.paymentItem}>
                  <View style={styles.paymentHeader}>
                    <Text variant="titleSmall">
                      {format(new Date(payment.date), 'MMM dd, yyyy')}
                    </Text>
                    <Button 
                      mode="text" 
                      icon="delete" 
                      textColor={theme.colors.error}
                      onPress={() => onDeletePayment(bill.id, payment.id, payment.amount)}
                      compact
                    >
                      Delete
                    </Button>
                  </View>
                  
                  <View style={styles.paymentDetails}>
                    <View style={styles.paymentDetail}>
                      <Text variant="bodySmall" style={styles.paymentLabel}>Amount</Text>
                      <Text variant="bodyMedium" style={styles.paymentValue}>
                        ${payment.amount.toFixed(2)}
                      </Text>
                    </View>
                    
                    <View style={styles.paymentDetail}>
                      <Text variant="bodySmall" style={styles.paymentLabel}>Method</Text>
                      <Text variant="bodyMedium" style={styles.paymentValue}>
                        {payment.method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Text>
                    </View>
                    
                    {payment.reference && (
                      <View style={styles.paymentDetail}>
                        <Text variant="bodySmall" style={styles.paymentLabel}>Reference</Text>
                        <Text variant="bodyMedium" style={styles.paymentValue}>{payment.reference}</Text>
                      </View>
                    )}
                    
                    {payment.notes && (
                      <View style={styles.paymentDetail}>
                        <Text variant="bodySmall" style={styles.paymentLabel}>Notes</Text>
                        <Text variant="bodyMedium" style={styles.paymentValue}>{payment.notes}</Text>
                      </View>
                    )}
                  </View>
                  
                  {index < bill.payments.length - 1 && <Divider style={styles.paymentDivider} />}
                </View>
              ))}
              
              <Divider style={styles.divider} />
              
              <View style={styles.paymentSummary}>
                <View style={styles.paymentSummaryRow}>
                  <Text variant="bodyMedium">Total Amount</Text>
                  <Text variant="bodyMedium">${bill.total.toFixed(2)}</Text>
                </View>
                
                <View style={styles.paymentSummaryRow}>
                  <Text variant="bodyMedium">Amount Paid</Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.success }}>
                    ${bill.amountPaid.toFixed(2)}
                  </Text>
                </View>
                
                <View style={styles.paymentSummaryRow}>
                  <Text variant="titleMedium" style={styles.balanceLabel}>Balance</Text>
                  <Text 
                    variant="titleMedium" 
                    style={[
                      styles.balanceAmount, 
                      { color: bill.balance > 0 ? theme.colors.error : theme.colors.success }
                    ]}
                  >
                    ${bill.balance.toFixed(2)}
                  </Text>
                </View>
              </View>
            </>
          )}
        </Card.Content>
      </Card>
      
      {bill.status !== 'cancelled' && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Actions</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.actionsContainer}>
              <Button 
                mode="outlined" 
                icon="pencil" 
                onPress={() => onEdit(bill)}
                style={styles.actionButton}
              >
                Edit Invoice
              </Button>
              
              {onSharePdf && (
                <Button 
                  mode="outlined" 
                  icon="share-variant" 
                  onPress={() => onSharePdf(bill)}
                  style={styles.actionButton}
                >
                  Share PDF
                </Button>
              )}
              
              <Button 
                mode="outlined" 
                icon="delete" 
                onPress={() => onDelete(bill.id)}
                style={[styles.actionButton, styles.deleteButton]}
                textColor={theme.colors.error}
              >
                Delete Invoice
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}
      
      <Portal>
        <Modal
          visible={paymentModalVisible}
          onDismiss={() => setPaymentModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Title title="Add Payment" />
            <Card.Content>
              <TextInput
                label="Amount ($)"
                value={paymentAmount}
                onChangeText={setPaymentAmount}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
              />
              
              <Text variant="bodyMedium" style={styles.inputLabel}>Payment Method</Text>
              <View style={styles.methodContainer}>
                <Chip
                  selected={paymentMethod === 'cash'}
                  onPress={() => setPaymentMethod('cash')}
                  style={styles.methodChip}
                >
                  Cash
                </Chip>
                <Chip
                  selected={paymentMethod === 'card'}
                  onPress={() => setPaymentMethod('card')}
                  style={styles.methodChip}
                >
                  Card
                </Chip>
                <Chip
                  selected={paymentMethod === 'bank_transfer'}
                  onPress={() => setPaymentMethod('bank_transfer')}
                  style={styles.methodChip}
                >
                  Bank Transfer
                </Chip>
                <Chip
                  selected={paymentMethod === 'other'}
                  onPress={() => setPaymentMethod('other')}
                  style={styles.methodChip}
                >
                  Other
                </Chip>
              </View>
              
              <TextInput
                label="Reference Number (Optional)"
                value={paymentReference}
                onChangeText={setPaymentReference}
                style={styles.input}
                mode="outlined"
              />
              
              <TextInput
                label="Notes (Optional)"
                value={paymentNotes}
                onChangeText={setPaymentNotes}
                style={styles.input}
                mode="outlined"
                multiline
              />
            </Card.Content>
            <Card.Actions style={styles.modalActions}>
              <Button onPress={() => setPaymentModalVisible(false)}>Cancel</Button>
              <Button mode="contained" onPress={handlePaymentSubmit}>Add Payment</Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
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
  paymentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addPaymentButton: {
    marginLeft: 8,
  },
  noPaymentsText: {
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    marginVertical: 16,
  },
  paymentItem: {
    marginBottom: 16,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentDetails: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  paymentDetail: {
    marginBottom: 8,
  },
  paymentLabel: {
    color: '#666',
    marginBottom: 2,
  },
  paymentValue: {
    fontWeight: '500',
  },
  paymentDivider: {
    marginVertical: 12,
  },
  paymentSummary: {
    marginTop: 8,
  },
  paymentSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  balanceLabel: {
    fontWeight: 'bold',
  },
  balanceAmount: {
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
  modalContainer: {
    padding: 20,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
  },
  methodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  methodChip: {
    margin: 4,
  },
  modalActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default BillDetailsScreen;
