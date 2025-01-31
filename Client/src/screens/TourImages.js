import React, { useState } from 'react';

const TourImages = ({ destinations, activities, hotels, deviceType }) => {
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  // Build your gallery array from the props
  const galleryDetails = [
    {
      title: 'Destinations',
      description: 'Discover breathtaking landscapes, pristine beaches, and captivating cultural landmarks around the globe.',
      images: destinations || [],
    },
    {
      title: 'Activities',
      description: 'Engage in thrilling adventures and immersive experiences—from underwater diving to mountain treks.',
      images: activities || [],
    },
    {
      title: 'Hotels',
      description: 'Stay in luxurious accommodations offering stunning views, world-class amenities, and exceptional hospitality.',
      images: hotels || [],
    },
  ];

  // Track hovered section to show the overlay
  const [hoveredSection, setHoveredSection] = useState(null);

  // For the modal popup
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  const openModal = (index) => {
    setSelectedSection(galleryDetails[index]);
    setIsModalOpen(true);
  };

  const closeModal = (event) => {
    event.stopPropagation();
    setIsModalOpen(false);
  };

  const handleModalClick = (event) => {
    event.stopPropagation(); // so we don’t close if user clicks inside the modal content
  };

  // ----- Inline Styles -----

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
  };

  const sectionItemStyle = {
    position: 'relative',
    width: isMobile? '82vw' :'100%',
    height: isMobile? '20vh': '26.4vh', 
    overflow: 'hidden',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  };
  
  const previewImageStyle = {
    width: '100%',
    height: '100%',            
    objectFit: 'cover',       
    objectPosition: 'center',  
    borderRadius: '10px',
    display: 'block',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  };

  // Base style for the overlay (hidden by default)
  const overlayBaseStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    background: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    padding: '20px',
    opacity: 0,
    transform: 'translateY(50%)',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '0 0 10px 10px', // match bottom rounding
  };

  // The hover style that merges with the base style
  const overlayHoverStyle = {
    opacity: 1,
    transform: 'translateY(0)',
  };

  // Common style for the overlay’s title
  const titleStyle = {
    fontSize: '1.25rem',
    margin: 0,
    fontWeight: 'bold',
  };

  // The “View Images” button on the overlay
  const buttonStyle = {
    backgroundColor: '#007BFF',
    color: '#fff',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  // Modal styles
  const modalStyle = {
    display: isModalOpen ? 'block' : 'none',
    position: 'fixed',
    top: '65px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
    padding: '30px',
  };

  const modalContentStyle = {
    background: 'white',
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '900px',
    maxHeight: '800px',
    margin: 'auto',
    position: 'relative',
    overflowY: 'auto', // so user can scroll if content is tall
  };

  const modalCloseStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '1.5rem',
    color: 'black',
    cursor: 'pointer',
  };

  const modalGalleryGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile? 'repeat(2, 1fr)' :'repeat(3, 1fr)',
    gap: '15px',
    marginTop: '20px',
    maxHeight: '450px',
    overflowY: 'false',
  };

  const modalGalleryImageStyle = {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    transition: 'transform 0.3s ease',
  };

  // ----- Render -----
  return (
    <div style={containerStyle}>
      {galleryDetails.map((section, index) => {
        // Determine the final overlay style (hover or not)
        const computedOverlayStyle =
          hoveredSection === index
            ? { ...overlayBaseStyle, ...overlayHoverStyle }
            : overlayBaseStyle;

        return (
          <div
            key={index}
            style={sectionItemStyle}
            onMouseEnter={() => setHoveredSection(index)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {/* If there is at least one image, display the first as “cover” */}
            {section.images.length > 0 && (
              <img
                src={section.images[0]}
                alt={`Cover for ${section.title}`}
                style={previewImageStyle}
              />
            )}

            {/* Hover overlay with only the title and button at the bottom */}
            <div style={computedOverlayStyle}>
              <h3 style={titleStyle}>{section.title}</h3>
              <button style={buttonStyle} onClick={() => openModal(index)}>
                View Images
              </button>
            </div>
          </div>
        );
      })}

      {/* Modal */}
      {isModalOpen && selectedSection && (
        <div style={modalStyle} onClick={closeModal}>
          <div style={modalContentStyle} onClick={handleModalClick}>
            <span style={modalCloseStyle} onClick={closeModal}>
              &times;
            </span>
            <h2
              style={{
                textAlign: 'center',
                fontSize: '1.75rem',
                marginBottom: '1rem',
              }}
            >
              {selectedSection.title}
            </h2>
            <p
              style={{
                textAlign: 'center',
                fontSize: '1rem',
                color: '#374151',
                marginBottom: '1.5rem',
              }}
            >
              {selectedSection.description}
            </p>

            <div style={modalGalleryGridStyle}>
              {selectedSection.images.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`Scenic view of ${selectedSection.title} ${idx + 1}`}
                  loading="lazy"
                  style={modalGalleryImageStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourImages;

