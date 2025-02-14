import React from 'react';
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import ImageGallery from '../components/Home/ImageGallery';
import Footer from '../components/Footer';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FAQAccordion from './FAQAccordion';
import ImageGal from '../components/Home/ImageGal';
import LiveChat from '../components/Home/LiveChat';
import Experience from '../components/Home/Experience';
import HomeExperience from '../components/Home/HomeExperience';
import OffersSection from '../components/Home/OffersSection';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import { useCurrency } from './CurrencyContext'; 

import Autocomplete from '@mui/material/Autocomplete';


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

const HomeScreen = () => {
  const { isMobile, isTablet } = useDeviceType();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumber1, setPhoneNumber1] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travellerCount, setTravellerCount] = useState('');
  const [message, setMessage] = useState('');
  const [exchangeRates, setExchangeRates] = useState({});
  const { currency } = useCurrency(); 

  

  const convertPrice = (priceInUSD) => {
    if (priceInUSD === undefined || priceInUSD === null || isNaN(priceInUSD)) {
      return '';
    }
  
    
    if (!exchangeRates[currency]) {
      return Number(priceInUSD).toLocaleString();
    }
    
    const convertedValue = Number(priceInUSD) * exchangeRates[currency];
    return convertedValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('/tours'); // Replace with your API endpoint
        setTours(response.data.slice(0, 3)); // Fetch only the first 3 tours
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch tours:', err);
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
  
  const handleNavigate = () => {
    navigate('/tours'); 
  };

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/9607699699`;
    window.open(whatsappUrl, '_blank');
  };
  
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

      await axios.post('/inquiries', payload);
      Swal.fire('Success!', 'Your inquiry has been submitted successfully.', 'success');
      handleCloseDialog();
    } catch (error) {
      Swal.fire('Error!', 'Failed to submit inquiry. Please try again.', 'error');
    }
  };

  return (
    <div style={{ backgroundColor: '#caf0f8' }}>
      <LiveChat />

      <Box bgcolor="#ffffff" padding={isMobile ? '10px' : '35px'} mt="30px" minWidth='98vw' marginTop={'1px'}><br></br>
        <div style={{ display: 'flex', flexDirection: isMobile || isTablet? 'column' : 'row' , marginBottom: '30px' }}>
          {/* Left Block: Image */}
          <div
            style={{
              flex: 1,
              backgroundImage: "url('https://i.postimg.cc/Cxf0chWC/Untitled-design.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '550px',
              minHeight: '550px',
              transition: 'transform 0.3s ease, background-color 0.3s ease, opacity 0.8s ease', 
              cursor: 'pointer', 
            }}
            
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.04)'; 
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            }}
            
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)'; 
              e.target.style.backgroundColor = 'transparent';
            }}
            
          ></div>

          <div
            style={{
              flex: 1,
              backgroundColor: '#caf0f8',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginLeft: isMobile || isTablet? '0' : '20px',
              justifyContent: 'center',
              border: '1px solid rgba(54, 160, 226, 0.71)',
            }}
          >
            <h2
              style={{
                fontFamily: 'Dancing Script',
                color: '#0A369D',
                textAlign: 'center',
                fontSize: '40px',
                fontWeight: 'bold',
              }}
            >
              About<br />Holiday Life
            </h2>
            <br />
            <p
              style={{
                fontFamily: 'Domine',
                fontSize: '20px',
                lineHeight: '1.8',
                color: '#4472CA',
                margin: '5px',
                textAlign: 'justify',
                padding: '0 30px',
              }}
            >
              Holiday Life Travel Agency is your premier partner in crafting unforgettable travel experiences. Specializing in bespoke itineraries and personalized service, we offer curated journeys to destinations worldwide, ensuring every detail of your holiday is meticulously planned. Whether you seek a relaxing beach getaway, an adventurous expedition, or a cultural exploration, Holiday Life Travel Agency turns your dreams into reality with expertise and passion, making every trip a journey to remember. </p>
            <a
              href="none"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                color: '#ffffff',
                backgroundColor: '#023e8a',
                textDecoration: 'none',
                border: 'solid 1px',
                borderRadius: '10px',
                borderColor: '#0A369D',
                margin: isMobile || isTablet? '20px 0' : '20px 0 0 0',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.04)'; 
                e.target.style.backgroundColor = '#022859';
              }}
              
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)'; 
                e.target.style.backgroundColor = '#023e8a';
              }}
              
              onClick={{handleNavigate}}
              
            >
              Discover Tours
            </a>
          </div>
        </div>
      </Box>

      <Container>
        <Typography variant="h3" component="div" sx={{ color: '#0A369D', marginBottom: '20px', fontFamily: 'Dancing Script', textAlign: 'center', fontWeight: 'semibold' }}>
          <br />
          Experience the Essence of The Ocean
        </Typography><br />
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" color="#4472CA" marginBottom={3} align="justify" fontFamily='Domine' fontSize={18} padding='0 10px'>
            The Maldives, with its turquoise waters, pristine beaches, and vibrant marine life, is a dream destination for travelers seeking a slice of tropical paradise. This archipelago in the Indian Ocean offers more than just breathtaking views; it provides a plethora of unique experiences that cater to adventure seekers, relaxation enthusiasts, and nature lovers alike. Here's a guide to the top activities to experience in the Maldives.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" color="#4472CA" marginBottom={3} align="justify" fontFamily='Domine' fontSize={18} padding='0 10px'>
            The Maldives is more than just a destination; it’s an experience. From its stunning natural beauty to its luxurious offerings and rich culture, there’s something for everyone in this tropical paradise. Whether you’re seeking adventure, romance, or tranquility, the Maldives promises memories that will last a lifetime. So, pack your sunscreen, grab your snorkeling gear, and get ready to immerse yourself in the wonders of the Maldives!
            </Typography>
          </Grid>
        </Grid>
        <br />
      </Container>

      <HomeExperience /><br />

      <Box
        bgcolor="#ffffff"
        padding="30px"
        mt="30px"
        sx={{
          width: isMobile? '100%': '90%',
          position: 'relative',
          left: isMobile? 0 : '80px' ,
          boxSizing: 'border-box',
        }}
      >
        <Typography
          variant="h3"
          component="div"
          sx={{
            color: '#0A369D',
            marginBottom: '30px',
            fontFamily: 'Dancing Script',
            textAlign: 'center',
          }}
        >
         Our Tour Packages
        </Typography>
        <Typography
          variant="body1"
          color="#4472CA"
          marginBottom={3}
          align="justify"
          fontFamily="Domine"
          fontSize={17}
        >
          Our tour packages offer a seamless blend of luxury, adventure, and tranquility, making it the ultimate tropical escape. These packages typically include stays in overwater villas or beachfront resorts, where you can wake up to panoramic ocean views and enjoy private access to crystal-clear lagoons. Whether you're snorkeling amidst vibrant coral reefs, indulging in rejuvenating spa treatments, or savoring gourmet meals at underwater restaurants, every moment is designed for unforgettable memories. With options like sunset cruises, island-hopping excursions, and water sports, Maldives tour packages cater to honeymooners, families, and solo travelers alike, ensuring a stress-free journey in paradise.
        </Typography>
        <br />
        <Container>
          <Grid container spacing={4}>
            {loading ? (
              <Typography variant="h6" align="center">
                Loading tours...
              </Typography>
            ) : (
              tours.map((tour) => (
                <Grid item xs={12} md={4} key={tour._id}>
                  <Box
                    sx={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <img
                      src={tour.tour_image}
                      alt={tour.title}
                      style={{
                        width: '100%',
                        height: '200',
                        objectFit: 'cover',
                        borderRadius: '8px 8px 0 0',
                      }}
                    />
                    <div style={{ padding: '20px' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h1" fontWeight="bold" fontSize={24}>
                          {tour.title}
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
                      {currency} {tour.price && !isNaN(tour.price) ? convertPrice(tour.price) : 'N/A'} {' '}
                      {tour.price && !isNaN(tour.price) && (
                        <Typography
                          component="span"
                          variant="body1"
                          sx={{ textDecoration: 'line-through', marginLeft: 1, color: 'text.secondary' }}
                        >
                          {currency} {convertPrice(tour.oldPrice)}
                        </Typography>
                      )}
                      {tour.price && !isNaN(tour.price) && (
                        <Typography component="span" variant="body2" color="error" fontWeight="bold" backgroundColor="rgba(76, 175, 80, 0.1)" padding={0.5}>
                          SAVE {currency} {convertPrice(tour.oldPrice - tour.price)}
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
                          onClick={() => handleInquireNowClick(tour)}
                        >
                          Inquire Now
                          <SendIcon sx={{ marginLeft: '10px', fontSize: 'inherit' }} />
                        </Button>
                      </Box>
                    </div>
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
          <Box display="flex" justifyContent="center" mt={4}>
            <Button variant="contained" color="primary" onClick={handleNavigate}>
              View More Tours
            </Button>
          </Box>
        </Container>
      </Box>

      <Dialog 
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            width: '35vw',
            borderRadius: '16px',
            overflowX: 'hidden',
          },
        }}>
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
                      ? `${currency} ${selectedTour.price && !isNaN(selectedTour.price) ? convertPrice(selectedTour.price) : ''}`
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
                      {currency} {selectedTour.oldPrice && !isNaN(selectedTour.oldPrice) ? convertPrice(selectedTour.oldPrice) : ''}
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
                      SAVE {currency} {convertPrice(selectedTour.oldPrice-selectedTour.price)}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
              <IconButton onClick={handleCloseDialog}>
                  <CloseIcon />
              </IconButton>
          </Box>
          <DialogContent sx={{ pt: 0 , pb: '0px', px: '16px' }}>
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
              handleSubmitInquiry();
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

      <br /><br />

      <OffersSection />

      <Box bgcolor="#ffffff" padding="40px" mt="30px" minWidth='100vw'>
        <Container>
          <Typography variant="h3" component="div" sx={{ color: '#0A369D', marginBottom: '30px', fontFamily: 'Dancing Script', textAlign: 'center' }}>
            Learn More About HOLIDAY LIFE
          </Typography>
          <Typography variant="body1" color="#4472CA" marginBottom={3} align="justify" fontFamily='Domine' fontSize={17}>
            Holiday Life Travel Agency is committed to delivering top-notch facilities, exceptional travel experiences, and uncompromising safety for every journey. Our curated packages include luxurious accommodations, seamless transportation, and exclusive access to premium attractions, ensuring comfort and convenience throughout your trip. With a team of experienced travel experts, we craft personalized itineraries that cater to your preferences, making each journey unique and memorable. Safety is our utmost priority, with reliable partners, 24/7 assistance, and adherence to global travel standards to ensure peace of mind. With Holiday Life, your travels are enriched with ease, excellence, and assurance at every step.
          </Typography>
          <ImageGal />
          <br /><br />
        </Container>
      </Box>
      <FAQAccordion/>
      <Experience /><br></br><br></br>
      <Footer />
    </div>
  );
};

export default HomeScreen;
