"use client";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [file, setFile] = useState(null);
  const [detectionType, setDetectionType] = useState("missile");
  const [resultImage, setResultImage] = useState(null);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image.");

    const formData = new FormData();
    formData.append("file", file);

    // Choose the correct backend API
    let apiUrl = "";
    if (detectionType === "missile") apiUrl = "http://localhost:5000/upload";
    else if (detectionType === "bird") apiUrl = "http://localhost:5001/detect/bird";
    else if (detectionType === "drone") apiUrl = "http://localhost:5002/detect/drone";

    setLoading(true);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setDetections(data.detections || []);

        // Debugging log
        console.log("API Response:", data);

        // Fix image URL based on detection type
        let imageUrl = "";
        if (detectionType === "missile" && data.image_url) imageUrl = data.image_url;
        else if (detectionType === "bird" && data.result_image) imageUrl = `http://localhost:5001${data.result_image}`;
        else if (detectionType === "drone" && data.result_image) imageUrl = `http://localhost:5002${data.result_image}`;

        // Ensure a valid image URL before setting state
        if (imageUrl) {
          setResultImage(imageUrl);
        } else {
          console.warn("No valid image URL received from API");
          setResultImage(null);
        }
      } else {
        alert("Detection failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        AI-Powered Detection System
      </h1>

      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex gap-4 mb-4">
          <label className="flex-1 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 text-center">
            <input type="file" onChange={handleFileChange} className="hidden" />
            {file ? file.name : "Choose Image"}
          </label>

          <select
            className="p-4 bg-gray-700 rounded-lg text-white"
            value={detectionType}
            onChange={(e) => setDetectionType(e.target.value)}
          >
            <option value="missile">Missile Detection</option>
            <option value="bird">Bird Detection</option>
            <option value="drone">Drone Detection</option>
          </select>

          <button
            onClick={handleUpload}
            className="px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
          >
            {loading ? "Processing..." : "Upload & Detect"}
          </button>
        </div>

        {resultImage ? (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Detection Result:</h2>
            <Image
              src={resultImage}
              alt="Detection Result"
              width={640}
              height={480}
              className="rounded-lg"
            />
            <div className="mt-4 text-left">
              {detections.length > 0 ? (
                detections.map((d, index) => (
                  <p key={index} className="text-green-400">
                    {d.class} - {Math.round(d.confidence * 100)}%
                  </p>
                ))
              ) : (
                <p className="text-red-400">No objects detected.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-red-400 text-center mt-4">No image detected.</p>
        )}
      </div>
    </div>
  );
}
