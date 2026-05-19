"use client";
import React from 'react';
import { Helmet } from 'react-helmet';
import './TermsConditions.css';

const TermsConditions = () => {
    return (
        <>
            <Helmet>
                <title>Terms & Conditions - Bishwokarma Furniture</title>
                <meta name="description" content="Terms and Conditions for Bishwokarma Furniture. Read our terms of service for purchasing and using our furniture products." />
            </Helmet>

            <div className="terms-conditions-page">
                <div className="terms-conditions-container">
                    {/* Header */}
                    <div className="terms-conditions-header">
                        <h1>Terms & Conditions</h1>
                        <p className="last-updated">Last Updated: December 12, 2024</p>
                    </div>

                    {/* Content */}
                    <div className="terms-conditions-content">
                        {/* Introduction */}
                        <section className="terms-section">
                            <h2>1. Introduction</h2>
                            <p>
                                Welcome to Bishwokarma Furniture. These Terms and Conditions govern your use of our website and the purchase
                                of products from us. By accessing our website and placing an order, you accept these terms and conditions
                                in full. If you disagree with any part of these terms, please do not use our website.
                            </p>
                        </section>

                        {/* Definitions */}
                        <section className="terms-section">
                            <h2>2. Definitions</h2>
                            <ul>
                                <li><strong>"We", "Us", "Our":</strong> Refers to Bishwokarma Furniture</li>
                                <li><strong>"You", "Your":</strong> Refers to the user or customer</li>
                                <li><strong>"Products":</strong> Refers to furniture and related items sold on our website</li>
                                <li><strong>"Website":</strong> Refers to sinduregharifurniture.shop</li>
                                <li><strong>"Order":</strong> Refers to your purchase of products from us</li>
                            </ul>
                        </section>

                        {/* Products and Pricing */}
                        <section className="terms-section">
                            <h2>3. Products and Pricing</h2>
                            <p>
                                All products are subject to availability. We reserve the right to discontinue any product at any time.
                                Prices for our products are subject to change without notice. We make every effort to ensure that prices
                                on our website are accurate, but errors may occur.
                            </p>
                            <ul>
                                <li>All prices are listed in Nepalese Rupees (NPR)</li>
                                <li>Prices include applicable taxes unless otherwise stated</li>
                                <li>Product images are for illustration purposes only</li>
                                <li>Actual colors may vary slightly from images displayed</li>
                            </ul>
                        </section>

                        {/* Ordering and Payment */}
                        <section className="terms-section">
                            <h2>4. Ordering and Payment</h2>
                            <p>
                                When you place an order, you are making an offer to purchase products from us. We reserve the right to
                                accept or decline your order for any reason.
                            </p>
                            <ul>
                                <li>All orders are subject to acceptance and product availability</li>
                                <li>Payment must be made in full before delivery</li>
                                <li>We accept various payment methods including cash, bank transfer, and digital payments</li>
                                <li>You will receive an order confirmation via email or phone</li>
                            </ul>
                        </section>

                        {/* Delivery */}
                        <section className="terms-section">
                            <h2>5. Delivery</h2>
                            <p>
                                We deliver furniture products across Nepal. Delivery times and costs vary depending on your location.
                            </p>
                            <ul>
                                <li>Delivery times are estimates and not guaranteed</li>
                                <li>Delivery charges are based on location and order size</li>
                                <li>Free delivery may be available for orders above certain amounts</li>
                                <li>You must be available to receive delivery at the specified address</li>
                                <li>Installation services may be available for an additional fee</li>
                            </ul>
                        </section>

                        {/* Returns and Refunds */}
                        <section className="terms-section">
                            <h2>6. Returns and Refunds</h2>
                            <p>
                                We want you to be completely satisfied with your purchase. If you're not happy with your product,
                                please contact us within the specified period.
                            </p>
                            <ul>
                                <li>Products can be returned within 7 days of delivery</li>
                                <li>Products must be in original condition with all packaging</li>
                                <li>Custom-made or personalized items cannot be returned</li>
                                <li>Refunds will be processed within 7-14 business days</li>
                                <li>Return shipping costs may apply</li>
                                <li>Damaged products must be reported within 48 hours of delivery</li>
                            </ul>
                        </section>

                        {/* Warranty */}
                        <section className="terms-section">
                            <h2>7. Warranty</h2>
                            <p>
                                We provide warranty coverage for manufacturing defects on our furniture products.
                            </p>
                            <ul>
                                <li>Warranty period varies by product (typically 1-3 years)</li>
                                <li>Warranty covers manufacturing defects only</li>
                                <li>Warranty does not cover normal wear and tear, misuse, or accidents</li>
                                <li>Warranty claims must be made with proof of purchase</li>
                            </ul>
                        </section>

                        {/* Intellectual Property */}
                        <section className="terms-section">
                            <h2>8. Intellectual Property</h2>
                            <p>
                                All content on this website, including text, graphics, logos, images, and software, is the property of
                                Bishwokarma Furniture and is protected by copyright and intellectual property laws.
                            </p>
                            <ul>
                                <li>You may not reproduce, distribute, or use our content without permission</li>
                                <li>Product images and descriptions are proprietary</li>
                                <li>Our brand name and logo are registered trademarks</li>
                            </ul>
                        </section>

                        {/* Limitation of Liability */}
                        <section className="terms-section">
                            <h2>9. Limitation of Liability</h2>
                            <p>
                                To the maximum extent permitted by law, Bishwokarma Furniture shall not be liable for any indirect,
                                incidental, special, or consequential damages arising out of or in connection with your use of our
                                website or products.
                            </p>
                        </section>

                        {/* User Conduct */}
                        <section className="terms-section">
                            <h2>10. User Conduct</h2>
                            <p>You agree not to:</p>
                            <ul>
                                <li>Use our website for any unlawful purpose</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Transmit any harmful code or viruses</li>
                                <li>Interfere with other users' access to the website</li>
                                <li>Provide false or misleading information</li>
                            </ul>
                        </section>

                        {/* Modifications */}
                        <section className="terms-section">
                            <h2>11. Modifications to Terms</h2>
                            <p>
                                We reserve the right to modify these Terms and Conditions at any time. Changes will be effective
                                immediately upon posting on our website. Your continued use of the website after changes constitutes
                                acceptance of the modified terms.
                            </p>
                        </section>

                        {/* Governing Law */}
                        <section className="terms-section">
                            <h2>12. Governing Law</h2>
                            <p>
                                These Terms and Conditions are governed by and construed in accordance with the laws of Nepal.
                                Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Nepal.
                            </p>
                        </section>

                        {/* Contact Information */}
                        <section className="terms-section">
                            <h2>13. Contact Us</h2>
                            <p>
                                If you have any questions or concerns about these Terms and Conditions, please contact us:
                            </p>
                            <div className="contact-info">
                                <p><strong>Email:</strong> support@sinduregharifurniture.shop</p>
                                <p><strong>Phone:</strong> +977 1234567890</p>
                                <p><strong>Address:</strong> Kathmandu, Nepal</p>
                                <p><strong>Business Hours:</strong> Sunday - Friday, 9:00 AM - 6:00 PM</p>
                            </div>
                        </section>

                        {/* Acceptance */}
                        <section className="terms-section acceptance-section">
                            <p className="acceptance-text">
                                By using our website and purchasing our products, you acknowledge that you have read, understood,
                                and agree to be bound by these Terms and Conditions.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsConditions;
