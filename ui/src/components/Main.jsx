import React, { useState } from "react";
import axios from "axios";
import { PhotoIcon } from "@heroicons/react/24/solid";

export default function Main() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [button, setButton] = useState("UPLOAD");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [filebar,setFileBar] =useState(true)

  const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    const fileName = selectedFile.name;
    if (!fileName.toLowerCase().endsWith('.png') &&
        !fileName.toLowerCase().endsWith('.jpg') &&
        !fileName.toLowerCase().endsWith('.jpeg')) {
      alert('Please select a PNG, JPG, or JPEG file.');
    } else {
      console.log('File name:', fileName);
      setFileBar(false)

    }
    setFile(selectedFile);
  }
};

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setStatus(response.data.status);
      console.log("File uploaded successfully", response.data);
      setButton("DOWNLOAD!");
      setDownloadUrl(`http://localhost:5000/download/${response.data.filename}`);
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  const handleDownload = async (event) => {
    event.preventDefault();
    if (downloadUrl) {
      try {
        const response = await axios.get(downloadUrl, {
          responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', downloadUrl.split('/').pop()); // Extract the filename
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Error downloading file", error);
      }
    }
  };

  return (
    <div>
      <div className="h-screen md:flex">
        <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-red-900 to-purple-200 i justify-around items-center hidden">
          <div>
            <h1 className="text-white font-bold text-4xl font-sans">ConvertPro</h1>
            <p className="text-white mt-1">
              Effortlessly Convert Your Images to AVIF Format
            </p>
            <button
              type="submit"
              className="block w-28 bg-white text-purple-500 mt-4 py-2 rounded-2xl font-bold mb-2"
            >
              Read More
            </button>
          </div>
          <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        </div>
        <div className="flex md:w-1/2 justify-center py-6 items-center">
          <form className="flex justify-center items-center" onSubmit={button === "UPLOAD" ? handleSubmit : handleDownload}>
            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Upload your image to convert
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-14 py-10">
                <div className="text-center">
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  {filebar ?<div> <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p></div> : <div>{file.name}hello</div>}
                </div>
              </div>
              <button className="bg-indigo-300 center hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                <span>{"    +"} {button}</span>
              </button>
              {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
