import React from 'react';
import { Helmet } from 'react-helmet';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy - Bishwokarma Furniture</title>
                <meta name="description" content="Privacy Policy for Bishwokarma Furniture. Learn how we collect, use, and protect your personal information." />
            </Helmet>

            <div className="privacy-policy-page">
                <div className="privacy-policy-container">
                    {/* Header */}
                    <div className="privacy-policy-header">
                        <h1>Privacy Policy</h1>
                        <p className="last-updated">Last Updated: December 12, 2024</p>
                    </div>

                    {/* Content */}
                    <div className="privacy-policy-content">
                        {/* Introduction */}
                        <section className="policy-section">
                            <h2>1. Introduction</h2>
                            <p>
                                Welcome to Bishwokarma Furniture. We respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you about how we look after your personal data when you visit our website
                                and tell you about your privacy rights and how the law protects you.
                            </p>
                        </section>

                        {/* Information We Collect */}
                        <section className="policy-section">
                            <h2>2. Information We Collect</h2>
                            <p>We may collect, use, store, and transfer different kinds of personal data about you:</p>
                            <ul>
                                <li><strong>Identity Data:</strong> Name, username, or similar identifier</li>
                                <li><strong>Contact Data:</strong> Email address, telephone numbers, and billing/delivery address</li>
                                <li><strong>Transaction Data:</strong> Details about payments and products purchased from us</li>
                                <li><strong>Technical Data:</strong> IP address, browser type and version, time zone setting, and location</li>
                                <li><strong>Usage Data:</strong> Information about how you use our website and services</li>
                                <li><strong>Marketing Data:</strong> Your preferences in receiving marketing from us</li>
                            </ul>
                        </section>

                        {/* How We Use Your Information */}
                        <section className="policy-section">
                            <h2>3. How We Use Your Information</h2>
                            <p>We use your personal data for the following purposes:</p>
                            <ul>
                                <li>To process and deliver your orders</li>
                                <li>To manage payments, fees, and charges</li>
                                <li>To communicate with you about your orders and our services</li>
                                <li>To provide customer support</li>
                                <li>To send you marketing communications (with your consent)</li>
                                <li>To improve our website, products, and services</li>
                                <li>To protect against fraud and malicious activities</li>
                            </ul>
                        </section>

                        {/* Data Security */}
                        <section className="policy-section">
                            <h2>4. Data Security</h2>
                            <p>
                                We have implemented appropriate security measures to prevent your personal data from being accidentally lost,
                                used, or accessed in an unauthorized way. We limit access to your personal data to those employees, agents,
                                contractors, and other third parties who have a business need to know.
                            </p>
                        </section>

                        {/* Data Retention */}
                        <section className="policy-section">
                            <h2>5. Data Retention</h2>
                            <p>
                                We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for,
                                including for the purposes of satisfying any legal, accounting, or reporting requirements.
                            </p>
                        </section>

                        {/* Your Legal Rights */}
                        <section className="policy-section">
                            <h2>6. Your Legal Rights</h2>
                            <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data:</p>
                            <ul>
                                <li>Request access to your personal data</li>
                                <li>Request correction of your personal data</li>
                                <li>Request erasure of your personal data</li>
                                <li>Object to processing of your personal data</li>
                                <li>Request restriction of processing your personal data</li>
                                <li>Request transfer of your personal data</li>
                                <li>Right to withdraw consent</li>
                            </ul>
                        </section>

                        {/* Cookies */}
                        <section className="policy-section">
                            <h2>7. Cookies</h2>
                            <p>
                                We use cookies and similar tracking technologies to track activity on our website and store certain information.
                                Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct
                                your browser to refuse all cookies or to indicate when a cookie is being sent.
                            </p>
                        </section>

                        {/* Third-Party Links */}
                        <section className="policy-section">
                            <h2>8. Third-Party Links</h2>
                            <p>
                                Our website may include links to third-party websites, plug-ins, and applications. Clicking on those links or
                                enabling those connections may allow third parties to collect or share data about you. We do not control these
                                third-party websites and are not responsible for their privacy statements.
                            </p>
                        </section>

                        {/* Contact Us */}
                        <section className="policy-section">
                            <h2>9. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
                            </p>
                            <div className="contact-info">
                                <p><strong>Email:</strong> privacy@sinduregharifurniture.shop</p>
                                <p><strong>Phone:</strong> +977 1234567890</p>
                                <p><strong>Address:</strong> Kathmandu, Nepal</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
