"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

function FileUpload() {
  const [location, setLocation] = useState<any>({});
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if the browser supports the Geolocation API
    if ("geolocation" in navigator) {
      // Get the current location
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    } else {
      // Geolocation is not supported
      setError("Geolocation is not supported by your browser.");
    }
  }, []); // Empty dependency array to run the effect only once

  // Success callback function
  const successCallback = (position: any) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Display the location
    setLocation({ latitude, longitude });
  };

  // Error callback function
  const errorCallback = (error: any) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setError("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        setError("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        setError("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        setError("An unknown error occurred.");
        break;
      default:
        setError("An error occurred while fetching the location.");
    }
  };
  const [base64Video, setBase64Video] = useState<any>("");

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setBase64Video(reader.result);
    };

    console.log("File uploaded:", file);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:5000/upload",
        { video: base64Video, location: location },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Video uploaded successfully!");
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <div>
      <div>
        <input type="file" accept="video/mp4" onChange={handleFileChange} />
        <button onClick={handleSubmit}>Upload Video</button>
        <p>
          {location.longitude} {location.latitude}
        </p>
      </div>
    </div>
  );
}

export default FileUpload;
