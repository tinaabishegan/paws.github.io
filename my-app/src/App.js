import React, { useState, useEffect, useRef } from 'react';
import { Heart, X, RotateCcw, Sparkles } from 'lucide-react';

const CatSwipeApp = () => {
  const [cats, setCats] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCats, setLikedCats] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragRotation, setDragRotation] = useState(0);
  const cardRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });

  // Generate cat images from Cataas API
  useEffect(() => {
    const generateCats = () => {
      const catImages = [];
      for (let i = 0; i < 15; i++) {
        // Use different endpoints for variety
        const endpoints = [
          `https://cataas.com/cat?${Date.now()}&r=${i}`,
          `https://cataas.com/cat/cute?${Date.now()}&r=${i}`,
          `https://cataas.com/cat/kitten?${Date.now()}&r=${i}`,
        ];
        catImages.push({
          id: i,
          url: endpoints[i % endpoints.length],
          liked: false
        });
      }
      setCats(catImages);
      setIsLoading(false);
    };

    generateCats();
  }, []);

  const handleLike = () => {
    if (currentIndex >= cats.length) return;
    
    const currentCat = cats[currentIndex];
    setLikedCats(prev => [...prev, currentCat]);
    nextCat();
  };

  const handleDislike = () => {
    nextCat();
  };

  const nextCat = () => {
    if (currentIndex + 1 >= cats.length) {
      setIsComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setLikedCats([]);
    setIsComplete(false);
  };

  // Touch/Mouse event handlers for swipe gestures
  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;

    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    const rotation = deltaX * 0.1;

    setDragOffset({ x: deltaX, y: deltaY });
    setDragRotation(rotation);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    const threshold = 150;
    const deltaX = dragOffset.x;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        handleLike();
      } else {
        handleDislike();
      }
    }

    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setDragRotation(0);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="text-white text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 animate-spin" />
          <p className="text-xl font-semibold">Loading adorable cats...</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="mb-6">
              <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Purrfect Results!
              </h2>
              <p className="text-gray-600">
                You liked {likedCats.length} out of {cats.length} cats
              </p>
            </div>

            {likedCats.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Your Favorite Cats
                </h3>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {likedCats.map((cat) => (
                    <div key={cat.id} className="relative">
                      <img
                        src={cat.url}
                        alt="Liked cat"
                        className="w-full h-24 object-cover rounded-lg shadow-md"
                      />
                      <Heart className="absolute top-1 right-1 w-4 h-4 text-pink-500 fill-current" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={restart}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center mx-auto"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCat = cats[currentIndex];
  const progress = ((currentIndex + 1) / cats.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-4 select-none">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Paws & Preferences
          </h1>
          <p className="text-white/80">Find your favorite kitty!</p>
          
          {/* Progress bar */}
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/80 text-sm mt-2">
            {currentIndex + 1} of {cats.length}
          </p>
        </div>

        {/* Cat card stack */}
        <div className="relative h-96 mb-8">
          {/* Next card (if exists) */}
          {currentIndex + 1 < cats.length && (
            <div className="absolute inset-0 bg-white rounded-3xl shadow-lg transform scale-95 opacity-50" />
          )}
          
          {/* Current card */}
          <div
            ref={cardRef}
            className="absolute inset-0 bg-white rounded-3xl shadow-2xl cursor-grab active:cursor-grabbing overflow-hidden transform transition-transform duration-200"
            style={{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragRotation}deg)`,
              zIndex: 10
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={currentCat.url}
              alt="Cat"
              className="w-full h-full object-cover"
              draggable={false}
            />
            
            {/* Swipe indicators */}
            <div 
              className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full font-bold transform rotate-12 transition-opacity"
              style={{ opacity: dragOffset.x > 50 ? 1 : 0 }}
            >
              LIKE
            </div>
            <div 
              className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold transform -rotate-12 transition-opacity"
              style={{ opacity: dragOffset.x < -50 ? 1 : 0 }}
            >
              NOPE
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center space-x-8">
          <button
            onClick={handleDislike}
            className="bg-white text-red-500 w-16 h-16 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={handleLike}
            className="bg-white text-pink-500 w-16 h-16 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center"
          >
            <Heart className="w-8 h-8" />
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center mt-8 text-white/80">
          <p className="text-sm">
            Swipe right to like • Swipe left to pass
          </p>
        </div>
      </div>
    </div>
  );
};

export default CatSwipeApp;