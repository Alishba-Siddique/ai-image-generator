import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../Assets/default_image_1.svg';

const ImageGenerator = () => {
  const [image_url, setImage_url] = useState('/');
  let inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const imageGenerator = async () => {
    if (inputRef.current.value === '') {
      return 0;
    }
    setLoading(true);
    const response = await fetch(
      'https://api.openai.com/v1/images/generations',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'User-Agent': 'Edge',
        },
        body: JSON.stringify({
          prompt: `${inputRef.current.value}`,
          n: 1,
          size: '512x512',
        }),
      }
    );

    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      return;
    }

    let data = await response.json();

    console.log('API response:', data);

    if (!data || !data.data || data.data.length === 0) {
      console.error('API response does not contain expected data.');
      return;
    }
    let data_array = data.data;
    setImage_url(data_array[0].url);
    setLoading(false);
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        AI Image <span>Generator</span>
      </div>
      <div className="img-loading">
        <img src={image_url === '/' ? default_image : image_url} alt="" />
        <div className="loading">
          <div className={loading ? 'loading-bar-full' : 'loading-bar'}></div>
          <div className={loading ? 'loading-text' : 'display-none'}>
            Loading...
          </div>
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe What You Want to See?"
        />
        <div
          className="generate-btn"
          onClick={() => {
            imageGenerator();
          }}
        >
          Generate
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
