"use client";
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const backEnd = "http://localhost:8080";
 
export default function ImageDetector() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [response, setResponse] = useState('');
  const [pred, setPred] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      setFile(file);
      setPreview(URL.createObjectURL(file)); // Set the image preview
    } else {
      alert('Please upload a valid image file.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setResponse('Please select or drag an image to upload.');
      return;
    }

    const formData = new FormData();

    formData.append('image', file);

    try {
      const res = await fetch(`${backEnd}/api/upload`, {
        method: 'POST',
        body: formData
        // mode: 'no-cors'
      });

      // console.log(res)
      if (res.ok) {
        const data = await res.json();
        setResponse(data.message);
        setPred(data.prediction);
      } else {
        setResponse('Error uploading image');
      }
    } catch (error) {
      setResponse('Failed to upload image. Run Python Backend');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div 
          {...getRootProps()}
          style={{
            border: '2px dashed #cccccc',
            padding: '10px',
            textAlign: 'center',
            borderRadius: '10px',
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#e0e0e0' : '#f9f9f9',
            backgroundImage: preview ? `url(${preview})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100px',
            minWidth: '200px'
          }}
        >
          <input {...getInputProps()} accept="image/*" />
          {isDragActive ? (
            <p>Drop the image here...</p>
          ) : (
            <p><b>{preview ? '' : 'Drag and drop an image here, or click to select one'}</b></p>
          )}
        </div>
        <br />
        <button type="submit">Upload</button>
      </form>
      <div className="ans-div">
        {response && <p className="ansPara"><span className="ansSpan">Response</span>  : {response}</p>}
        {pred && <p className="ansPara"><span className="ansSpan">Prediction</span>: {pred}</p>}
      </div>
      
    </>
  );
}
