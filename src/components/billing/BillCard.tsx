import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { IBill } from '../../models/BillingModel';

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
}) => {
  return (
    <Card onClick={() => onPress(bill)} sx={{ mb: 1, cursor: 'pointer' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">
              Bill #{(bill?.id || 'NEW').substring(0, 8)}
            </Typography>
            <Typography variant="body2">
              Patient: {patientName}
            </Typography>
            <Typography variant="body2">
              Total: ${(bill?.total || 0).toFixed(2)}
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={(e) => { e.stopPropagation(); onEdit(bill); }}>
              <Edit />
            </IconButton>
            <IconButton onClick={(e) => { e.stopPropagation(); onDelete(bill?.id || ''); }}>
              <Delete />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BillCard;
