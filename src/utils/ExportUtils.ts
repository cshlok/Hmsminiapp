// Web-compatible export utilities
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { IPatient } from '../models/PatientModel';
import { IAppointment } from '../models/AppointmentModel';
import { IService } from '../models/ServiceModel';
import { IQuote } from '../models/QuoteModel';
import { IBill } from '../models/BillingModel';

// Utility function to convert data to Excel format and download
export const exportToExcel = (
  data: any[],
  fileName: string,
  sheetName: string = 'Sheet1'
): void => {
  try {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    // Generate Excel file
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
    // Create a blob and download
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
    
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};

// Function to prepare patient data for export
export const preparePatientDataForExport = (patients: IPatient[]): any[] => {
  return patients.map(patient => ({
    'Patient ID': patient.id,
    'Name': patient.name,
    'Gender': patient.gender,
    'Age': patient.age,
    'Contact': patient.contact,
    'Email': patient.email,
    'Address': patient.address,
    'Medical History': patient.medicalHistory,
    'Allergies': patient.allergies,
    'Medications': patient.medications,
    'Last Visit': patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A',
    'Created At': new Date(patient.createdAt).toLocaleDateString(),
  }));
};

// Function to prepare appointment data for export
export const prepareAppointmentDataForExport = (appointments: IAppointment[], patients: IPatient[]): any[] => {
  return appointments.map(appointment => {
    const patient = patients.find(p => p.id === appointment.patientId);
    return {
      'Appointment ID': appointment.id,
      'Patient Name': patient ? patient.name : 'Unknown',
      'Date': new Date(appointment.date).toLocaleDateString(),
      'Start Time': appointment.startTime,
      'End Time': appointment.endTime,
      'Duration (minutes)': appointment.duration,
      'Status': appointment.status,
      'Notes': appointment.notes,
      'Created At': new Date(appointment.createdAt).toLocaleDateString(),
    };
  });
};

// Function to prepare service data for export
export const prepareServiceDataForExport = (services: IService[]): any[] => {
  return services.map(service => ({
    'Service ID': service.id,
    'Name': service.name,
    'Category ID': service.categoryId,
    'Price': service.price,
    'Duration (minutes)': service.duration,
    'Description': service.description,
    'Created At': new Date(service.createdAt).toLocaleDateString(),
  }));
};

// Function to prepare quote data for export
export const prepareQuoteDataForExport = (quotes: IQuote[], patients: IPatient[]): any[] => {
  return quotes.map(quote => {
    const patient = patients.find(p => p.id === quote.patientId);
    return {
      'Quote ID': quote.id,
      'Patient Name': patient ? patient.name : 'Unknown',
      'Date': new Date(quote.date).toLocaleDateString(),
      'Subtotal': quote.subtotal,
      'Discount Amount': quote.discountAmount,
      'Tax Amount': quote.taxAmount,
      'Total': quote.total,
      'Status': quote.status,
      'Notes': quote.notes,
      'Created At': new Date(quote.createdAt).toLocaleDateString(),
    };
  });
};

// Function to prepare bill data for export
export const prepareBillDataForExport = (bills: IBill[], patients: IPatient[]): any[] => {
  return bills.map(bill => {
    const patient = patients.find(p => p.id === bill.patientId);
    return {
      'Bill ID': bill.id,
      'Patient Name': patient ? patient.name : 'Unknown',
      'Date': new Date(bill.date).toLocaleDateString(),
      'Due Date': new Date(bill.dueDate).toLocaleDateString(),
      'Subtotal': bill.subtotal,
      'Discount Amount': bill.discountAmount,
      'Tax Amount': bill.taxAmount,
      'Total': bill.total,
      'Amount Paid': bill.amountPaid,
      'Balance': bill.balance,
      'Status': bill.status,
      'Notes': bill.notes,
      'Created At': new Date(bill.createdAt).toLocaleDateString(),
    };
  });
};

// Main export utility function
export const exportData = (
  type: 'patients' | 'appointments' | 'services' | 'quotes' | 'bills' | 'all',
  patients: IPatient[],
  appointments: IAppointment[],
  services: IService[],
  quotes: IQuote[],
  bills: IBill[]
): void => {
  const timestamp = new Date().toISOString().split('T')[0];
  
  try {
    if (type === 'patients' || type === 'all') {
      const patientData = preparePatientDataForExport(patients);
      exportToExcel(patientData, `patients_export_${timestamp}`, 'Patients');
    }
    
    if (type === 'appointments' || type === 'all') {
      const appointmentData = prepareAppointmentDataForExport(appointments, patients);
      exportToExcel(appointmentData, `appointments_export_${timestamp}`, 'Appointments');
    }
    
    if (type === 'services' || type === 'all') {
      const serviceData = prepareServiceDataForExport(services);
      exportToExcel(serviceData, `services_export_${timestamp}`, 'Services');
    }
    
    if (type === 'quotes' || type === 'all') {
      const quoteData = prepareQuoteDataForExport(quotes, patients);
      exportToExcel(quoteData, `quotes_export_${timestamp}`, 'Quotes');
    }
    
    if (type === 'bills' || type === 'all') {
      const billData = prepareBillDataForExport(bills, patients);
      exportToExcel(billData, `bills_export_${timestamp}`, 'Bills');
    }
  } catch (error) {
    console.error('Error in exportData:', error);
    throw error;
  }
};
