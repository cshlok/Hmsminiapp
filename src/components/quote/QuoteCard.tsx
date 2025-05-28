import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  IconButton, 
  Box, 
  Stack,
  useTheme
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, NoteAlt as NoteAltIcon } from '@mui/icons-material';
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
        return theme.palette.primary.main + '40';
      case 'final':
        return theme.palette.secondary.main + '40';
      case 'converted':
        return theme.palette.info.main + '40';
      case 'cancelled':
        return theme.palette.error.main + '40';
      default:
        return theme.palette.primary.main + '40';
    }
  };

  // Format status text
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card 
      sx={{ 
        my: 0.75, 
        mx: 2, 
        boxShadow: 2,
        cursor: 'pointer'
      }}
      onClick={() => onPress(quote)}
    >
      <CardContent sx={{ 
        display: 'flex', 
        flexDirection: 'row',
        p: 1.5
      }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 1
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flex: 1 }}>
              Quote #{quote.id.substring(0, 8)}
            </Typography>
            <Chip 
              label={formatStatus(quote.status)}
              size="small"
              sx={{ 
                ml: 1,
                backgroundColor: getStatusColor(quote.status)
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ width: 60, mr: 1 }}>
              Patient:
            </Typography>
            <Typography variant="body2" sx={{ flex: 1 }}>
              {patientName}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ width: 60, mr: 1 }}>
              Date:
            </Typography>
            <Typography variant="body2" sx={{ flex: 1 }}>
              {format(new Date(quote.date), 'MMM dd, yyyy')}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ width: 60, mr: 1 }}>
              Items:
            </Typography>
            <Typography variant="body2" sx={{ flex: 1 }}>
              {quote.items.length}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              Total: ${quote.total.toFixed(2)}
            </Typography>
          </Box>
        </Box>
        
        <Stack direction="column">
          {quote.status !== 'converted' && quote.status !== 'cancelled' && (
            <>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(quote);
                }}
                color="primary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              
              {quote.status === 'final' && onConvert && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onConvert(quote);
                  }}
                  color="info"
                >
                  <NoteAltIcon fontSize="small" />
                </IconButton>
              )}
              
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(quote.id);
                }}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;
