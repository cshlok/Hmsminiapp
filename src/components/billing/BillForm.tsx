import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, Divider, Card, useTheme, Button, List, Chip, TextInput, HelperText, SegmentedButtons } from 'react-native-paper';
import { IBill, IBillItem, IPayment } from '../../models/BillingModel';
import { IService } from '../../models/ServiceModel';
import { IPatient } from '../../models/PatientModel';
import { IQuote } from '../../models/QuoteModel';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { format, addDays } from 'date-fns';

interface BillFormProps {
  initialValues?: Partial<IBill>;
  patients: IPatient[];
  services: IService[];
  quotes: IQuote[];
  onSubmit: (values: IBill) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Validation schema for bill form
const BillSchema = Yup.object().shape({
  patientId: Yup.string().required('Patient is required'),
  date: Yup.date().required('Date is required'),
  dueDate: Yup.date().required('Due date is required'),
  items: Yup.array().of(
    Yup.object().shape({
      serviceId: Yup.string().required('Service is required'),
      quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
    })
  ).min(1, 'At least one service is required'),
  discountType: Yup.string().oneOf(['percentage', 'fixed', 'none']),
  discountValue: Yup.number().min(0, 'Discount cannot be negative'),
  taxPercentage: Yup.number().min(0, 'Tax percentage cannot be negative'),
  notes: Yup.string(),
  status: Yup.string().oneOf(['unpaid', 'partially_paid', 'paid', 'cancelled', 'overdue']),
});

const BillForm: React.FC<BillFormProps> = ({
  initialValues,
  patients,
  services,
  quotes,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const theme = useTheme();
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(
    initialValues?.patientId ? patients.find(p => p.id === initialValues.patientId) || null : null
  );
  const [selectedQuote, setSelectedQuote] = useState<IQuote | null>(
    initialValues?.quoteId ? quotes.find(q => q.id === initialValues.quoteId) || null : null
  );

  // Calculate totals based on items, discount, and tax
  const calculateTotals = (items: Array<Partial<IBillItem>>, discountType: string, discountValue: number, taxPercentage: number) => {
    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => {
      const service = services.find(s => s.id === item.serviceId);
      const unitPrice = service ? service.price : 0;
      const quantity = item.quantity || 0;
      const amount = unitPrice * quantity;
      return sum + amount;
    }, 0);
    
    // Calculate discount amount
    let discountAmount = 0;
    if (discountType === 'percentage') {
      discountAmount = subtotal * (discountValue / 100);
    } else if (discountType === 'fixed') {
      discountAmount = discountValue;
    }
    
    // Calculate tax amount
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (taxPercentage / 100);
    
    // Calculate total
    const total = taxableAmount + taxAmount;
    
    return {
      subtotal,
      discountAmount,
      taxAmount,
      total
    };
  };

  // Get service details by ID
  const getServiceById = (serviceId: string) => {
    return services.find(s => s.id === serviceId);
  };

  // Convert quote to bill
  const convertQuoteToBill = (quote: IQuote) => {
    if (!quote) return null;
    
    // Create bill items from quote items
    const billItems = quote.items.map(item => ({
      id: uuidv4(),
      billId: '',
      serviceId: item.serviceId,
      serviceName: item.serviceName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: item.amount,
      notes: item.notes || '',
    }));
    
    // Create bill from quote
    return {
      patientId: quote.patientId,
      quoteId: quote.id,
      date: new Date(),
      dueDate: addDays(new Date(), 30), // Default due date: 30 days from now
      items: billItems,
      subtotal: quote.subtotal,
      discountType: quote.discountType,
      discountValue: quote.discountValue,
      discountAmount: quote.discountAmount,
      taxPercentage: quote.taxPercentage,
      taxAmount: quote.taxAmount,
      total: quote.total,
      amountPaid: 0,
      balance: quote.total,
      notes: quote.notes || '',
      status: 'unpaid',
      payments: [],
    };
  };

  // Default initial values
  const defaultValues: Partial<IBill> = {
    patientId: '',
    quoteId: null,
    date: new Date(),
    dueDate: addDays(new Date(), 30), // Default due date: 30 days from now
    items: [{ id: uuidv4(), billId: '', serviceId: '', quantity: 1, notes: '', serviceName: '', unitPrice: 0, amount: 0 }],
    subtotal: 0,
    discountType: 'none',
    discountValue: 0,
    discountAmount: 0,
    taxPercentage: 0,
    taxAmount: 0,
    total: 0,
    amountPaid: 0,
    balance: 0,
    notes: '',
    status: 'unpaid',
    payments: [],
  };

  // Merge with provided initial values
  const formInitialValues = { ...defaultValues, ...initialValues };

  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={formInitialValues}
        validationSchema={BillSchema}
        onSubmit={(values) => {
          // Prepare items with calculated amounts
          const preparedItems = values.items.map(item => {
            const service = getServiceById(item.serviceId);
            const unitPrice = service ? service.price : 0;
            const amount = unitPrice * item.quantity;
            
            return {
              ...item,
              serviceName: service ? service.name : '',
              unitPrice,
              amount,
              id: item.id || uuidv4(),
              billId: values.id || '',
            };
          });
          
          // Calculate totals
          const { subtotal, discountAmount, taxAmount, total } = calculateTotals(
            preparedItems,
            values.discountType,
            values.discountValue,
            values.taxPercentage
          );
          
          // Prepare final bill object
          const bill: IBill = {
            id: values.id || uuidv4(),
            patientId: values.patientId,
            quoteId: values.quoteId,
            date: values.date,
            dueDate: values.dueDate,
            items: preparedItems,
            subtotal,
            discountType: values.discountType as 'percentage' | 'fixed' | 'none',
            discountValue: values.discountValue,
            discountAmount,
            taxPercentage: values.taxPercentage,
            taxAmount,
            total,
            amountPaid: values.amountPaid || 0,
            balance: total - (values.amountPaid || 0),
            notes: values.notes,
            status: values.status as 'unpaid' | 'partially_paid' | 'paid' | 'cancelled' | 'overdue',
            payments: values.payments || [],
            createdAt: values.createdAt || new Date(),
            updatedAt: new Date(),
          };
          
          onSubmit(bill);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => {
          // Calculate current totals for display
          const { subtotal, discountAmount, taxAmount, total } = calculateTotals(
            values.items,
            values.discountType,
            values.discountValue,
            values.taxPercentage
          );
          
          return (
            <View style={styles.formContainer}>
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant="titleMedium" style={styles.sectionTitle}>Invoice Information</Text>
                  <Divider style={styles.divider} />
                  
                  {/* Patient Selection */}
                  <Text style={styles.label}>Patient</Text>
                  <View style={styles.patientContainer}>
                    {patients.map((patient) => (
                      <Chip
                        key={patient.id}
                        selected={values.patientId === patient.id}
                        onPress={() => {
                          setFieldValue('patientId', patient.id);
                          setSelectedPatient(patient);
                        }}
                        style={styles.patientChip}
                        mode={values.patientId === patient.id ? 'flat' : 'outlined'}
                      >
                        {patient.firstName} {patient.lastName}
                      </Chip>
                    ))}
                  </View>
                  {touched.patientId && errors.patientId && (
                    <HelperText type="error">{errors.patientId}</HelperText>
                  )}
                  
                  {/* Convert from Quote */}
                  {!initialValues?.id && (
                    <View style={styles.quoteSection}>
                      <Text style={styles.label}>Convert from Quote (Optional)</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <Chip
                          selected={!selectedQuote}
                          onPress={() => {
                            setSelectedQuote(null);
                            setFieldValue('quoteId', null);
                            
                            // Reset items if a quote was previously selected
                            if (values.quoteId) {
                              setFieldValue('items', [{ 
                                id: uuidv4(), 
                                billId: '', 
                                serviceId: '', 
                                quantity: 1, 
                                notes: '',
                                serviceName: '',
                                unitPrice: 0,
                                amount: 0,
                              }]);
                              setFieldValue('discountType', 'none');
                              setFieldValue('discountValue', 0);
                              setFieldValue('taxPercentage', 0);
                            }
                          }}
                          style={styles.quoteChip}
                        >
                          No Quote
                        </Chip>
                        
                        {quotes
                          .filter(q => q.status === 'final' && q.patientId === values.patientId)
                          .map((quote) => (
                            <Chip
                              key={quote.id}
                              selected={values.quoteId === quote.id}
                              onPress={() => {
                                setSelectedQuote(quote);
                                
                                // Convert quote to bill
                                const billData = convertQuoteToBill(quote);
                                if (billData) {
                                  setFieldValue('quoteId', quote.id);
                                  setFieldValue('items', billData.items);
                                  setFieldValue('discountType', billData.discountType);
                                  setFieldValue('discountValue', billData.discountValue);
                                  setFieldValue('taxPercentage', billData.taxPercentage);
                                  setFieldValue('notes', billData.notes);
                                }
                              }}
                              style={styles.quoteChip}
                              mode={values.quoteId === quote.id ? 'flat' : 'outlined'}
                            >
                              Quote #{quote.id.substring(0, 8)} (${quote.total.toFixed(2)})
                            </Chip>
                          ))}
                      </ScrollView>
                      
                      {values.patientId && quotes.filter(q => q.status === 'final' && q.patientId === values.patientId).length === 0 && (
                        <Text style={styles.noQuotesText}>No final quotes available for this patient</Text>
                      )}
                    </View>
                  )}
                  
                  {/* Date */}
                  <TextInput
                    label="Invoice Date"
                    value={values.date ? new Date(values.date).toISOString().split('T')[0] : ''}
                    onChangeText={(text) => {
                      try {
                        const date = new Date(text);
                        if (!isNaN(date.getTime())) {
                          setFieldValue('date', date);
                        }
                      } catch (e) {
                        // Invalid date format
                      }
                    }}
                    onBlur={handleBlur('date')}
                    style={styles.input}
                    mode="outlined"
                    error={touched.date && !!errors.date}
                  />
                  {touched.date && errors.date && (
                    <HelperText type="error">{errors.date}</HelperText>
                  )}
                  
                  {/* Due Date */}
                  <TextInput
                    label="Due Date"
                    value={values.dueDate ? new Date(values.dueDate).toISOString().split('T')[0] : ''}
                    onChangeText={(text) => {
                      try {
                        const date = new Date(text);
                        if (!isNaN(date.getTime())) {
                          setFieldValue('dueDate', date);
                        }
                      } catch (e) {
                        // Invalid date format
                      }
                    }}
                    onBlur={handleBlur('dueDate')}
                    style={styles.input}
                    mode="outlined"
                    error={touched.dueDate && !!errors.dueDate}
                  />
                  {touched.dueDate && errors.dueDate && (
                    <HelperText type="error">{errors.dueDate}</HelperText>
                  )}
                  
                  {/* Notes */}
                  <TextInput
                    label="Notes"
                    value={values.notes}
                    onChangeText={handleChange('notes')}
                    onBlur={handleBlur('notes')}
                    style={styles.input}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                  />
                </Card.Content>
              </Card>
              
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.sectionHeader}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Services</Text>
                    <Button 
                      mode="text" 
                      onPress={() => {
                        setFieldValue('items', [
                          ...values.items, 
                          { 
                            id: uuidv4(), 
                            billId: values.id || '', 
                            serviceId: '', 
                            quantity: 1, 
                            notes: '',
                            serviceName: '',
                            unitPrice: 0,
                            amount: 0,
                          }
                        ]);
                      }}
                    >
                      Add Service
                    </Button>
                  </View>
                  <Divider style={styles.divider} />
                  
                  {values.items.map((item, index) => {
                    const service = getServiceById(item.serviceId);
                    const unitPrice = service ? service.price : 0;
                    const amount = unitPrice * (item.quantity || 0);
                    
                    return (
                      <View key={item.id || index} style={styles.itemContainer}>
                        <View style={styles.serviceSelection}>
                          <Text style={styles.label}>Service</Text>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {services.map((service) => (
                              <Chip
                                key={service.id}
                                selected={item.serviceId === service.id}
                                onPress={() => {
                                  const updatedItems = [...values.items];
                                  updatedItems[index].serviceId = service.id;
                                  setFieldValue('items', updatedItems);
                                }}
                                style={styles.serviceChip}
                                mode={item.serviceId === service.id ? 'flat' : 'outlined'}
                              >
                                {service.name} (${service.price.toFixed(2)})
                              </Chip>
                            ))}
                          </ScrollView>
                        </View>
                        
                        <View style={styles.quantityContainer}>
                          <TextInput
                            label="Quantity"
                            value={String(item.quantity || '')}
                            onChangeText={(text) => {
                              const quantity = parseInt(text) || 0;
                              const updatedItems = [...values.items];
                              updatedItems[index].quantity = quantity;
                              setFieldValue('items', updatedItems);
                            }}
                            keyboardType="numeric"
                            style={styles.quantityInput}
                            mode="outlined"
                          />
                          
                          <View style={styles.amountContainer}>
                            <Text style={styles.amountLabel}>Amount:</Text>
                            <Text style={styles.amount}>${amount.toFixed(2)}</Text>
                          </View>
                        </View>
                        
                        <TextInput
                          label="Notes"
                          value={item.notes}
                          onChangeText={(text) => {
                            const updatedItems = [...values.items];
                            updatedItems[index].notes = text;
                            setFieldValue('items', updatedItems);
                          }}
                          style={styles.itemNotes}
                          mode="outlined"
                        />
                        
                        {values.items.length > 1 && (
                          <Button 
                            mode="text" 
                            icon="delete" 
                            textColor={theme.colors.error}
                            onPress={() => {
                              const updatedItems = values.items.filter((_, i) => i !== index);
                              setFieldValue('items', updatedItems);
                            }}
                            style={styles.removeButton}
                          >
                            Remove
                          </Button>
                        )}
                        
                        {index < values.items.length - 1 && <Divider style={styles.itemDivider} />}
                      </View>
                    );
                  })}
                  
                  {touched.items && errors.items && (
                    <HelperText type="error">{typeof errors.items === 'string' ? errors.items : 'Please fix errors in service items'}</HelperText>
                  )}
                </Card.Content>
              </Card>
              
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant="titleMedium" style={styles.sectionTitle}>Discount & Tax</Text>
                  <Divider style={styles.divider} />
                  
                  <Text style={styles.label}>Discount Type</Text>
                  <SegmentedButtons
                    value={values.discountType}
                    onValueChange={(value) => setFieldValue('discountType', value)}
                    buttons={[
                      { value: 'none', label: 'None' },
                      { value: 'percentage', label: 'Percentage' },
                      { value: 'fixed', label: 'Fixed' },
                    ]}
                    style={styles.segmentedButtons}
                  />
                  
                  {values.discountType !== 'none' && (
                    <TextInput
                      label={values.discountType === 'percentage' ? 'Discount (%)' : 'Discount Amount ($)'}
                      value={String(values.discountValue || '')}
                      onChangeText={(text) => {
                        const value = parseFloat(text) || 0;
                        setFieldValue('discountValue', value);
                      }}
                      keyboardType="numeric"
                      style={styles.input}
                      mode="outlined"
                      right={values.discountType === 'percentage' ? <TextInput.Affix text="%" /> : <TextInput.Affix text="$" />}
                    />
                  )}
                  
                  <TextInput
                    label="Tax Percentage (%)"
                    value={String(values.taxPercentage || '')}
                    onChangeText={(text) => {
                      const value = parseFloat(text) || 0;
                      setFieldValue('taxPercentage', value);
                    }}
                    keyboardType="numeric"
                    style={styles.input}
                    mode="outlined"
                    right={<TextInput.Affix text="%" />}
                  />
                </Card.Content>
              </Card>
              
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant="titleMedium" style={styles.sectionTitle}>Summary</Text>
                  <Divider style={styles.divider} />
                  
                  <View style={styles.summaryContainer}>
                    <View style={styles.summaryRow}>
                      <Text variant="bodyMedium">Subtotal</Text>
                      <Text variant="bodyMedium">${subtotal.toFixed(2)}</Text>
                    </View>
                    
                    {discountAmount > 0 && (
                      <View style={styles.summaryRow}>
                        <Text variant="bodyMedium">
                          Discount {values.discountType === 'percentage' ? `(${values.discountValue}%)` : ''}
                        </Text>
                        <Text variant="bodyMedium">-${discountAmount.toFixed(2)}</Text>
                      </View>
                    )}
                    
                    {taxAmount > 0 && (
                      <View style={styles.summaryRow}>
                        <Text variant="bodyMedium">Tax ({values.taxPercentage}%)</Text>
                        <Text variant="bodyMedium">${taxAmount.toFixed(2)}</Text>
                      </View>
                    )}
                    
                    <View style={styles.totalRow}>
                      <Text variant="titleMedium" style={styles.totalLabel}>Total</Text>
                      <Text variant="titleMedium" style={[styles.totalAmount, { color: theme.colors.primary }]}>
                        ${total.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
              
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant="titleMedium" style={styles.sectionTitle}>Status</Text>
                  <Divider style={styles.divider} />
                  
                  <SegmentedButtons
                    value={values.status}
                    onValueChange={(value) => setFieldValue('status', value)}
                    buttons={[
                      { value: 'unpaid', label: 'Unpaid' },
                      { value: 'cancelled', label: 'Cancelled' },
                    ]}
                    style={styles.segmentedButtons}
                  />
                </Card.Content>
              </Card>
              
              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={onCancel}
                  style={styles.button}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={() => handleSubmit()}
                  style={styles.button}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Save Invoice
                </Button>
              </View>
            </View>
          );
        }}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  patientContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  patientChip: {
    margin: 4,
  },
  quoteSection: {
    marginBottom: 16,
  },
  quoteChip: {
    margin: 4,
  },
  noQuotesText: {
    fontStyle: 'italic',
    color: '#666',
    marginTop: 8,
  },
  itemContainer: {
    marginBottom: 16,
  },
  serviceSelection: {
    marginBottom: 12,
  },
  serviceChip: {
    margin: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantityInput: {
    flex: 1,
    marginRight: 12,
  },
  amountContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountLabel: {
    marginRight: 8,
    color: '#666',
  },
  amount: {
    fontWeight: 'bold',
  },
  itemNotes: {
    marginBottom: 12,
  },
  removeButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  itemDivider: {
    marginVertical: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default BillForm;
