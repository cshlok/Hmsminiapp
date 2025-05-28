import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Fab, 
  CircularProgress, 
  Chip, 
  TextField, 
  InputAdornment,
  IconButton,
  Paper,
  Stack,
  Grid
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import QuoteCard from '../../components/quote/QuoteCard';
import { IQuote } from '../../models/QuoteModel';
import { IPatient } from '../../models/PatientModel';

interface QuoteListScreenProps {
  quotes: IQuote[];
  patients: IPatient[];
  loading: boolean;
  searchQuery: string;
  filterStatus: string | null;
  filterPatientId: string | null;
  onSearch: (query: string) => void;
  onFilterStatus: (status: string | null) => void;
  onFilterPatient: (patientId: string | null) => void;
  onQuotePress: (quote: IQuote) => void;
  onAddQuote: () => void;
  onEditQuote: (quote: IQuote) => void;
  onDeleteQuote: (quoteId: string) => void;
  onConvertQuote?: (quote: IQuote) => void;
}

const QuoteListScreen: React.FC<QuoteListScreenProps> = ({
  quotes,
  patients,
  loading,
  searchQuery,
  filterStatus,
  filterPatientId,
  onSearch,
  onFilterStatus,
  onFilterPatient,
  onQuotePress,
  onAddQuote,
  onEditQuote,
  onDeleteQuote,
  onConvertQuote,
}) => {
  // Get patient name for a quote
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };
  
  // Get filtered quotes
  const getFilteredQuotes = () => {
    // Start with all quotes
    let filtered = [...quotes];
    
    // Apply status filter if set
    if (filterStatus) {
      filtered = filtered.filter(quote => quote.status === filterStatus);
    }
    
    // Apply patient filter if set
    if (filterPatientId) {
      filtered = filtered.filter(quote => quote.patientId === filterPatientId);
    }
    
    // Apply search filter if query exists
    if (searchQuery) {
      filtered = filtered.filter(quote => {
        const patientName = getPatientName(quote.patientId).toLowerCase();
        return patientName.includes(searchQuery.toLowerCase()) || 
               quote.id.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    
    return filtered;
  };
  
  // Get filtered quotes
  const filteredQuotes = getFilteredQuotes();

  return (
    <Box sx={{ 
      flex: 1, 
      bgcolor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ p: 2 }}>
        <TextField
          placeholder="Search quotes..."
          onChange={(e) => onSearch(e.target.value)}
          value={searchQuery}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mr: 1, display: 'inline-block' }}>Status:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label="All"
              color={filterStatus === null ? "primary" : "default"}
              onClick={() => onFilterStatus(null)}
              variant={filterStatus === null ? "filled" : "outlined"}
            />
            <Chip
              label="Draft"
              color={filterStatus === 'draft' ? "primary" : "default"}
              onClick={() => onFilterStatus('draft')}
              variant={filterStatus === 'draft' ? "filled" : "outlined"}
            />
            <Chip
              label="Final"
              color={filterStatus === 'final' ? "primary" : "default"}
              onClick={() => onFilterStatus('final')}
              variant={filterStatus === 'final' ? "filled" : "outlined"}
            />
            <Chip
              label="Converted"
              color={filterStatus === 'converted' ? "primary" : "default"}
              onClick={() => onFilterStatus('converted')}
              variant={filterStatus === 'converted' ? "filled" : "outlined"}
            />
            <Chip
              label="Cancelled"
              color={filterStatus === 'cancelled' ? "primary" : "default"}
              onClick={() => onFilterStatus('cancelled')}
              variant={filterStatus === 'cancelled' ? "filled" : "outlined"}
            />
          </Box>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mr: 1, display: 'inline-block' }}>Patient:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label="All Patients"
              color={filterPatientId === null ? "primary" : "default"}
              onClick={() => onFilterPatient(null)}
              variant={filterPatientId === null ? "filled" : "outlined"}
            />
            {patients.map(patient => (
              <Chip
                key={patient.id}
                label={`${patient.firstName} ${patient.lastName}`}
                color={filterPatientId === patient.id ? "primary" : "default"}
                onClick={() => onFilterPatient(patient.id)}
                variant={filterPatientId === patient.id ? "filled" : "outlined"}
              />
            ))}
          </Box>
        </Box>
      </Box>
      
      <Divider />
      
      {loading ? (
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <CircularProgress />
        </Box>
      ) : filteredQuotes.length === 0 ? (
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          p: 2
        }}>
          <Typography variant="h6">No quotes found</Typography>
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
            {searchQuery || filterStatus || filterPatientId
              ? 'Try adjusting your search or filters'
              : 'Create a quote to get started'}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          pb: 10 // Space for FAB
        }}>
          {filteredQuotes.map((item) => (
            <QuoteCard
              key={item.id}
              quote={item}
              patientName={getPatientName(item.patientId)}
              onPress={onQuotePress}
              onEdit={onEditQuote}
              onDelete={onDeleteQuote}
              onConvert={onConvertQuote}
            />
          ))}
        </Box>
      )}
      
      <Fab
        color="primary"
        variant="extended"
        sx={{
          position: 'fixed',
          right: 16,
          bottom: 16,
        }}
        onClick={onAddQuote}
      >
        <AddIcon sx={{ mr: 1 }} />
        New Quote
      </Fab>
    </Box>
  );
};

export default QuoteListScreen;
