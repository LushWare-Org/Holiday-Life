import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Swal from 'sweetalert2';

const foodCategoryMap = {
  0: 'Half Board',
  1: 'Full Board',
  2: 'All Inclusive'
};

// Country codes for phone number selection
const countryCodes = [
  { code: "+1", label: "🇺🇸" },
  { code: "+44", label: "🇬🇧" },
  { code: "+91", label: "🇮🇳" },
  { code: "+61", label: "🇦🇺" },
  { code: "+49", label: "🇩🇪" },
  { code: "+33", label: "🇫🇷" },
  { code: "+81", label: "🇯🇵" },
  { code: "+86", label: "🇨🇳" },
  { code: "+971", label: "🇦🇪" },
  { code: "+7", label: "🇷🇺" },
  { code: "+55", label: "🇧🇷" },
  { code: "+34", label: "🇪🇸" },
  { code: "+39", label: "🇮🇹" },
  { code: "+82", label: "🇰🇷" },
  { code: "+92", label: "🇵🇰" },
  { code: "+90", label: "🇹🇷" },
  { code: "+27", label: "🇿🇦" },
  { code: "+234", label: "🇳🇬" },
  { code: "+20", label: "🇪🇬" },
  { code: "+351", label: "🇵🇹" },
  { code: "+31", label: "🇳🇱" },
  { code: "+46", label: "🇸🇪" },
  { code: "+41", label: "🇨🇭" },
  { code: "+32", label: "🇧🇪" },
  { code: "+43", label: "🇦🇹" },
  { code: "+47", label: "🇳🇴" },
  { code: "+45", label: "🇩🇰" },
  { code: "+380", label: "🇺🇦" },
  { code: "+66", label: "🇹🇭" },
  { code: "+65", label: "🇸🇬" },
  { code: "+64", label: "🇳🇿" },
  { code: "+63", label: "🇵🇭" },
  { code: "+60", label: "🇲🇾" },
  { code: "+62", label: "🇮🇩" },
  { code: "+58", label: "🇻🇪" },
  { code: "+57", label: "🇨🇴" },
  { code: "+56", label: "🇨🇱" },
  { code: "+52", label: "🇲🇽" },
  { code: "+51", label: "🇵🇪" },
  { code: "+48", label: "🇵🇱" },
  { code: "+40", label: "🇷🇴" },
  { code: "+420", label: "🇨🇿" },
  { code: "+36", label: "🇭🇺" },
  { code: "+98", label: "🇮🇷" },
  { code: "+212", label: "🇲🇦" },
  { code: "+213", label: "🇩🇿" },
  { code: "+216", label: "🇹🇳" },
  { code: "+94", label: "🇱🇰" },
  { code: "+880", label: "🇧🇩" },
  { code: "+972", label: "🇮🇱" },
  { code: "+353", label: "🇮🇪" },
  { code: "+354", label: "🇮🇸" },
  { code: "+505", label: "🇳🇮" },
  { code: "+509", label: "🇭🇹" },
  { code: "+93", label: "🇦🇫" },
  { code: "+995", label: "🇬🇪" },
  { code: "+374", label: "🇦🇲" },
  { code: "+993", label: "🇹🇲" },
  { code: "+998", label: "🇺🇿" },
  { code: "+675", label: "🇵🇬" },
  { code: "+679", label: "🇫🇯" },
  { code: "+676", label: "🇹🇴" },
  { code: "+960", label: "🇲🇻" },
  { code: "+248", label: "🇸🇨" },
  { code: "+267", label: "🇧🇼" },
  { code: "+254", label: "🇰🇪" },
  { code: "+255", label: "🇹🇿" },
  { code: "+256", label: "🇺🇬" },
  { code: "+233", label: "🇬🇭" },
  { code: "+225", label: "🇨🇮" },
  { code: "+221", label: "🇸🇳" },
  { code: "+218", label: "🇱🇾" },
  { code: "+964", label: "🇮🇶" },
  { code: "+967", label: "🇾🇪" },
  { code: "+965", label: "🇰🇼" },
  { code: "+966", label: "🇸🇦" },
  { code: "+973", label: "🇧🇭" },
  { code: "+974", label: "🇶🇦" },
  { code: "+968", label: "🇴🇲" },
  { code: "+961", label: "🇱🇧" },
  { code: "+963", label: "🇸🇾" },
  { code: "+249", label: "🇸🇩" },
  { code: "+211", label: "🇸🇸" },
  { code: "+975", label: "🇧🇹" },
  { code: "+977", label: "🇳🇵" },
  { code: "+856", label: "🇱🇦" },
  { code: "+855", label: "🇰🇭" },
  { code: "+852", label: "🇭🇰" },
  { code: "+853", label: "🇲🇴" },
  { code: "+373", label: "🇲🇩" },
  { code: "+381", label: "🇷🇸" },
  { code: "+382", label: "🇲🇪" },
  { code: "+389", label: "🇲🇰" },
];

const EnquiryForm = ({
  open,
  onClose,
  selectedTour,
  selectedCurrency,
  convertPrice,
  isMobile,
  // New props to display and send to backend
  finalPrice, 
  finalOldPrice,
  selectedNightsKey,
  selectedNightsOption,
  selectedFoodCategory,
}) => {
  // Local state for the enquiry form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumber1, setPhoneNumber1] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travellerCount, setTravellerCount] = useState('');
  const [message, setMessage] = useState('');

  // If you want the form to prefill something, do it here
  useEffect(() => {
    // For now, we leave them blank
  }, [open]);

  // Reset form and close dialog
  const handleClose = () => {
    setName('');
    setEmail('');
    setPhoneNumber('');
    setPhoneNumber1('');
    setTravelDate('');
    setTravellerCount('');
    setMessage('');
    onClose();

  };

  const handleSubmitInquiry = async () => {
    try {
      const nightsOption =
        selectedTour?.nights?.[String(selectedNightsKey)]?.[String(selectedNightsOption)]?.option ||
        selectedNightsOption; // fallback to raw value
  
      const foodCategoryLabel = foodCategoryMap[String(selectedFoodCategory)] || selectedFoodCategory;
  
      const numericNightsKey = selectedNightsKey ? parseInt(selectedNightsKey, 10) : 0;
  
      const payload = {
        name,
        email,
        phone_number: `${phoneNumber} ${phoneNumber1}`,
        travel_date: travelDate,
        traveller_count: travellerCount,
        message,
        tour: selectedTour?.title,
        final_price: finalPrice, // Ensure totalPrice is computed correctly in the parent
        currency: selectedCurrency,
        selected_nights_key: numericNightsKey,
        selected_nights_option: nightsOption,
        selected_food_category: foodCategoryLabel,
      };
  
      const response = await axios.post('/inquiries', payload);
  
      if (response.status >= 200 && response.status < 300) {
        Swal.fire('Success!', 'Your inquiry has been submitted successfully.', 'success');
        handleClose();
      } else {
        Swal.fire('Error!', 'Unexpected response from server. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      Swal.fire('Error!', 'Failed to submit inquiry. Please try again.', 'error');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: isMobile ? '95vw' : '35vw',
          borderRadius: isMobile ? '10px' : '16px',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Header with tour image, title and base price (if any) */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {selectedTour?.tour_image && (
            <img
              src={selectedTour.tour_image}
              alt={selectedTour.title}
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'cover',
                borderRadius: '4px',
                marginRight: '16px',
              }}
            />
          )}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {selectedTour?.title || 'Tour Title'}
            </Typography>
            {/* If you still want to show the "oldPrice" vs "new price" in the header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: '4px' }}>
              {finalPrice && (
                <Typography
                  sx={{
                    color: '#333',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                  }}
                >
                  {selectedCurrency} {convertPrice(finalPrice || 0)}
                </Typography>
              )}
              {finalOldPrice && (
                <Typography
                  sx={{
                    ml: '8px',
                    color: '#888',
                    textDecoration: 'line-through',
                    fontSize: '0.9rem',
                  }}
                >
                  {selectedCurrency}{' '}
                  {convertPrice(finalOldPrice || 0)}
                </Typography>
              )}
              {finalOldPrice && finalPrice && (
                <Typography
                  sx={{
                    ml: '8px',
                    backgroundColor: 'green',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  SAVE {selectedCurrency}{' '}
                  {convertPrice(finalOldPrice - finalPrice)}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Display the user's chosen details */}
      <Box sx={{ px: isMobile ? '10px' : '16px', py: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Your Selections:
        </Typography>
        <Typography variant="body1">
          <strong>Nights:</strong> {selectedNightsKey || 'N/A'}
        </Typography>
        <Typography variant="body1">
        <strong>Option:</strong> {selectedTour?.nights?.[selectedNightsKey]?.[selectedNightsOption]?.option || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Food Category:</strong> {foodCategoryMap[selectedFoodCategory] || 'N/A'}
        </Typography>
      </Box>

      <Divider />

      <DialogContent sx={{ pt: 0, pb: '0px', px: isMobile ? '10px' : '16px' }}>
        <TextField
          required
          label="Full Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          required
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Box sx={{ display: 'flex', gap: '8px', mt: 2 }}>
          <Autocomplete
            options={countryCodes}
            getOptionLabel={(option) => `${option.label} ${option.code}`}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>{option.label}</Typography>
                <Typography>{option.code}</Typography>
              </Box>
            )}
            renderInput={(params) => <TextField {...params} label="Country Code" />}
            onChange={(event, newValue) => setPhoneNumber(newValue ? newValue.code : '')}
            sx={{ width: '200px' }}
          />
          <TextField
            required
            label="Your Phone"
            fullWidth
            type="tel"
            value={phoneNumber1}
            onChange={(e) => setPhoneNumber1(e.target.value)}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: '8px', mt: 2 }}>
          <TextField
            required
            label="Travel Date"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
          />
          <TextField
            required
            label="Traveller Count"
            fullWidth
            type="number"
            InputProps={{ inputProps: { min: 1 } }}
            value={travellerCount}
            onChange={(e) => setTravellerCount(e.target.value)}
          />
        </Box>
        <TextField
          label="Message..."
          multiline
          rows={3}
          fullWidth
          margin="normal"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: '16px' }}>
        <Button
          variant="contained"
          onClick={handleSubmitInquiry}
          sx={{
            backgroundColor: '#016170',
            color: '#fff',
            padding: '8px 16px',
            fontSize: '16px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#e65c00',
            },
          }}
        >
          Connect with an Expert
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EnquiryForm;