"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Download, ImagePlus, Maximize2, MessageCircle, Move, RotateCcw, Sparkles, ZoomIn } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import './RoomVisualizer.css';

const sampleRooms = [
  {
    name: 'Living room',
    src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80'
  },
  {
    name: 'Bedroom',
    src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80'
  },
  {
    name: 'Dining room',
    src: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=80'
  }
];

const normalizeImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) return url;
  if (url.startsWith('/assets/') || url.startsWith('/images/')) return url;
  if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
  return url;
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getProductImages = (product = {}) => {
  const rawImages = [];

  if (product.imageUrls) {
    try {
      const parsed = typeof product.imageUrls === 'string' ? JSON.parse(product.imageUrls) : product.imageUrls;
      if (Array.isArray(parsed)) rawImages.push(...parsed);
    } catch (error) {
      console.warn('Could not parse product imageUrls:', error);
    }
  }

  if (product.imageUrl) rawImages.push(product.imageUrl);
  if (product.image1) rawImages.push(product.image1);
  if (Array.isArray(product.images)) rawImages.push(...product.images);
  if (Array.isArray(product.image_paths)) rawImages.push(...product.image_paths);

  return [...new Set(rawImages.map(normalizeImageUrl).filter(Boolean))];
};

const RoomVisualizer = () => {
  const stageRef = useRef(null);
  const fileInputRef = useRef(null);
  const productFileInputRef = useRef(null);
  const dragRef = useRef(null);
  const params = useMemo(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const [roomImage, setRoomImage] = useState(sampleRooms[0].src);
  const [productImage, setProductImage] = useState(normalizeImageUrl(params.get('image')) || '/images/placeholder.svg');
  const [productName, setProductName] = useState(params.get('name') || 'Selected furniture');
  const [productImages, setProductImages] = useState([]);
  const [position, setPosition] = useState({ x: 50, y: 58 });
  const [scale, setScale] = useState(42);
  const [rotation, setRotation] = useState(0);
  const [message, setMessage] = useState('');
  const hasProductPlaceholder = productImage === '/images/placeholder.svg';

  useEffect(() => {
    const productId = params.get('productId');
    if (!productId) return undefined;

    let ignore = false;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
        if (!response.ok) return;

        const payload = await response.json();
        const product = payload?.product || payload;
        const images = getProductImages(product);

        if (ignore) return;

        if (product?.name || product?.title) {
          setProductName(product.name || product.title);
        }

        if (images.length > 0) {
          setProductImages(images);
          setProductImage((current) => current === '/images/placeholder.svg' ? images[0] : current);
        }
      } catch (error) {
        console.warn('Could not load product for room visualizer:', error);
      }
    };

    fetchProduct();

    return () => {
      ignore = true;
    };
  }, [params]);

  const readImageFile = (file, onLoad) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onLoad(reader.result);
    reader.readAsDataURL(file);
  };

  const handleStagePointerDown = (event) => {
    if (!event.target.closest('.rv-product-layer')) return;
    const rect = stageRef.current.getBoundingClientRect();
    dragRef.current = {
      offsetX: event.clientX - rect.left - (position.x / 100) * rect.width,
      offsetY: event.clientY - rect.top - (position.y / 100) * rect.height
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleStagePointerMove = (event) => {
    if (!dragRef.current || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nextX = ((event.clientX - rect.left - dragRef.current.offsetX) / rect.width) * 100;
    const nextY = ((event.clientY - rect.top - dragRef.current.offsetY) / rect.height) * 100;
    setPosition({
      x: clamp(nextX, 5, 95),
      y: clamp(nextY, 15, 96)
    });
  };

  const handlePointerEnd = () => {
    dragRef.current = null;
  };

  const handleDownload = async () => {
    try {
      const stage = stageRef.current;
      const rect = stage.getBoundingClientRect();
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * pixelRatio);
      canvas.height = Math.round(rect.height * pixelRatio);
      context.scale(pixelRatio, pixelRatio);

      const loadImage = (src) => new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });

      const [room, product] = await Promise.all([loadImage(roomImage), loadImage(productImage)]);
      context.drawImage(room, 0, 0, rect.width, rect.height);

      const productWidth = (scale / 100) * rect.width;
      const productHeight = productWidth * (product.naturalHeight / product.naturalWidth);
      const productX = (position.x / 100) * rect.width;
      const productY = (position.y / 100) * rect.height;

      context.save();
      context.translate(productX, productY);
      context.rotate((rotation * Math.PI) / 180);
      context.drawImage(product, -productWidth / 2, -productHeight / 2, productWidth, productHeight);
      context.restore();

      const link = document.createElement('a');
      link.download = `${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'room-preview'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setMessage('Preview downloaded.');
    } catch (error) {
      console.error('Room preview download failed:', error);
      setMessage('Download could not finish for this image. You can still screenshot or share the layout.');
    }
  };

  const handleWhatsApp = () => {
    const text = `Hi, I tried ${productName} in my room visualizer. Please share price, size and customization options.`;
    window.open(`https://wa.me/9779845427041?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <main className="room-visualizer-page">
      <section className="rv-header">
        <div>
          <span className="rv-kicker"><Sparkles size={15} /> Room Visualizer</span>
          <h1>Place the furniture before you buy</h1>
          <p>Preview size, position and color mood inside a real room photo.</p>
        </div>
        <div className="rv-header-actions">
          <button className="rv-secondary-btn" type="button" onClick={() => fileInputRef.current?.click()}>
            <ImagePlus size={18} />
            Upload room
          </button>
          <button className="rv-whatsapp-btn" type="button" onClick={handleWhatsApp}>
            <MessageCircle size={18} />
            Ask on WhatsApp
          </button>
        </div>
      </section>

      <section className="rv-layout">
        <div className="rv-stage-wrap">
          <div className="rv-stage-toolbar">
            <div>
              <span>Preview workspace</span>
              <strong>{productName}</strong>
            </div>
            <button type="button" onClick={() => {
              setPosition({ x: 50, y: 58 });
              setScale(42);
              setRotation(0);
            }}>
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
          <div
            className="rv-stage"
            ref={stageRef}
            onPointerDown={handleStagePointerDown}
            onPointerMove={handleStagePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
          >
            <img className="rv-room-image" src={roomImage} alt="Selected room" />
            <div
              className={`rv-product-layer ${hasProductPlaceholder ? 'is-placeholder' : ''}`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                width: `${scale}%`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`
              }}
            >
              {hasProductPlaceholder ? (
                <button type="button" className="rv-product-upload-card" onClick={() => productFileInputRef.current?.click()}>
                  <ImagePlus size={26} />
                  <span>Upload furniture image</span>
                </button>
              ) : (
                <img src={productImage} alt={productName} draggable="false" />
              )}
            </div>
            <div className="rv-stage-hint">
              <Move size={16} />
              Drag furniture to position it
            </div>
          </div>
        </div>

        <aside className="rv-controls" aria-label="Room visualizer controls">
          <div className="rv-product-card">
            <div className="rv-product-preview">
              <img src={productImage} alt={productName} />
            </div>
            <div>
              <span>Selected furniture</span>
              <h2>{productName}</h2>
            </div>
          </div>

          <div className="rv-control-group">
            <label>Room photo</label>
            <div className="rv-button-row">
              <button type="button" onClick={() => fileInputRef.current?.click()}>
                <ImagePlus size={17} />
                Upload
              </button>
              <select value={roomImage} onChange={(event) => setRoomImage(event.target.value)}>
                {sampleRooms.map((room) => (
                  <option key={room.src} value={room.src}>{room.name}</option>
                ))}
              </select>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(event) => readImageFile(event.target.files?.[0], setRoomImage)}
              hidden
            />
          </div>

          <div className="rv-control-group">
            <label>Furniture image</label>
            <button type="button" onClick={() => productFileInputRef.current?.click()}>
              <ImagePlus size={17} />
              Upload furniture PNG
            </button>
            {productImages.length > 1 && (
              <div className="rv-product-thumbs">
                {productImages.slice(0, 5).map((image) => (
                  <button
                    key={image}
                    type="button"
                    className={productImage === image ? 'active' : ''}
                    onClick={() => setProductImage(image)}
                    aria-label="Use this product image"
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            )}
            <input
              ref={productFileInputRef}
              type="file"
              accept="image/*"
              onChange={(event) => readImageFile(event.target.files?.[0], setProductImage)}
              hidden
            />
          </div>

          <div className="rv-control-group">
            <label htmlFor="rv-name">Furniture name</label>
            <input
              id="rv-name"
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
            />
          </div>

          <div className="rv-slider-group">
            <label htmlFor="rv-scale"><ZoomIn size={16} /> Size <span>{scale}%</span></label>
            <input id="rv-scale" type="range" min="15" max="90" value={scale} onChange={(event) => setScale(Number(event.target.value))} />
          </div>

          <div className="rv-slider-group">
            <label htmlFor="rv-rotate"><RotateCcw size={16} /> Rotation <span>{rotation} deg</span></label>
            <input id="rv-rotate" type="range" min="-25" max="25" value={rotation} onChange={(event) => setRotation(Number(event.target.value))} />
          </div>

          <div className="rv-tip">
            <Maximize2 size={17} />
            Use transparent PNG furniture photos for the cleanest room preview.
          </div>

          <div className="rv-actions">
            <button type="button" onClick={handleDownload}>
              <Download size={18} />
              Download preview
            </button>
            <button type="button" onClick={handleWhatsApp}>
              <MessageCircle size={18} />
              Send quote request
            </button>
          </div>

          {message && <p className="rv-message">{message}</p>}
        </aside>
      </section>
    </main>
  );
};

export default RoomVisualizer;
