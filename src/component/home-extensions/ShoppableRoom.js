import React, { useState } from 'react';
import './ShoppableRoom.css';
import { useNavigate } from 'react-router-dom';

const ShoppableRoom = () => {
    const navigate = useNavigate();
    const [hoveredSpot, setHoveredSpot] = useState(null);

    const hotspots = [
        {
            id: 1,
            top: '55%',
            left: '35%',
            title: 'Royal Velvet Sofa',
            price: '₹45,999',
            category: 'living-room',
            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200'
        },
        {
            id: 2,
            top: '40%',
            left: '75%',
            title: 'Nordic Floor Lamp',
            price: '₹8,499',
            category: 'lightings',
            image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=200'
        },
        {
            id: 3,
            top: '75%',
            left: '60%',
            title: 'Oak Coffee Table',
            price: '₹15,000',
            category: 'living-room',
            image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=200'
        }
    ];

    return (
        <section className="shoppable-section">
            <div className="shoppable-header">
                <h2>Shop The Room</h2>
                <p>Hover over the markers to discover the pieces making up this perfect living space. Easily recreate this majestic look in your own home.</p>
            </div>

            <div className="shoppable-container">
                <img 
                    src="https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80&w=1600" 
                    alt="Beautifully staged living room" 
                    className="shoppable-bg"
                    loading="lazy"
                />

                {hotspots.map((spot) => (
                    <div 
                        key={spot.id}
                        className="hotspot-wrapper"
                        style={{ top: spot.top, left: spot.left }}
                        onMouseEnter={() => setHoveredSpot(spot.id)}
                        onMouseLeave={() => setHoveredSpot(null)}
                    >
                        <div className="hotspot-pulse">
                            <span className="plus">+</span>
                        </div>
                        
                        <div className={`hotspot-tooltip ${hoveredSpot === spot.id ? 'active' : ''}`}>
                            <img src={spot.image} alt={spot.title} />
                            <div className="tooltip-info">
                                <h4>{spot.title}</h4>
                                <span className="price">{spot.price}</span>
                                <button onClick={() => navigate(`/category/${spot.category}`)}>Shop Now</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ShoppableRoom;
