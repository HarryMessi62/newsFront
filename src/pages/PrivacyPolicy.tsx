import { Shield, Eye, Lock, FileText } from 'lucide-react';
import { ukContactData } from '../data/ukData';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-primary-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-400">
            Last updated: 21 June 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-dark-200 rounded-2xl p-8 md:p-12">
          <div className="prose prose-invert max-w-none">
            
            {/* Introduction */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <FileText className="h-6 w-6 text-primary-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Introduction</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                CryptoNews UK ("we", "our", "us") respects your privacy and is committed to protecting 
                your personal data. This privacy policy explains how we collect, 
                use, store and protect your information when using our website and services.
              </p>
            </section>

            {/* Data Collection */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <Eye className="h-6 w-6 text-primary-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">What Information We Collect</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Personal Information</h3>
                  <ul className="text-gray-300 space-y-2 list-disc list-inside">
                    <li>Name and email address when subscribing to our newsletter</li>
                    <li>Comments and feedback you leave on the site</li>
                    <li>Information provided when contacting customer support</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Automatically Collected Information</h3>
                  <ul className="text-gray-300 space-y-2 list-disc list-inside">
                    <li>IP address and browser information</li>
                    <li>Data about visited pages and time spent</li>
                    <li>Device and operating system information</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Usage */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <Lock className="h-6 w-6 text-primary-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
              </div>
              <div className="text-gray-300 space-y-4">
                <p>We use the collected information for the following purposes:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Providing and improving our services</li>
                  <li>Sending newsletters and updates (with your consent)</li>
                  <li>Responding to your inquiries and providing support</li>
                  <li>Analysing site usage to improve user experience</li>
                  <li>Ensuring security and preventing fraud</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  If you have any questions about this privacy policy, please contact us:
                </p>
                <div className="bg-dark-100 rounded-lg p-6">
                  <p><strong>Email:</strong> privacy@cryptonews.uk</p>
                  <p><strong>Address:</strong> {ukContactData.company.address.street}, {ukContactData.company.address.city}, {ukContactData.company.address.postcode}</p>
                  <p><strong>Phone:</strong> {ukContactData.contact.phone}</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 