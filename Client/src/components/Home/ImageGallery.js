
import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Box, Button, CircularProgress, TextField, Autocomplete } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useCurrency } from '../../screens/CurrencyContext';

const ImageGallery = ({ searchQuery = '', passedCountry='' }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const query = new URLSearchParams(location.search);
  const searchTerm = searchQuery|| query.get('search') || '';
  const nights = query.get('nights') || '';
  const country = passedCountry || query.get('country') || '';
  const market = query.get('market') || '';
  const minPrice = query.get('minPrice') || '';
  const maxPrice = query.get('maxPrice') || '';
  const selectedCurrency = localStorage.getItem('selectedCurrency') || 'USD';
  const [search, setSearch] = useState(searchTerm);
  const [searchNights, setSearchNights] = useState(nights);
  const [searchCountry, setSearchCountry] = useState(country);
  
  const [searchMarket, setSearchMarket] = useState('');
  const [exchangeRates, setExchangeRates] = useState({});
  const [searchMinPrice, setSearchMinPrice] = useState(minPrice);
  const [searchMaxPrice, setSearchMaxPrice] = useState(maxPrice);
  const { isMobile, isTablet} = useDeviceType();

  const currency = useCurrency();

  const convertPrice = (priceInUSD) => {
    if (!exchangeRates[currency]) return priceInUSD.toLocaleString();
    return (priceInUSD * exchangeRates[currency]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };


  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('/tours'); // Replace with your API endpoint
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
    setSearchCountry(country);
    setSearchMarket(market);
    setSearchMinPrice(minPrice);
    setSearchMaxPrice(maxPrice);
  }, [searchTerm, nights, country, market, minPrice, maxPrice]);

  const marketMapping = {
    1: 'Indian',
    2: 'Chinese',
    3: 'Asian',
    4: 'Middle East',
    5: 'Russia and CIS',
    6: 'Rest of the World',
  };
  
  // Also create the inverse for easy lookup
  const marketMappingInverse = Object.fromEntries(
    Object.entries(marketMapping).map(([key, value]) => [value, Number(key)])
  );

  const localToUSD = (localPrice) => {
    if (!exchangeRates[currency]) return localPrice; 
    return localPrice / exchangeRates[currency];
  };

  const filteredTours = tours.filter((tour) => {
    const searchNightsValue = searchNights ? parseInt(searchNights, 10) : null;

    const currentDate = new Date();
    const tourExpiryDate = new Date(tour.expiry_date);

    if (tourExpiryDate < currentDate) {
      return false;
    }
    const marketMatch =
    !searchMarket ||
    (Array.isArray(tour.markets) && tour.markets.includes(Number(searchMarket)));
    
    const minValUSD = searchMinPrice
      ? localToUSD(parseFloat(searchMinPrice))
      : null;
    const maxValUSD = searchMaxPrice
        ? localToUSD(parseFloat(searchMaxPrice))
        : null;

      const hasMatchingNights =
        !searchNightsValue ||
        (tour.nights && Object.keys(tour.nights).includes(searchNightsValue.toString()));
    
      return (
        (!search || tour.title.toLowerCase().includes(search.toLowerCase())) &&
        hasMatchingNights &&
        (!minValUSD || tour.price >= minValUSD) &&
        (!maxValUSD || tour.price <= maxValUSD) &&
        (!searchCountry || tour.country.toLowerCase().includes(searchCountry.toLowerCase())) &&
        marketMatch
      );
    });

  
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const queryParams = new URLSearchParams({
      search,
      nights: searchNights,
      country: searchCountry,
      markets: searchMarket,
      minPrice: searchMinPrice,
      maxPrice: searchMaxPrice,
    }).toString();
    navigate(`/imagegallery?${queryParams}`);
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
          flexDirection: isMobile ? 'column' : 'row',
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
          label="Min Price"
          variant="outlined"
          value={searchMinPrice}
          onChange={(e) => setSearchMinPrice(e.target.value)}
        />
        <TextField
          fullWidth
          label="Max Price"
          variant="outlined"
          value={searchMaxPrice}
          onChange={(e) => setSearchMaxPrice(e.target.value)}
        />

        <TextField
          fullWidth
          label="Country of Travel"
          variant="outlined"
          value={searchCountry}
          onChange={(e) => setSearchCountry(e.target.value)}
        />
        <Autocomplete
          options={Object.values(marketMapping)}
          renderInput={(params) => (
            <TextField {...params} label="Your Region" variant="outlined" />
          )}
          value={marketMapping[searchMarket] || ''}
          onChange={(event, newValue) => {
            setSearchMarket(marketMappingInverse[newValue] || '');
          }}
          fullWidth
        />
      </Box>

      <Grid container spacing={5}>
        {filteredTours.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card
              sx={{
                borderRadius: '16px',
                maxHeight: '100%',
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
                    {item.nights && typeof item.nights === 'object' && Object.keys(item.nights).length > 0
                      ? `${Object.keys(item.nights)[0]} Days/${Object.keys(item.nights)[0]} Nights`  // Get the first key
                      : 'N/A'}
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ backgroundColor: '#fff', padding: '10px 20px 20px 20px' }}>
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
                    onClick={handleWhatsAppClick}
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
                    onClick={() => navigate(`/tours/${item._id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ImageGallery;