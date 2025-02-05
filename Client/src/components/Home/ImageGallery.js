
import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Box, Rating, Button, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SendIcon from '@mui/icons-material/Send';
import Swal from 'sweetalert2';
import { Dialog, DialogContent, DialogActions, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';
import { useCurrency } from '../../screens/CurrencyContext';

const ImageGallery = ( {searchQuery = ''}) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumber1, setPhoneNumber1] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travellerCount, setTravellerCount] = useState('');
  const [message, setMessage] = useState('');

  
  const query = new URLSearchParams(location.search);
  const searchTerm = searchQuery|| query.get('search') || '';
  const nights = query.get('nights') || '';
  const days = query.get('days') || '';
  const country = query.get('country') || '';
  const selectedCurrency = localStorage.getItem('selectedCurrency') || 'USD';
  const [search, setSearch] = useState(searchTerm);
  const [searchNights, setSearchNights] = useState(nights);
  const [searchDays, setSearchDays] = useState(days);
  const [searchCountry, setSearchCountry] = useState(country);
  const [exchangeRates, setExchangeRates] = useState({});

  const { isMobile, isTablet} = useDeviceType();

  const currency = useCurrency();

  const convertPrice = (priceInUSD) => {
    if (!exchangeRates[currency]) return priceInUSD.toLocaleString();
    return (priceInUSD * exchangeRates[currency]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };


  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('/api/tours'); // Replace with your API endpoint
        setTours(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tours. Please try again later.');
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

    fetchTours();
  }, []);

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

  useEffect(() => {
    setSearch(searchTerm);
    setSearchNights(nights);
    setSearchDays(days);
    setSearchCountry(country);
  }, [searchTerm, nights, days, country]);
  
  const filteredTours = tours.filter((tour) => {
    const searchDaysValue = searchDays ? parseInt(searchDays) : null;
    const searchNightsValue = searchNights ? parseInt(searchNights) : null;
  
    return (
      (!search || tour.title.toLowerCase().includes(search.toLowerCase())) &&
      (!searchNightsValue || tour.nights === searchNightsValue) &&
      (!searchDaysValue || tour.nights +1 === searchDaysValue) &&
      (!searchCountry || tour.country.toLowerCase().includes(searchCountry.toLowerCase()))
    );
    });

  
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = new URLSearchParams({
      search,
      nights: searchNights,
      days: searchDays,
      country: searchCountry
    }).toString();
    navigate(`/imagegallery?${query}`);
  };


  const handleInquireNowClick = (tour) => {
    setSelectedTour(tour);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setName('');
    setEmail('');
    setPhoneNumber('');
    setTravelDate('');
    setTravellerCount('');
    setMessage('');
  };

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

  const handleSubmitInquiry = async () => {
    try {
      const payload = {
        name,
        email,
        phone_number: `${phoneNumber} ${phoneNumber1}`,
        travel_date: travelDate,
        traveller_count: travellerCount,
        message,
        tour_id: selectedTour._id,
      };

      await axios.post('http://localhost:8000/api/inquiries', payload);
      Swal.fire('Success!', 'Your inquiry has been submitted successfully.', 'success');
      handleCloseDialog();
    } catch (error) {
      Swal.fire('Error!', 'Failed to submit inquiry. Please try again.', 'error');
    }
  };

  const handleClick = (id) => {
    navigate(`/tours/${id}`);
  };



  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/9609969974`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Box sx={{ width: '100%', minHeight: '65vh', padding: '20px 30px', backgroundColor: '#f9f9f9' }}>
      <Box 
        mb={3}
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, // Column layout for mobile, row for larger screens
          gap: '10px',
          backgroundColor: '#dfedf7',
          padding: '10px 20px',
          borderRadius: '8px',
        }}
      >
        <TextField
          fullWidth
          label="Search for packages"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TextField
          fullWidth
          label="Nights"
          variant="outlined"
          value={searchNights}
          onChange={(e) => setSearchNights(e.target.value)}
        />
        <TextField
          fullWidth
          label="Days"
          variant="outlined"
          value={searchDays}
          onChange={(e) => setSearchDays(e.target.value)}
        />
        <TextField
          fullWidth
          label="Country"
          variant="outlined"
          value={searchCountry}
          onChange={(e) => setSearchCountry(e.target.value)}
        />
        <IconButton
          type="submit"
          color="primary"
          sx={{
            padding: '10px 15px',
            backgroundColor: '#2196F3',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#1976D2',
            },
            alignSelf: { xs: 'center', sm: 'flex-start' }, // Center the button on mobile
          }}
        >
          <SearchIcon />
        </IconButton>
      </Box>

      <Grid container spacing={5}>
        {filteredTours.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card
              sx={{
                borderRadius: '16px',
                maxHeight: '580px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
                },
                overflow: 'hidden',
              }}
            >
              <Box sx={{ position: 'relative' }}>
                {/* Check if images array is empty and use a default placeholder image */}
                <CardMedia
                  component="img"
                  height="200"
                  image={item.tour_image}
                  alt={item.title}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      filter: 'brightness(0.85)',
                    },
                  }}
                  onClick={() => handleClick(item._id)}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: '#fff',
                    padding: '10px',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                  {item.nights + 1} days & {item.nights} nights
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ backgroundColor: '#fff', padding: '20px' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h1" fontWeight="bold" fontSize={24}>
                    {item.title}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 'bold',
                    }}
                    gutterBottom
                    display="flex"
                    justifyContent="space-between"
                    mb={1}
                  >
                    {/* Check if price exists and is a valid number before calling toLocaleString */}
                    {selectedCurrency} {item.price && !isNaN(item.price) ? convertPrice(item.price) : ''}
                    {item.oldPrice && !isNaN(item.oldPrice) && (
                      <Typography
                        component="span"
                        variant="body1"
                        sx={{ textDecoration: 'line-through', marginLeft: 1, color: 'text.secondary' }}
                      >
                        {selectedCurrency} ${convertPrice(item.oldPrice)}
                      </Typography>
                    )}
                    {item.oldPrice && !isNaN(item.oldPrice) && (
                      <Typography component="span" variant="body2" color="error" fontWeight="bold" backgroundColor="rgba(76, 175, 80, 0.1)" padding={0.5}>
                        SAVE {selectedCurrency} {convertPrice(item.oldPrice-item.price)}
                      </Typography>
                    )}
                  </Typography>
                </Box>
                <Box display="flex" gap={2} mt={3}>
                  <Button
                    variant="outlined"
                    startIcon={<WhatsAppIcon />}
                    sx={{
                      borderColor: '#4CAF50',
                      color: '#4CAF50',
                      padding: '0px 15px',
                      '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderColor: '#4CAF50',
                      },
                    }}
                    onClick={() => handleWhatsAppClick()}
                  >
                    Chat
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: '#2196F3',
                      color: '#fff',
                      padding: '5px 0',
                      '&:hover': {
                        backgroundColor: '#1976D2',
                      },
                    }}
                    onClick={() => handleInquireNowClick(item)}
                  >
                     Inquire Now
                     <SendIcon sx={{ marginLeft: '10px', fontSize: 'inherit' }} />
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            width: isMobile ? '95vw' : '35vw', // Responsive width
            borderRadius: isMobile ? '10px' : '16px', // Responsive border radius
            overflowX: 'hidden', // Prevent horizontal overflow
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
              <Box sx={{ display: 'flex', alignItems: 'center', mt: '4px' }}>
                <Typography
                  sx={{
                    color: '#333',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                  }}
                >
                  {selectedTour?.price
                    ? `${selectedCurrency} ${Number(convertPrice(selectedTour.price)).toLocaleString()}`
                    : 'Price not available'}
                </Typography>
                {selectedTour?.oldPrice && (
                  <Typography
                    sx={{
                      ml: '8px',
                      color: '#888',
                      textDecoration: 'line-through',
                      fontSize: '0.9rem',
                    }}
                  >
                    {selectedCurrency} ${convertPrice(selectedTour.oldPrice)}
                  </Typography>
                )}
                {selectedTour?.price && selectedTour?.oldPrice && (
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
                    SAVE {selectedCurrency} {convertPrice(selectedTour.oldPrice-selectedTour.price)}
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
        <DialogContent sx={{ pt: 0, pb: '0px', px: isMobile ? '10px' : '16px' }}>
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
            <TextField
              label="Country Code"
              sx={{ width: '100px' }}
              onChange={(e) => setPhoneNumber(e.target.value)}
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
            onClick={() => handleSubmitInquiry()}
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

    </Box>
  );
};

export default ImageGallery;
