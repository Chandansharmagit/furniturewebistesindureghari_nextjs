import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaPhone, FaShoppingCart, FaCommentDots } from 'react-icons/fa';
import './FloatingActionDock.css';

const FloatingActionDock = ({ onOpenOrder, onOpenContact, onOpenFeedback }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const hubVariants = {
        collapsed: { rotate: 0 },
        expanded: { rotate: 45 }
    };

    const itemVariants = {
        collapsed: {
            opacity: 0,
            y: 20,
            scale: 0.8,
            pointerEvents: 'none',
            transition: { duration: 0.2 }
        },
        expanded: (i) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            pointerEvents: 'auto',
            transition: {
                delay: i * 0.1,
                type: "spring",
                stiffness: 260,
                damping: 20
            }
        })
    };

    const actions = [
        {
            id: 'feedback',
            icon: <FaCommentDots />,
            label: 'Feedback',
            color: '#8B4513',
            onClick: onOpenFeedback
        },
        {
            id: 'contact',
            icon: <FaPhone />,
            label: 'Contact Us',
            color: '#654321',
            onClick: onOpenContact
        },
        {
            id: 'order',
            icon: <FaShoppingCart />,
            label: 'Order Request',
            color: '#d4af37',
            onClick: onOpenOrder
        }
    ];

    return (
        <div className="floating-action-hub-container">
            <div className="action-items">
                <AnimatePresence>
                    {isExpanded && actions.map((action, i) => (
                        <motion.div
                            key={action.id}
                            custom={i}
                            variants={itemVariants}
                            initial="collapsed"
                            animate="expanded"
                            exit="collapsed"
                            className="action-item-wrapper"
                        >
                            <div className="action-label">{action.label}</div>
                            <button
                                className="action-button"
                                style={{ backgroundColor: action.color }}
                                onClick={() => {
                                    action.onClick();
                                    setIsExpanded(false);
                                }}
                            >
                                {action.icon}
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <motion.button
                className={`hub-trigger ${isExpanded ? 'active' : ''}`}
                variants={hubVariants}
                animate={isExpanded ? "expanded" : "collapsed"}
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FaPlus />
            </motion.button>
        </div>
    );
};

export default FloatingActionDock;
