import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Typography, Box, Divider } from "@mui/material";
import { PhoneInTalk as PhoneInTalkIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";

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


const Itinerary = () => {
  const { id } = useParams();
  const [tourData, setTourData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("itinerary");
  const [imageIndices, setImageIndices] = useState([]);

  const { isMobile, isTablet } = useDeviceType();

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/tours/${id}`);
        setTourData(response.data);

        const totalDays = response.data.nights + 1; 
        const initialIndices = Array(totalDays).fill(0);
        setImageIndices(initialIndices);
      } catch (err) {
        console.error("Error fetching tour data:", err);
        setError("Failed to fetch tour details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTourData();
  }, [id]);

  useEffect(() => {
    if (!tourData || !tourData.itinerary_images) return;

    const interval = setInterval(() => {
      setImageIndices((prevIndices) => {
        return prevIndices.map((currentIndex, dayIndex) => {
          const imagesForDay = tourData.itinerary_images[`day_${dayIndex + 1}`];
          if (imagesForDay && imagesForDay.length > 0) {
            return (currentIndex + 1) % imagesForDay.length;
          }
          return currentIndex;
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [tourData]);

  if (loading) {
    return <div>Loading tour details...</div>;
  }

  if (error || !tourData) {
    return <div>{error || "Tour not found."}</div>;
  }

  const totalDays = tourData.nights + 1;

  const handleInquiryClick = () => {
    window.location.href = "tel:+1234567890";
  };

  return (
    <div className="itinerary-wrap flex flex-col w-full">
      <Divider />
      <div className="tabs flex mb-6 mt-6 gap-2 w-full justify-between align-middle">
        {["itinerary", "fineprint"].map((tab) => (
          <div
            key={tab}
            className={`tab flex items-center justify-center px-2 py-2 text-lg md:text-2xl font-bold transition-all duration-300 transform border-2 rounded-lg cursor-pointer w-full ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-md border-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

      <div className="tab-content px-2 md:px-6">
        {activeTab === "itinerary" && (
          <div>
            {Array.from({ length: totalDays }).map((_, dayIndex) => {
              const dayDetails = tourData.itinerary?.[`day_${dayIndex + 1}`];
              const imagesForDay = tourData.itinerary_images?.[`day_${dayIndex + 1}`];
              const titleForDay = tourData.itinerary_titles?.[`day_${dayIndex + 1}`];

              return (
                <div
                  key={dayIndex}
                  className="itinerary-item flex flex-col lg:flex-row border border-gray-300 p-2 mb-6 bg-white shadow-lg transition-all"
                >
                  <div className="itinerary-desc-wrap flex flex-col gap-4 p-2 flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <div className="itinerary-day-box px-4 py-2 bg-blue-500 text-white font-semibold text-xl md:text-2xl">
                        Day {dayIndex + 1}
                      </div>
                      <div className="itinerary-title bg-gray-200 px-4 py-2 w-full md:w-auto text-lg md:text-2xl font-semibold text-blue-800">
                        {titleForDay || `Day ${dayIndex + 1} - Title Not Available`}
                      </div>
                    </div>
                    <div className="itinerary-desc text-sm md:text-base leading-relaxed text-gray-700">
                      {dayDetails ? (
                        <ul className="list-disc pl-6">
                          {dayDetails.map((detail, index) => (
                            <li key={index} className="mb-2">
                              {detail}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No activities available for this day.</p>
                      )}
                    </div>
                  </div>

                  <div className="itinerary-images relative flex items-center justify-center w-full h-48 md:w-64 md:h-60 lg:h-auto lg:w-80 overflow-hidden">
                    {imagesForDay && imagesForDay.length > 0 ? (
                      <>
                        <img
                          src={imagesForDay[imageIndices[dayIndex]]}
                          alt={`Day ${dayIndex + 1} image`}
                          className="max-w-full max-h-full object-contain object-center transition-all duration-1000 ease-in-out"
                        />
                        <div
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-lg font-bold cursor-pointer z-10 select-none text-white"
                          onClick={() =>
                            setImageIndices((prev) => {
                              const newIndices = [...prev];
                              newIndices[dayIndex] =
                                (newIndices[dayIndex] - 1 + imagesForDay.length) % imagesForDay.length;
                              return newIndices;
                            })
                          }
                        >
                          &lt;
                        </div>
                        <div
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-lg font-bold cursor-pointer z-10 select-none text-white"
                          onClick={() =>
                            setImageIndices((prev) => {
                              const newIndices = [...prev];
                              newIndices[dayIndex] = (newIndices[dayIndex] + 1) % imagesForDay.length;
                              return newIndices;
                            })
                          }
                        >
                          &gt;
                        </div>
                      </>
                    ) : (
                      <p className="text-center">No images available for this day.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "fineprint" && (
          <div className="overflow-x-auto bg-white p-0 lg:p-8">
            <div className="summary-item flex flex-wrap border border-gray-300 p-0 mb-6 bg-white shadow-lg transform">
              <div className="summary-desc-wrap flex flex-col gap-6 flex-1">
                <div className="summary-desc text-lg text-gray-700 leading-relaxed text-justify lg:p-6 p-4">
                  {tourData.tour_summary || "No summary available."}
                </div>
              </div>
              {tourData.tour_image && !isMobile && (
                <div className="summary-item-img flex-shrink-0 justify-center align-middle w-64 h-fit lg:mx-0  overflow-hidden">
                  <img
                    src={tourData.tour_image}
                    alt="Tour Summary"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {tourData.tour_image && isMobile && (
                <div className="summary-item-img flex-shrink-0 justify-center align-middle w-full h-44 lg:mx-0  overflow-hidden">
                  <img
                    src={tourData.tour_image}
                    alt="Tour Summary"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <h2 className="text-4xl font-semibold mb-6 mt-6 text-center text-blue-900">
              What&apos;s Inside the Package?
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="inclusions w-full md:w-1/2 border p-4 bg-gray-100/50">
                <h3 className="text-xl font-bold mb-4 text-gray-700">Inclusions</h3>
                <Divider/>
                {Array.isArray(tourData.inclusions) && tourData.inclusions.length > 0 ? (
                  <ul className="list-none gap-y-4 text-lg mt-4">
                    {tourData.inclusions.map((inc, index) => (
                      <li key={index} className="flex items-center text-green-500 mb-4">
                        <span className="mr-4 text-xl">&#10004;</span>
                        {inc}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 text-lg">No inclusions available.</p>
                )}
              </div>
              <div className="exclusions w-full md:w-1/2 border p-4 bg-gray-100/50">
                <h3 className="text-xl font-bold mb-4 text-gray-700">Exclusions</h3>
                <Divider />
                {Array.isArray(tourData.exclusions) && tourData.exclusions.length > 0 ? (
                  <ul className="list-none gap-y-4 text-lg mt-4">
                    {tourData.exclusions.map((exc, index) => (
                      <li key={index} className="flex items-center text-red-500 mb-4">
                        <span className="mr-4 text-xl">&#10008;</span>
                        {exc}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 text-lg">No exclusions available.</p>
                )}
              </div>
            </div>

            <div className="mt-12 space-y-12 lg:p-0 p-6">
              <div>
                <h3 className="text-3xl font-semibold text-blue-900 mb-6">Refund Policies</h3>
                <p className="text-gray-700 text-lg mb-6 text-justify">
                  Refund policies are designed to uphold fairness and transparency, ensuring peace of mind for our valued travelers.
                </p>
                <ul className="list-disc pl-8 text-gray-800 text-lg leading-relaxed">
                  <li>Refunds are applicable under specific terms and conditions.</li>
                  <li>Review the cancellation policy before booking.</li>
                  <li>Refunds will be processed within 7–10 business days after confirmation.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-3xl font-semibold text-blue-900 mb-6">Payment Methods</h3>
                <p className="text-gray-700 text-lg mb-6 text-justify">
                  We provide a variety of secure and convenient payment options.
                </p>
                <ul className="list-disc pl-8 text-gray-800 text-lg leading-relaxed">
                  <li>Credit cards and debit cards are accepted.</li>
                  <li>Secure online payment gateways available.</li>
                  <li>Bank transfers can be arranged for large amounts.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-3xl font-semibold text-blue-900 mb-6">Payment Policies</h3>
                <p className="text-gray-700 text-lg mb-6 text-justify">
                  To secure your booking, we require either full payment or a partial deposit.
                </p>
                <ul className="list-disc pl-8 text-gray-800 text-lg leading-relaxed">
                  <li>Full payment is required at the time of booking or as per the terms.</li>
                  <li>Deposits may be required for certain trips or packages.</li>
                  <li>Payments must be made according to the specified deadlines.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Itinerary;