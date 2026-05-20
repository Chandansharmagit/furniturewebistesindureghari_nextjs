import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-content">
        <header className="privacy-header">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <section className="privacy-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Sindureghari Furniture ("we," "our," or "us"). We are committed to protecting your privacy 
            and ensuring the security of your personal information. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
        </section>

        <section className="privacy-section">
          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Personal Information</h3>
          <p>We may collect the following personal information:</p>
          <ul>
            <li>Name and contact information (email address, phone number, mailing address)</li>
            <li>Account credentials (username, password)</li>
            <li>Payment information (credit card details, billing address)</li>
            <li>Order history and preferences</li>
            <li>Customer service communications</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <p>When you visit our website, we automatically collect:</p>
          <ul>
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent on our site</li>
            <li>Products viewed and interactions</li>
            <li>Search queries and browsing patterns</li>
            <li>Session information and cookies</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use your information for the following purposes:</p>
          <ul>
            <li><strong>Order Processing:</strong> To process and fulfill your orders, including payment processing and shipping</li>
            <li><strong>Account Management:</strong> To create and manage your account, provide customer support</li>
            <li><strong>Personalization:</strong> To provide personalized product recommendations and improve your shopping experience</li>
            <li><strong>Communication:</strong> To send order updates, promotional offers, and important notices</li>
            <li><strong>Analytics:</strong> To analyze website usage, improve our services, and optimize user experience</li>
            <li><strong>Security:</strong> To protect against fraud, unauthorized access, and other security threats</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>4. Cookies and Tracking Technologies</h2>
          
          <h3>4.1 Types of Cookies We Use</h3>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for basic website functionality, shopping cart, and user authentication</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
            <li><strong>Personalization Cookies:</strong> Enable personalized content and product recommendations</li>
            <li><strong>Session Cookies:</strong> Track your session for security and to maintain preferences</li>
          </ul>

          <h3>4.2 Managing Cookies</h3>
          <p>
            You can control cookies through your browser settings. However, disabling certain cookies may 
            affect website functionality. You can also manage your cookie preferences through our cookie 
            consent banner when you first visit our site.
          </p>
        </section>

        <section className="privacy-section">
          <h2>5. Information Sharing and Disclosure</h2>
          <p>We may share your information in the following circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in our operations</li>
            <li><strong>Payment Processors:</strong> With payment processing companies to handle transactions</li>
            <li><strong>Shipping Partners:</strong> With shipping companies to deliver your orders</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
          <p>
            We do not sell, rent, or trade your personal information to third parties for their marketing purposes.
          </p>
        </section>

        <section className="privacy-section">
          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal 
            information against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul>
            <li>Encryption of sensitive data in transit and at rest</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and authentication measures</li>
            <li>Employee training on data protection</li>
            <li>Secure payment processing systems</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>7. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
            Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer 
            need your information, we will securely delete or anonymize it.
          </p>
        </section>

        <section className="privacy-section">
          <h2>8. Your Rights and Choices</h2>
          <p>You have the following rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request access to your personal information we hold</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Cookie Control:</strong> Manage your cookie preferences</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information provided in the "Contact Us" section.
          </p>
        </section>

        <section className="privacy-section">
          <h2>9. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the privacy 
            practices or content of these external sites. We encourage you to review the privacy policies 
            of any third-party sites you visit.
          </p>
        </section>

        <section className="privacy-section">
          <h2>10. Children's Privacy</h2>
          <p>
            Our services are not intended for children under the age of 13. We do not knowingly collect 
            personal information from children under 13. If we become aware that we have collected personal 
            information from a child under 13, we will take steps to delete such information.
          </p>
        </section>

        <section className="privacy-section">
          <h2>11. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. We ensure 
            that such transfers are conducted in accordance with applicable data protection laws and that 
            appropriate safeguards are in place.
          </p>
        </section>

        <section className="privacy-section">
          <h2>12. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or 
            applicable laws. We will notify you of any material changes by posting the updated policy on 
            our website and updating the "Last updated" date.
          </p>
        </section>

        <section className="privacy-section">
          <h2>13. Contact Us</h2>
          <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
          <div className="contact-info">
            <p><strong>Sindureghari Furniture</strong></p>
            <p>Email: support@sinduregharifurniture.shop</p>
            <p>Phone: +977-9855040000</p>
            <p>Address: Showroom Highway Road, Chandrapur, Rautahat, Nepal</p>
          </div>
        </section>

        <footer className="privacy-footer">
          <p>
            By using our website and services, you acknowledge that you have read and understood this 
            Privacy Policy and agree to the collection, use, and disclosure of your information as described herein.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;