import React, { useEffect , useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Button, Divider } from '@mui/material';
import { PhoneInTalk as PhoneInTalkIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import TourImages from './TourImages';
import Itinerary from './Itinerary';
import Footer from '../components/Footer';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import { Dialog, DialogActions, DialogContent, IconButton, TextField, Autocomplete } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import { useCurrency } from './CurrencyContext';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export const countryCodes = [
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

function useDeviceType() {
  const [deviceType, setDeviceType] = useState({
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceType({
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}


const TourDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumbe1, setPhoneNumber1] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travellerCount, setTravellerCount] = useState('');
  const [message, setMessage] = useState('');
  const [exchangeRates, setExchangeRates] = useState({});

  const { isMobile, isTablet } = useDeviceType();

  const selectedCurrency = localStorage.getItem('selectedCurrency') || 'USD';

  const currency = useCurrency();

  const convertPrice = (priceInUSD) => {
    if (!exchangeRates[currency]) return priceInUSD.toLocaleString();
    return (priceInUSD * exchangeRates[currency]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/9607699699`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await axios.get(`/tours/${id}`); 
        setTour(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tour details:', error);
        setLoading(false);  
      }
    };

    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        setExchangeRates(response.data.rates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };
  
    fetchExchangeRates();
    window.scrollTo(0, 0);
    fetchTourDetails();
  }, [id]); 

  const [openDialog, setOpenDialog] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tour) {
    return <div>Tour not found</div>;
  }

  // Handlers to open/close
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleSubmit = async (e) => {
    try {
      // Construct the object we want to send
      const payload = {
        name,
        email,
        phone_number: `${phoneNumber}${phoneNumbe1}`,
        travel_date: travelDate,
        traveller_count: travellerCount,
        message,
        tour_id: tour?._id || '', 
      };

      const response = await axios.post(
        '/inquiries',
        payload
      );
      Swal.fire({
        title: 'Success!',
        text: 'Your inquiry has been submitted successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      // Reset form fields or close the dialog
      setName('');
      setEmail('');
      setPhoneNumber('');
      setTravelDate('');
      setTravellerCount('');
      setMessage('');

      setOpenDialog(false);
    } catch (error) {
      Swal.fire({
        title: 'Oops!',
        text: 'Something went wrong while submitting your inquiry. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      setOpenDialog(false);
    }
  };

  return (
    <>
      <Box padding={isMobile? '3vw':'2vw'} sx={{ margin: '0 6vw ', backgroundColor: '#f0f0f0' }}>
        {/* Title */}
        <Typography
          variant= {isMobile? 'h4': isTablet? 'h3' : "h2"}
          sx={{
            fontFamily: 'Dancing Script',
            color: '#023047',
            marginBottom: '40px',
            marginTop: '20px',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          {tour.title}
        </Typography>
        {/* Days & Nights */}
        {isMobile && (
          <Box style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', columnGap: '5px' }}>
            <Box className="inline-block bg-blue-700 py-3 px-3  w-full max-w-44 mb-8 shadow-xl text-center">
              <Typography className="text-white text-6xl font-[Playfair Display]">
                {tour.nights + 1} Days / {tour.nights} Nights
              </Typography>
            </Box>

            {/* Price */}
            <Box className="inline-block bg-blue-700 py-3 w-full max-w-44 px-1 mb-8 shadow-xl text-center">
              <Typography className="text-white text-7xl font-[Domine]">
                Price: {selectedCurrency} {tour.price && !isNaN(tour.price) ? convertPrice(tour.price) : ''}
              </Typography>
            </Box>
          </Box>
        )}
        { !isMobile && (
            <Box className="inline-block bg-blue-700 py-3 px-5 mb-8 shadow-xl">
              <Typography className="text-white text-6xl font-[Playfair Display]">
                {tour.nights + 1} Days / {tour.nights} Nights
              </Typography>
            </Box>
          )}
          { !isMobile && (
            <Box className="inline-block bg-blue-700 py-3 px-5 mb-8 shadow-xl ml-2">
              <Typography className="text-white text-7xl font-[Domine]">
                Price: {selectedCurrency} {tour.price && !isNaN(tour.price) ? convertPrice(tour.price) : ''}
              </Typography>
            </Box>  
          )}

          <Button
            sx={{
              background: 'linear-gradient(to right, #1e3a8a, #4f46e5)', 
              color: 'white',
              padding: '7px 20px',
              fontSize: '20px',
              fontWeight: 'bold',
              fontFamily: 'Domine',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: isMobile? 'relative': 'absolute',
              right: isMobile ? '0vh' : '8vw',
              top: isMobile ? '-2vh' : 'auto',
              width: isMobile? '100%': 'auto',
              '&:hover': {
                background: 'linear-gradient(to right, #1e40af, #3730a3)', 
              },
            }}
            onClick={handleOpenDialog}
          >
            
            Inquire Now
            <SendIcon sx={{ marginLeft: '10px', fontSize: 'inherit' }} />
          </Button>
        
        {tour.tour_image && (
          <div style={{ display: 'flex',flexDirection: isMobile? 'column' : 'row', alignItems: 'flex-start', gap: '20px' }}>
            <div
              className="main-image-container"
              style={{ position: 'relative' }}
            >
              <img
                src={tour.tour_image}
                alt={tour.title}
                className="main-image"
                style={{
                  width: isMobile? '100%' : '65vw',
                  height: 'auto',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  maxHeight: '650px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              />
              {/* Hover effect */}
              <div
                className="main-image-overlay"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '50px',
                  borderRadius: '0 0 10px 10px',
                }}
              />
            </div>

            {/* Image Gallery (from back end arrays) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                width: '60%',
                height: 'auto',
              }}
            >
              <TourImages
                destinations={tour.destination_images}
                activities={tour.activity_images}
                hotels={tour.hotel_images}
                deviceType={isMobile ? 'mobile' : isTablet? 'tablet': 'desktop'}
              />
            </div>
          </div>
        )}


        {/* Itinerary Section */}
        <div><br /><br />
          <Itinerary />
        </div>

        {/* Back Button */}
        <div className='flex flex-col lg:flex-row justify-center gap-2 mt-6 pb-6' >
          <Button
            variant="contained"
            sx={{
              display: 'block',
              backgroundColor: 'rgba(68, 114, 202, 0.3)',
              color: '#041e6b',
              ':hover': { backgroundColor: '#4472CA' },
            }}
            onClick={() => navigate('/tours')}
          >
            Back to Tours
          </Button>
          <Button
            sx={{
              background: "linear-gradient(to right, #1e3a8a, #4f46e5)",
              color: "white",
              padding: "7px 20px",
              fontSize: "20px",
              fontWeight: "bold",
              fontFamily: "Domine",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "auto",
              "&:hover": {
                background: "linear-gradient(to right, #1e40af, #3730a3)",
              },
            }}
            onClick={handleOpenDialog}
          >
            Inquire Now
            <SendIcon sx={{ marginLeft: '10px', fontSize: 'inherit' }} />
          </Button>
        </div>
        <div>
            <Dialog
              open={openDialog}
              onClose={handleCloseDialog}
              PaperProps={{
                sx: {
                  width: isMobile? '95vwvw' : '35vw',
                  borderRadius: isMobile? '10px' : '16px',
                  overflowX: 'hidden',
                },
              }}
            >
              {/* Header Section */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '16px',
                }}
              >
                {/* Left: Image, Title, and Prices */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {tour?.tour_image && (
                    <img
                      src={tour.tour_image}
                      alt={tour.title}
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
                      {tour?.title || 'Tour Title'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: '4px' }}>
                      <Typography
                        sx={{
                          color: '#333',
                          fontSize: '1.15rem',
                          fontWeight: 700,
                        }}
                      >
                        {tour?.price
                          ? `${selectedCurrency} ${tour.price && !isNaN(tour.price) ? convertPrice(tour.price) : ''}`
                          : 'Price not available'}
                      </Typography>
                      {tour?.oldPrice && (
                        <Typography
                          sx={{
                            ml: '8px',
                            color: '#888',
                            textDecoration: 'line-through',
                            fontSize: '0.9rem',
                          }}
                        >
                          {selectedCurrency} {tour.oldPrice && !isNaN(tour.oldPrice) ? convertPrice(tour.oldPrice) : ''}
                        </Typography>
                      )}
                      {tour?.price && tour?.oldPrice && (
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
                          SAVE {selectedCurrency} {convertPrice(tour.oldPrice - tour.price)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Close Button */}
                <IconButton onClick={handleCloseDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Divider />

              {/* Form Section */}
              <DialogContent sx={{ pt: 0 , pb: '0px', px: isMobile? '10px' : '16px' }}>
                <TextField
                  required
                  label="Full Name"
                  fullWidth
                  margin="normal"
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  required
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
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
                    onChange={(e) => setTravelDate(e.target.value)}
                  />
                  <TextField
                    required
                    label="Traveller Count"
                    fullWidth
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                    onChange={(e) => setTravellerCount(e.target.value)}
                  />
                </Box>
                <TextField
                  label="Message..."
                  multiline
                  rows={3}
                  fullWidth
                  margin="normal"
                  onChange={(e) => setMessage(e.target.value)}
                />
              </DialogContent>

              {/* Bottom Section */}
              <DialogActions sx={{ justifyContent: 'center', pb: '16px' }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    // Handle form submission logic here
                    handleSubmit();
                  }}
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
        </div>
      </Box>
      <Footer />

      <IconButton
        onClick={handleWhatsAppClick}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: '#25D366',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#128C7E',
          },
          zIndex: 1000,
        }}
      >
        <WhatsAppIcon />
      </IconButton>
    </>
  );
};

export default TourDetails;
