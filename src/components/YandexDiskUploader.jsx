/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";

import Loading from "./Loading";

const YandexDiskUploader = ({ auth }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).slice(0, 100);
    setSelectedFiles(files);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const url = `https://cloud-api.yandex.net/v1/disk/resources/upload?path=%2F${file.name}&overwrite=true`;
      const options = {
        headers: {
          Authorization: `OAuth ${auth}`
        }
      };

      const response1 = await axios.get(url, options);

      if (response1.status !== 200) {
        throw new Error("Failed to upload file");
      }

      const response2 = await axios.put(response1.data.href, formData);

      if (response2.status !== 201) {
        throw new Error("Failed to upload file");
      }

      setLoading(false);
      alert(`${file.name} uploaded to Yandex.Disk successfully!`);
    } catch (error) {
      setLoading(false);
      console.error(error.message);
      alert(`Failed to upload file: ${file.name}`);
    }
  };

  const handleUploads = () => {
    if (selectedFiles.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    selectedFiles.forEach((file) => {
      setLoading(true);
      uploadFile(file);
    });

    setSelectedFiles([]);
  };

  return (
    <>
      {loading && <Loading />}
      <div className="uploader-container">
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          accept="image/*, audio/*, .pdf, .doc, .txt"
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="select-files-btn">
          Select Files
        </label>
        <button
          onClick={handleUploads}
          disabled={selectedFiles.length === 0}
          className={`upload-btn ${
            selectedFiles.length > 0
              ? "upload-btn-active"
              : "upload-btn-inactive"
          }`}
        >
          Upload to Yandex.Disk
        </button>
        <div className="selected-files">
          {selectedFiles.length > 0 ? (
            <>
              <h2>Files</h2>
              <div className="selected-files-container">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="file-info">
                    <p>
                      {index + 1}
                      {")"} {file.name}
                    </p>
                    <span>Size - {file.size} bytes</span>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default YandexDiskUploader;
