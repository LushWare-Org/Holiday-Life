import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";

const AllTours = () => {
  const [tours, setTours] = useState([]);
  const [editTour, setEditTour] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    nights: "",
    expiry_date: "",
    country: "",
    markets: [],
    itinerary: {},
    itineraryImages: {},
    itineraryTitles: {},
    tour_image: [],
    destination_images: [],
    activity_images: [],
    hotel_images: [],
    inclusions: "",
    exclusions: "",
    tour_summary: "",
    oldPrice: "",
  });

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get("/tours");
        setTours(response.data);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchTours();
  }, []);

  const handleEditOpen = (tour) => {
    const formatDate = (date) => {
      const d = new Date(date);
      const month = `0${d.getMonth() + 1}`.slice(-2);
      const day = `0${d.getDate()}`.slice(-2);
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
    };

    setEditTour(tour);
    setFormData({
      title: tour.title,
      price: tour.price,
      nights: tour.nights,
      expiry_date: formatDate(tour.expiry_date),
      country: tour.country,
      markets: tour.markets || [] ,
      itinerary: tour.itinerary || {},
      itineraryImages: tour.itinerary_images || {},
      itineraryTitles: tour.itinerary_titles || {},
      tour_image: Array.isArray(tour.tour_image) ? tour.tour_image : [tour.tour_image],
      destination_images: tour.destination_images || [],
      activity_images: tour.activity_images || [],
      hotel_images: tour.hotel_images || [],
      inclusions: tour.inclusions.join("\n"),
      exclusions: tour.exclusions.join("\n"),
      tour_summary: tour.tour_summary,
      oldPrice: tour.oldPrice || "",
    });
  };

  const handleEditClose = () => {
    setEditTour(null);
    setFormData({
      title: "",
      price: "",
      nights: "",
      expiry_date: "",
      country: "",
      markets: [],
      itinerary: {},
      itineraryImages: {},
      itineraryTitles: {},
      tour_image: [],
      destination_images: [],
      activity_images: [],
      hotel_images: [],
      inclusions: "",
      exclusions: "",
      tour_summary: "",
      oldPrice: "",
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleItineraryChange = (e, dayKey) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      itinerary: {
        ...prevData.itinerary,
        [dayKey]: value,
      },
    }));
  };

  const handleItineraryTitleChange = (e, dayKey) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      itineraryTitles: {
        ...prevData.itineraryTitles,
        [dayKey]: value,
      },
    }));
  };

  const handleImageUpload = async (e, fieldName, dayKey) => {
    const files = Array.from(e.target.files);
  
    for (const file of files) {
      // 1) Create a temporary preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
  
      // 2) Put that preview into state so the user sees something right away
      if (dayKey) {
        setFormData((prevData) => ({
          ...prevData,
          itineraryImages: {
            ...prevData.itineraryImages,
            [dayKey]: [...prevData.itineraryImages[dayKey], previewUrl],
          },
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: [...prevData[fieldName], previewUrl],
        }));
      }
  
      // 3) Actually upload to imgbb
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('image', file);
  
        const response = await fetch(
          'https://api.imgbb.com/1/upload?key=4e08e03047ee0d48610586ad270e2b39',
          {
            method: 'POST',
            body: formDataToSend,
          }
        );
  
        if (!response.ok) {
          throw new Error(`Failed to upload image: ${response.statusText}`);
        }
  
        const data = await response.json();
        const finalUrl = data.data.url; // The permanent URL from imgbb
  
        // 4) Replace the temporary preview with the permanent imgbb URL
        if (dayKey) {
          setFormData((prevData) => ({
            ...prevData,
            itineraryImages: {
              ...prevData.itineraryImages,
              [dayKey]: prevData.itineraryImages[dayKey].map((url) =>
                url === previewUrl ? finalUrl : url
              ),
            },
          }));
        } else {
          setFormData((prevData) => ({
            ...prevData,
            [fieldName]: prevData[fieldName].map((url) =>
              url === previewUrl ? finalUrl : url
            ),
          }));
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const marketMapping = {
    1: 'Indian',
    2: 'Chinese',
    3: 'Asian',
    4: 'Middle East',
    5: 'Russia and CIS',
    6: 'All'
  };
  

  const handleRemoveImage = (fieldName, index, dayKey) => {
    if (dayKey) {
      setFormData((prevData) => ({
        ...prevData,
        itineraryImages: {
          ...prevData.itineraryImages,
          [dayKey]: prevData.itineraryImages[dayKey].filter((_, i) => i !== index),
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: prevData[fieldName].filter((_, i) => i !== index),
      }));
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        title: formData.title,
        price: formData.price,
        nights: formData.nights,
        expiry_date: formData.expiry_date,
        country: formData.country,
        markets: formData.markets,  
        tour_summary: formData.tour_summary,
        tour_image: formData.tour_image[0],
        destination_images: formData.destination_images,
        activity_images: formData.activity_images,
        hotel_images: formData.hotel_images,
        inclusions: formData.inclusions.split('\n'),
        exclusions: formData.exclusions.split('\n'),
        itinerary: formData.itinerary,
        itinerary_images: formData.itineraryImages,
        itinerary_titles: formData.itineraryTitles,
        oldPrice: formData.oldPrice,
      };

      const response = await axios.put(`/tours/${editTour._id}`, payload);

      if (response.status === 200) {
        Swal.fire("Success!", "Tour has been updated successfully.", "success");
        setTours((prevTours) =>
          prevTours.map((tour) =>
            tour._id === editTour._id ? response.data : tour
          )
        );
        setEditTour(null);
      } else {
        throw new Error("Failed to update the tour.");
      }
    } catch (error) {
      console.error("Error updating tour:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      // Show confirmation dialog before deleting
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });
  
      // If user clicks 'Yes, delete it!'
      if (result.isConfirmed) {
        const response = await axios.delete(`/tours/${id}`);
        if (response.status === 200) {
          // Update the UI by filtering out the deleted tour
          setTours(tours.filter((tour) => tour._id !== id));
  
          // Show success message
          Swal.fire("Deleted!", "Tour has been deleted.", "success");
        } else {
          throw new Error("Failed to delete the tour.");
        }
      } else {
        
      }
    } catch (error) {
      console.error("Error deleting tour:", error);
  
      // Show error message
      Swal.fire("Error", error.message, "error");
    }
  };
  

  return (
    <div className="bg-white min-h-screen p-0">
      <h1 className="text-5xl font-bold text-center mb-8">All Tours (Admin Pannel)</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <div key={tour._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105">
            <img src={tour.tour_image} alt={tour.title} className="h-72 w-full object-cover" />
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold">{tour.title}</h3>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 min-w-48 rounded hover:bg-blue-600"
                  onClick={() => handleEditOpen(tour)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleDelete(tour._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editTour && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="relative w-full max-w-3xl bg-white rounded-lg p-8 shadow-xl transform transition-all scale-100 mt-20">
            <button
              onClick={handleEditClose}
              className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Edit Tour Details</h2>
            <div className="overflow-y-auto max-h-[60vh] space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-0">Tour Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-0">Price (USD)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-0">Expiry Date</label>
                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-0">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-0">Markets</label>
                <div className="mt-1 p-2 w-full border border-gray-300 rounded-md">
                  {Object.entries(marketMapping).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        name="markets"
                        value={key}
                        checked={formData.markets.includes(Number(key))}
                        onChange={(e) => {
                          const { checked, value } = e.target;
                          setFormData((prevData) => ({
                            ...prevData,
                            markets: checked
                              ? [...prevData.markets, value]
                              : prevData.markets.filter((market) => market !== value),
                          }));
                        }}
                      />
                      <label>{value}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-0">Tour Summary</label>
                <textarea
                  name="tour_summary"
                  value={formData.tour_summary}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Tour summary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-0">Tour Image</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageUpload(e, "tour_image")}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
                <div className="flex space-x-2 mt-4">
                  {formData.tour_image.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Tour Image ${index}`}
                        className="w-48 h-48 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("tour_image", index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-0">Destination Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageUpload(e, "destination_images")}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
                <div className="flex space-x-2 mt-4">
                  {formData.destination_images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Destination Image ${index}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("destination_images", index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-0">Activity Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageUpload(e, "activity_images")}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
                <div className="flex space-x-2 mt-4">
                  {formData.activity_images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Activity Image ${index}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("activity_images", index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
                  
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-0">Hotel Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageUpload(e, "hotel_images")}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
                <div className="flex space-x-2 mt-4">
                  {formData.hotel_images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Hotel Image ${index}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("hotel_images", index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-0">Nights</label>
                <input
                  type="number"
                  name="nights"
                  min="0"
                  value={formData.nights}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-0">Itinerary</label>
                <div className="space-y-6">
                  {Object.keys(formData.itinerary).map((dayKey, index) => (
                    <div key={index} className="space-y-4 border p-4 rounded-md bg-gray-100">
                      <span className="bg-blue-500/70 text-white px-6 py-2 rounded-lg">
                        {`Day ${index + 1}`}
                      </span>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-0">Title</label>
                        <input
                          type="text"
                          onChange={(e) => handleItineraryTitleChange(e, dayKey)}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                          placeholder={`Title for ${dayKey}`}
                          value={formData.itineraryTitles[dayKey]}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-0">Activities</label>
                        <textarea
                          rows="2"
                          placeholder={`Activities for ${dayKey} and use ENTER key for each activity`}
                          value={formData.itinerary[dayKey]}
                          onChange={(e) => handleItineraryChange(e, dayKey)}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-0">Images</label>
                        <input
                          type="file"
                          onChange={(e) => handleImageUpload(e, "", dayKey)}
                          multiple
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                        <div className="flex space-x-2 mt-4">
                          {formData.itineraryImages[dayKey] && formData.itineraryImages[dayKey].map((image, idx) => (
                            <div key={idx} className="relative">
                              <img
                                src={image}
                                alt={`Day ${index + 1} Image ${idx}`}
                                className="w-24 h-24 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage("", idx, dayKey)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-0">Inclusions</label>
                <textarea
                  name="inclusions"
                  value={formData.inclusions}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="List of inclusions and use ENTER key for each activity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-0">Exclusions</label>
                <textarea
                  name="exclusions"
                  value={formData.exclusions}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="List of exclusions and use ENTER key for each activity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-0">Old Price</label>
                <input
                  type="text"
                  name="oldPrice"
                  value={formData.oldPrice}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-center mt-5">
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTours;
