import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import './App.css';
import { Fancybox } from '@fancyapps/ui';
import fetchImagesFromApi from 'api/api';

const App = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!searchTerm) return;

    const fetchImages = async () => {
      setLoading(true);
      try {
        const { hits, totalHits } = await fetchImagesFromApi(searchTerm, currentPage);
        setImages(prev => [...prev, ...hits]);
        setShowButton(currentPage < Math.ceil(totalHits / 12));
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [searchTerm, currentPage]);

  const handleSearchSubmit = searchTerm => {
    setSearchTerm(searchTerm);
    setImages([]);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const openLightbox = imageSrc => {
    Fancybox.show([{ src: imageSrc, type: 'image' }]);
  };

  return (
    <div className="App">
      <Searchbar onSubmit={handleSearchSubmit} />
      <ImageGallery images={images} openLightbox={openLightbox} />
      {loading && <Loader />}
      {showButton && <Button onClick={handleLoadMore} />}
    </div>
  );
};

export default App;
