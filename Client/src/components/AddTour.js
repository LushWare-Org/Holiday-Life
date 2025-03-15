import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";

const marketMapping = {
  1: "Indian Market",
  2: "Chinese Market",
  3: "Asian Markets",
  4: "Middle East Markets",
  5: "Russia and CIS Markets",
  6: "All Markets",
};

const foodCategoryMapping = {
  0: "Half Board",
  1: "Full Board",
  2: "All Inclusive",
};

const TourForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    // Base nights used for itinerary generation. It will also serve as the key for nights options.
    nights: "",
    expiry_date: "",
    valid_from: "",
    valid_to: "",
    food_category: {
      0: [0, 0],
      1: [0, 0],
      2: [0, 0],
    },
    country: "",
    markets: [],
    tour_summary: "",
    oldPrice: "",
    inclusions: "",
    exclusions: "",
    // New field: facilities (entered one per line)
    facilities: "",
    tour_image: [],
    destination_images: [],
    activity_images: [],
    hotel_images: [],
    // Itinerary structure is now split into arrival (first_day), dynamic middle_days, and departure (last_day)
    itinerary: {
      first_day: "",
      middle_days: {},
      last_day: "",
    },
    itineraryImages: {
      first_day: [],
      middle_days: {},
      last_day: [],
    },
    itineraryTitles: {
      first_day: "",
      middle_days: {},
      last_day: "",
    },
    // New field: nightsOptions is an object mapping the base nights (as a key) to an array of option objects.
    nightsOptions: {},
  });

  // Local state for adding a new nights option.
  const [nightsOptionForm, setNightsOptionForm] = useState({
    option: "",
    add_price: "",
    old_add_price: ""
  });

  const [showItinerary, setShowItinerary] = useState(false);
  const [isItinerarySubmitted, setIsItinerarySubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // When the base nights change, dynamically generate the itinerary fields.
  useEffect(() => {
    const nightsNumber = parseInt(formData.nights);
    if (!nightsNumber) return;
    // Total days = nights + 1 (arrival + nights)
    const totalDays = nightsNumber + 1;
    const newItinerary = {
      first_day: formData.itinerary.first_day || "",
      middle_days: {},
      last_day: formData.itinerary.last_day || "",
    };
    const newItineraryImages = {
      first_day: formData.itineraryImages.first_day || [],
      middle_days: {},
      last_day: formData.itineraryImages.last_day || [],
    };
    const newItineraryTitles = {
      first_day: formData.itineraryTitles.first_day || "Arrival Day Title",
      middle_days: {},
      last_day: formData.itineraryTitles.last_day || "Departure Day Title",
    };

    if (totalDays > 2) {
      // For example, if totalDays is 5 (4 nights), generate middle days for Day 2, 3, and 4.
      for (let i = 2; i < totalDays; i++) {
        newItinerary.middle_days[`day_${i}`] =
          formData.itinerary.middle_days?.[`day_${i}`] || "";
        newItineraryImages.middle_days[`day_${i}`] =
          formData.itineraryImages.middle_days?.[`day_${i}`] || [];
        newItineraryTitles.middle_days[`day_${i}`] =
          formData.itineraryTitles.middle_days?.[`day_${i}`] || `Day ${i} Title`;
      }
    }
    setFormData((prevData) => ({
      ...prevData,
      itinerary: newItinerary,
      itineraryImages: newItineraryImages,
      itineraryTitles: newItineraryTitles,
    }));
  }, [formData.nights]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Update itinerary text for a section (first_day, last_day, or middle_days).
  const handleItineraryChange = (e, section, dayKey = null) => {
    const value = e.target.value;
    if (section === "middle_days" && dayKey) {
      setFormData((prevData) => ({
        ...prevData,
        itinerary: {
          ...prevData.itinerary,
          middle_days: {
            ...prevData.itinerary.middle_days,
            [dayKey]: value,
          },
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        itinerary: {
          ...prevData.itinerary,
          [section]: value,
        },
      }));
    }
  };

  // Update itinerary title for each section.
  const handleItineraryTitleChange = (e, section, dayKey = null) => {
    const value = e.target.value;
    if (section === "middle_days" && dayKey) {
      setFormData((prevData) => ({
        ...prevData,
        itineraryTitles: {
          ...prevData.itineraryTitles,
          middle_days: {
            ...prevData.itineraryTitles.middle_days,
            [dayKey]: value,
          },
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        itineraryTitles: {
          ...prevData.itineraryTitles,
          [section]: value,
        },
      }));
    }
  };

  const handleImageUpload = async (e, key, section) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const formDataImage = new FormData();
      formDataImage.append("image", file);
      const loadingUrl = URL.createObjectURL(file);
  
      if (section === "middle_days" && key) {
        setFormData((prevData) => ({
          ...prevData,
          itineraryImages: {
            ...prevData.itineraryImages,
            middle_days: {
              ...prevData.itineraryImages.middle_days,
              [key]: [
                // //// CHANGED: Ensure previous value is an array; fallback to [] if not.
                ...(Array.isArray(prevData.itineraryImages.middle_days[key])
                  ? prevData.itineraryImages.middle_days[key]
                  : []),
                loadingUrl,
              ],
            },
          },
        }));
      } else if (
        section === "tour_image" ||
        section === "destination_images" ||
        section === "activity_images" ||
        section === "hotel_images"
      ) {
        setFormData((prevData) => ({
          ...prevData,
          [section]: [
            // //// CHANGED: Ensure previous value is an array; fallback to [] if not.
            ...(Array.isArray(prevData[section]) ? prevData[section] : []),
            loadingUrl,
          ],
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          itineraryImages: {
            ...prevData.itineraryImages,
            [key]: [
              // //// CHANGED: Ensure previous value is an array; fallback to [] if not.
              ...(Array.isArray(prevData.itineraryImages[key])
                ? prevData.itineraryImages[key]
                : []),
              loadingUrl,
            ],
          },
        }));
      }
  
      try {
        const response = await fetch(
          "https://api.imgbb.com/1/upload?key=4e08e03047ee0d48610586ad270e2b39",
          {
            method: "POST",
            body: formDataImage,
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to upload image: ${response.statusText}`);
        }
        const data = await response.json();
        const uploadedUrl = data.data.url;
        if (section === "middle_days" && key) {
          setFormData((prevData) => ({
            ...prevData,
            itineraryImages: {
              ...prevData.itineraryImages,
              middle_days: {
                ...prevData.itineraryImages.middle_days,
                [key]: (Array.isArray(prevData.itineraryImages.middle_days[key])
                  ? prevData.itineraryImages.middle_days[key]
                  : []).map((url) =>
                  url === loadingUrl ? uploadedUrl : url
                ),
              },
            },
          }));
        } else if (
          section === "tour_images" ||
          section === "destination_images" ||
          section === "activity_images" ||
          section === "hotel_images"
        ) {
          setFormData((prevData) => ({
            ...prevData,
            [section]: (Array.isArray(prevData[section])
              ? prevData[section]
              : []).map((url) =>
              url === loadingUrl ? uploadedUrl : url
            ),
          }));
        } else {
          setFormData((prevData) => ({
            ...prevData,
            itineraryImages: {
              ...prevData.itineraryImages,
              [key]: (Array.isArray(prevData.itineraryImages[key])
                ? prevData.itineraryImages[key]
                : []).map((url) =>
                url === loadingUrl ? uploadedUrl : url
              ),
            },
          }));
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleRemoveImage = (key, index, section) => {
    if (section === "middle_days") {
      // //// ADDED: Remove image from the middle_days object in itineraryImages.
      setFormData((prevData) => ({
        ...prevData,
        itineraryImages: {
          ...prevData.itineraryImages,
          middle_days: {
            ...prevData.itineraryImages.middle_days,
            [key]: Array.isArray(prevData.itineraryImages.middle_days[key])
              ? prevData.itineraryImages.middle_days[key].filter((_, i) => i !== index)
              : []
          }
        }
      }));
    } else if (
      section === "tour_images" ||
      section === "destination_images" ||
      section === "activity_images" ||
      section === "hotel_images"
    ) {
      // //// ADDED: Remove image from standard image arrays.
      setFormData((prevData) => ({
        ...prevData,
        [section]: Array.isArray(prevData[section])
          ? prevData[section].filter((_, i) => i !== index)
          : []
      }));
    } else {
      // //// ADDED: Remove image from itineraryImages for sections like "first_day" or "last_day".
      setFormData((prevData) => ({
        ...prevData,
        itineraryImages: {
          ...prevData.itineraryImages,
          [key]: Array.isArray(prevData.itineraryImages[key])
            ? prevData.itineraryImages[key].filter((_, i) => i !== index)
            : []
        }
      }));
    }
  };

  const handleFoodCategoryChange = (catKey, index, val) => {
    const parsedVal = parseInt(val, 10) || 0;
    setFormData((prev) => {
      // //// CHANGED: Use array notation.
      const oldArray = prev.food_category[catKey] || [0, 0];
      const newArray = [...oldArray];
      newArray[index] = parsedVal;
      return {
        ...prev,
        food_category: {
          ...prev.food_category,
          [catKey]: newArray,
        },
      };
    });
  };

  // Handling input changes for the new nights option form.
  const handleNightsOptionInputChange = (e) => {
    setNightsOptionForm({
      ...nightsOptionForm,
      [e.target.name]: e.target.value,
    });
  };

  // Add a new nights option for the current base nights.
  const addNightsOption = () => {
    if (!formData.nights) {
      Swal.fire("Error", "Please enter the number of nights first.", "error");
      return;
    }
    const key = formData.nights.toString();
    const newOption = { ...nightsOptionForm };
    if (!newOption.option || !newOption.add_price || !newOption.old_add_price) {
      Swal.fire("Error", "Please fill in all fields for the nights option.", "error");
      return;
    }
    setFormData((prevData) => {
      const currentOptions = prevData.nightsOptions[key] || [];
      return {
        ...prevData,
        nightsOptions: {
          ...prevData.nightsOptions,
          [key]: [...currentOptions, newOption],
        },
      };
    });
    // Reset the nights option form.
    setNightsOptionForm({
      option: "",
      add_price: "",
      old_add_price: ""
    });
  };

  // Remove a nights option.
  const removeNightsOption = (nightsKey, index) => {
    setFormData((prevData) => ({
      ...prevData,
      nightsOptions: {
        ...prevData.nightsOptions,
        [nightsKey]: prevData.nightsOptions[nightsKey].filter((_, i) => i !== index),
      },
    }));
  };

  // Validate all required fields.
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.title) {
      newErrors.title = "Tour title is required.";
      isValid = false;
    }
    if (!formData.price) {
      newErrors.price = "Price is required.";
      isValid = false;
    }
    if (!formData.nights || formData.nights <= 0) {
      newErrors.nights = "Number of nights is required.";
      isValid = false;
    }
    if (!formData.tour_summary) {
      newErrors.tour_summary = "Tour summary is required.";
      isValid = false;
    }
    if (formData.tour_image.length === 0) {
      newErrors.tour_image = "At least one tour image is required.";
      isValid = false;
    }
    // Validate itinerary: arrival and departure are required.
    if (!formData.itinerary.first_day) {
      newErrors.first_day = "Arrival day itinerary is required.";
      isValid = false;
    }
    if (!formData.itinerary.last_day) {
      newErrors.last_day = "Departure day itinerary is required.";
      isValid = false;
    }
    Object.keys(formData.itinerary.middle_days).forEach((dayKey) => {
      if (!formData.itinerary.middle_days[dayKey]) {
        newErrors[dayKey] = `Itinerary for ${dayKey} is required.`;
        isValid = false;
      }
    });
    // Validate nights options: at least one option must be added.
    if (
      formData.nights &&
      (!formData.nightsOptions[formData.nights.toString()] ||
        formData.nightsOptions[formData.nights.toString()].length === 0)
    ) {
      newErrors.nightsOptions = "Please add at least one nights option.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmitItinerary = () => {
    if (validateForm()) {
      setShowItinerary(true);
      setIsItinerarySubmitted(true);
      Swal.fire("Itinerary Submitted!", "Itinerary section submitted successfully.", "success");
    } else {
      Swal.fire("Error", "Please fill out all required fields.", "error");
    }
  };

  const handleResetItinerary = () => {
    setFormData({
      title: "",
      price: "",
      nights: "",
      expiry_date: "",
      valid_from: "",
      valid_to: "",
      food_category: {
        0: [0, 0],
        1: [0, 0],
        2: [0, 0],
      },
      country: "",
      markets: [],
      tour_summary: "",
      oldPrice: "",
      inclusions: "",
      exclusions: "",
      facilities: "",
      tour_image: [],
      destination_images: [],
      activity_images: [],
      hotel_images: [],
      itinerary: {
        first_day: "",
        middle_days: {},
        last_day: "",
      },
      itineraryImages: {
        first_day: [],
        middle_days: {},
        last_day: [],
      },
      itineraryTitles: {
        first_day: "",
        middle_days: {},
        last_day: "",
      },
      nightsOptions: {},
    });
    setShowItinerary(false);
    setErrors({});
    setIsItinerarySubmitted(false);
  };

  const handleSubmitTour = async () => {
    if (validateForm()) {
      try {
        const payload = {
          title: formData.title,
          price: formData.price,
          // The nights field now contains the nights options object.
          nights: formData.nightsOptions,
          expiry_date: formData.expiry_date,
          valid_from: formData.valid_from,
          valid_to: formData.valid_to,
          food_category: formData.food_category,
          country: formData.country,
          markets: formData.markets,
          tour_summary: formData.tour_summary,
          tour_image: formData.tour_image[0],
          destination_images: formData.destination_images,
          activity_images: formData.activity_images,
          hotel_images: formData.hotel_images,
          inclusions: formData.inclusions.split("\n"),
          exclusions: formData.exclusions.split("\n"),
          facilities: formData.facilities.split("\n"),
          itinerary: formData.itinerary,
          itinerary_images: formData.itineraryImages,
          itinerary_titles: formData.itineraryTitles,
          oldPrice: formData.oldPrice,
        };

        const response = await fetch("/tours", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          Swal.fire("Success!", "Tour has been created successfully.", "success");
          handleResetItinerary();
        } else {
          const errorData = await response.json();
          console.error("Response error:", errorData);
          throw new Error(errorData.message || "Failed to create the tour.");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", error.message, "error");
      }
    } else {
      Swal.fire("Error", "Please fill out all required fields.", "error");
    }
  };

  return (
    <div className="bg-white min-h-screen p-0">
      <h2 className="text-5xl font-bold text-center mb-8">Add New Tour</h2>

      <div className="space-y-6">
        {/* Tour Title */}
        <div>
          <label className="block text-lg font-medium">Tour Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-lg font-medium">Price (USD)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Expiry Date */}
          <div>
            <label className="block text-lg font-medium">Expiry Date</label>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleInputChange}
              className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          {/* Valid From */}
          <div>
            <label className="block text-lg font-medium">Valid From</label>
            <input
              type="date"
              name="valid_from"
              value={formData.valid_from}
              onChange={handleInputChange}
              className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          {/* Valid To */}
          <div>
            <label className="block text-lg font-medium">Valid To</label>
            <input
              type="date"
              name="valid_to"
              value={formData.valid_to}
              onChange={handleInputChange}
              className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        {/* Food Category Pricing */}
        <div>
          <label className="block text-lg font-medium">Food Category Pricing</label>
          {Object.entries(foodCategoryMapping).map(([key, label]) => (
            <div key={key} className="border p-4 rounded-md my-2">
              <h4 className="font-bold">{label}</h4>
              <div className="flex space-x-4 mt-2">
                <div>
                  <label className="block text-sm">Add Price</label>
                  <input
                    type="number"
                    name={`food_category_${key}_add_price`}
                    // //// CHANGED: Access first element of the array instead of object property.
                    value={formData.food_category[key]?.[0] || ""}
                    onChange={(e) =>
                      handleFoodCategoryChange(key, 0, e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm">Old Add Price</label>
                  <input
                    type="number"
                    name={`food_category_${key}_old_add_price`}
                    // //// CHANGED: Access second element of the array instead of object property.
                    value={formData.food_category[key]?.[1] || ""}
                    onChange={(e) =>
                      handleFoodCategoryChange(key, 1, e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Country */}
        <div>
          <label className="block text-lg font-medium">Country</label>
          <textarea
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Country"
          />
        </div>

        {/* Markets */}
        <div>
          <label className="block text-lg font-medium">Markets</label>
          <div className="mt-1 p-2 w-full border border-gray-300 rounded-md">
            {Object.entries(marketMapping).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  name="markets"
                  value={key}
                  checked={formData.markets.includes(Number(key))}
                  onChange={(e) => {
                    const numericValue = Number(e.target.value);
                    setFormData((prevData) => ({
                      ...prevData,
                      markets: e.target.checked
                        ? [...prevData.markets, numericValue]
                        : prevData.markets.filter((m) => m !== numericValue),
                    }));
                  }}
                />
                <label>{value}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Tour Summary */}
        <div>
          <label className="block text-lg font-medium">Tour Summary</label>
          <textarea
            name="tour_summary"
            value={formData.tour_summary}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Tour summary"
          />
          {errors.tour_summary && <p className="text-red-500 text-sm">{errors.tour_summary}</p>}
        </div>

        {/* Tour Image Section */}
        <div>
          <label className="block text-lg font-medium">Tour Image</label>
          <input
            type="file"
            multiple
            onChange={(e) => handleImageUpload(e, "tour_image", "tour_image")}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
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
                  onClick={() =>
                    setFormData((prevData) => ({
                      ...prevData,
                      tour_image: prevData.tour_image.filter((_, i) => i !== index),
                    }))
                  }
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Destination Images */}
        <div>
          <label className="block text-lg font-medium">Destination Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => handleImageUpload(e, "destination_images", "destination_images")}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
          />
          <div className="flex space-x-2 mt-4">
            {formData.destination_images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Destination Image ${index}`}
                  className="w-48 h-48 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prevData) => ({
                      ...prevData,
                      destination_images: prevData.destination_images.filter((_, i) => i !== index),
                    }))
                  }
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Images */}
        <div>
          <label className="block text-lg font-medium">Activity Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => handleImageUpload(e, "activity_images", "activity_images")}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
          />
          <div className="flex space-x-2 mt-4">
            {formData.activity_images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Activity Image ${index}`}
                  className="w-48 h-48 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prevData) => ({
                      ...prevData,
                      activity_images: prevData.activity_images.filter((_, i) => i !== index),
                    }))
                  }
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>  
        </div>

        {/* Hotel Images */}
        <div>
          <label className="block text-lg font-medium">Hotel Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => handleImageUpload(e, "hotel_images", "hotel_images")}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
          />
          <div className="flex space-x-2 mt-4">
            {formData.hotel_images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Hotel Image ${index}`}
                  className="w-48 h-48 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prevData) => ({
                      ...prevData,
                      hotel_images: prevData.hotel_images.filter((_, i) => i !== index),
                    }))
                  }
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Nights */}
        <div>
          <label className="block text-lg font-medium">Nights</label>
          <input
            type="number"
            name="nights"
            min="0"
            value={formData.nights}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            required
          />
          {errors.nights && <p className="text-red-500 text-sm">{errors.nights}</p>}
          <p className="mt-0 text-sm text-gray-500">
            Enter the number of nights to generate the itinerary section.
          </p>
        </div>

        {/* Nights Options Section */}
        <div className="border p-4 rounded-md bg-gray-50">
          <h3 className="text-xl font-bold mb-4">Nights Options (Add-on Pricing)</h3>
          {errors.nightsOptions && <p className="text-red-500 text-sm">{errors.nightsOptions}</p>}
          {formData.nights ? (
            <div>
              <p className="mb-2">Adding options for {formData.nights} nights:</p>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    name="option"
                    value={nightsOptionForm.option}
                    onChange={handleNightsOptionInputChange}
                    placeholder="Option description"
                    className="p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    name="add_price"
                    value={nightsOptionForm.add_price}
                    onChange={handleNightsOptionInputChange}
                    placeholder="Add Price"
                    className="p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    name="old_add_price"
                    value={nightsOptionForm.old_add_price}
                    onChange={handleNightsOptionInputChange}
                    placeholder="Old Add Price"
                    className="p-2 border border-gray-300 rounded-md"
                  />
                  <button onClick={addNightsOption} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Add Option
                  </button>
                </div>
              </div>
              {formData.nightsOptions[formData.nights.toString()] && (
                <div className="mt-4">
                  <h4 className="font-bold">Current Options:</h4>
                  <ul>
                    {formData.nightsOptions[formData.nights.toString()].map((opt, idx) => (
                      <li key={idx} className="flex justify-between items-center border p-2 rounded-md my-1">
                        <span>
                          {opt.option} - Add Price: {opt.add_price}, Old Add Price: {opt.old_add_price}
                        </span>
                        <button onClick={() => removeNightsOption(formData.nights.toString(), idx)} className="bg-red-500 text-white px-2 py-1 rounded">
                          <FaTrash />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p>Please enter the number of nights above to add options.</p>
          )}
        </div>

        {/* Facilities */}
        <div>
          <label className="block text-lg font-medium">Facilities</label>
          <textarea
            name="facilities"
            value={formData.facilities}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter facilities, one per line"
          />
        </div>

        {/* Itinerary Section */}
        {!showItinerary ? (
          <div>
            <label className="block text-lg font-medium">Itinerary</label>
            <div className="space-y-6">
              {/* Arrival Day */}
              <div className="border p-4 rounded-md bg-blue-100">
                <span className="bg-blue-500 text-white px-6 py-2 rounded-lg">Arrival Day</span>
                <div>
                  <input
                    type="text"
                    value={formData.itineraryTitles.first_day}
                    onChange={(e) => handleItineraryTitleChange(e, "first_day")}
                    placeholder="Title for Arrival Day"
                    className="p-2 w-full border border-gray-300 rounded-md"
                  />
                </div>
                <textarea
                  rows="2"
                  placeholder="Activities for Arrival Day (use ENTER for each activity)"
                  value={formData.itinerary.first_day}
                  onChange={(e) => handleItineraryChange(e, "first_day")}
                  className="p-2 w-full border border-gray-300 rounded-md"
                />
                <div className="space-x-2 mt-4">
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(e, "first_day", "first_day")}
                    multiple
                    className="p-2 w-full border border-gray-300 rounded-md"
                  />
                  <div className="flex space-x-2 mt-4">
                    {formData.itineraryImages.first_day.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Arrival Day Image ${index}`}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage("first_day", index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Days */}
              {Object.keys(formData.itinerary.middle_days).length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold">Middle Days</h3>
                  {Object.keys(formData.itinerary.middle_days).map((dayKey) => (
                    <div key={dayKey} className="border p-4 rounded-md bg-blue-100 my-4">
                      <span className="bg-blue-500 text-white px-6 py-2 rounded-lg">
                        {`Day ${dayKey.split("_")[1]}`}
                      </span>
                      <div>
                        <input
                          type="text"
                          value={formData.itineraryTitles.middle_days[dayKey]}
                          onChange={(e) => handleItineraryTitleChange(e, "middle_days", dayKey)}
                          placeholder={`Title for Day ${dayKey.split("_")[1]}`}
                          className="p-2 w-full border border-gray-300 rounded-md"
                        />
                      </div>
                      <textarea
                        rows="2"
                        placeholder={`Activities for Day ${dayKey.split("_")[1]} (use ENTER for each activity)`}
                        value={formData.itinerary.middle_days[dayKey]}
                        onChange={(e) => handleItineraryChange(e, "middle_days", dayKey)}
                        className="p-2 w-full border border-gray-300 rounded-md"
                      />
                      <div className="space-x-2 mt-4">
                        <input
                          type="file"
                          onChange={(e) => handleImageUpload(e, dayKey, "middle_days")}
                          multiple
                          className="p-2 w-full border border-gray-300 rounded-md"
                        />
                        <div className="flex space-x-2 mt-4">
                          {formData.itineraryImages.middle_days[dayKey]?.map((image, idx) => (
                            <div key={idx} className="relative">
                              <img
                                src={image}
                                alt={`Day ${dayKey.split("_")[1]} Image ${idx}`}
                                className="w-24 h-24 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(dayKey, idx, "middle_days")}
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
              )}

              {/* Departure Day */}
              <div className="border p-4 rounded-md bg-blue-100">
                <span className="bg-blue-500 text-white px-6 py-2 rounded-lg">Departure Day</span>
                <div>
                  <input
                    type="text"
                    value={formData.itineraryTitles.last_day}
                    onChange={(e) => handleItineraryTitleChange(e, "last_day")}
                    placeholder="Title for Departure Day"
                    className="p-2 w-full border border-gray-300 rounded-md"
                  />
                </div>
                <textarea
                  rows="2"
                  placeholder="Activities for Departure Day (use ENTER for each activity)"
                  value={formData.itinerary.last_day}
                  onChange={(e) => handleItineraryChange(e, "last_day")}
                  className="p-2 w-full border border-gray-300 rounded-md"
                />
                <div className="space-x-2 mt-4">
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(e, "last_day", "last_day")}
                    multiple
                    className="p-2 w-full border border-gray-300 rounded-md"
                  />
                  <div className="flex space-x-2 mt-4">
                    {formData.itineraryImages.last_day.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Departure Day Image ${index}`}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage("last_day", index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Itinerary Submit and Reset */}
            <div className="flex justify-between mt-4">
              <button onClick={handleSubmitItinerary} className="bg-blue-500 text-white px-6 py-2 rounded-lg">
                Submit Itinerary
              </button>
              <button onClick={handleResetItinerary} className="bg-gray-500 text-white px-6 py-2 rounded-lg">
                Reset
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-center mt-6">Itinerary Details</h3>
            <div className="space-y-6">
              {/* Display Arrival Day */}
              <div className="border p-4 rounded-md bg-blue-100">
                <h4 className="bg-blue-500 text-white px-6 py-2 rounded-lg">Arrival Day</h4>
                <p className="font-bold">{formData.itineraryTitles.first_day}</p>
                <p>{formData.itinerary.first_day}</p>
                <div className="flex space-x-2">
                  {formData.itineraryImages.first_day.map((image, index) => (
                    <img key={index} src={image} alt={`Arrival Day Image ${index}`} className="w-24 h-24 object-cover rounded" />
                  ))}
                </div>
              </div>
              {/* Display Middle Days */}
              {Object.keys(formData.itinerary.middle_days).map((dayKey) => (
                <div key={dayKey} className="border p-4 rounded-md bg-blue-100">
                  <h4 className="bg-blue-500 text-white px-6 py-2 rounded-lg">{`Day ${dayKey.split("_")[1]}`}</h4>
                  <p className="font-bold">{formData.itineraryTitles.middle_days[dayKey]}</p>
                  <p>{formData.itinerary.middle_days[dayKey]}</p>
                  <div className="flex space-x-2">
                    {formData.itineraryImages.middle_days[dayKey]?.map((image, idx) => (
                      <img key={idx} src={image} alt={`Day ${dayKey.split("_")[1]} Image ${idx}`} className="w-24 h-24 object-cover rounded" />
                    ))}
                  </div>
                </div>
              ))}
              {/* Display Departure Day */}
              <div className="border p-4 rounded-md bg-blue-100">
                <h4 className="bg-blue-500 text-white px-6 py-2 rounded-lg">Departure Day</h4>
                <p className="font-bold">{formData.itineraryTitles.last_day}</p>
                <p>{formData.itinerary.last_day}</p>
                <div className="flex space-x-2">
                  {formData.itineraryImages.last_day.map((image, index) => (
                    <img key={index} src={image} alt={`Departure Day Image ${index}`} className="w-24 h-24 object-cover rounded" />
                  ))}
                </div>
              </div>
            </div>

            {/* Show Reset button after itinerary has been submitted */}
            <div className="flex justify-between mt-4">
              <button
                onClick={handleResetItinerary}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Inclusions */}
        <div>
          <label className="block text-lg font-medium">Inclusions</label>
          <textarea
            name="inclusions"
            value={formData.inclusions}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            placeholder="List of inclusions (ENTER for each item)"
          />
        </div>

        {/* Exclusions */}
        <div>
          <label className="block text-lg font-medium">Exclusions</label>
          <textarea
            name="exclusions"
            value={formData.exclusions}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            placeholder="List of exclusions (ENTER for each item)"
          />
        </div>

        {/* Old Price */}
        <div>
          <label className="block text-lg font-medium">Old Price (Optional)</label>
          <input
            type="text"
            name="oldPrice"
            value={formData.oldPrice}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Tour Button */}
        <div className="flex justify-center mt-5">
          <button
            type="button"
            onClick={handleSubmitTour}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Submit Tour
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourForm;
