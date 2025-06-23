import { Users, Target, Award, Globe } from 'lucide-react';

const AboutUs = () => {
  const teamMembers = [
    {
      name: 'James Thompson',
      role: 'Editor-in-Chief',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      description: 'Blockchain technology expert with 8 years of experience in the crypto industry.'
    },
    {
      name: 'Sarah Williams',
      role: 'Lead Analyst',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      description: 'Specialist in technical analysis and cryptocurrency market trends.'
    },
    {
      name: 'Michael Davies',
      role: 'Technical Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      description: 'Blockchain solutions developer and DeFi protocols expert.'
    },
    {
      name: 'Emma Johnson',
      role: 'Journalist',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      description: 'Specialises in covering regulatory issues and institutional news.'
    }
  ];

  const stats = [
    { number: '2M+', label: 'Active Readers' },
    { number: '500+', label: 'Articles per Month' },
    { number: '50+', label: 'Countries Covered' },
    { number: '5', label: 'Years in Market' }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We are a team of experts dedicated to providing quality information 
            about cryptocurrencies and blockchain technologies
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-dark-200 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <Target className="h-8 w-8 text-primary-400 mr-3" />
                  <h2 className="text-3xl font-bold text-white">Our Mission</h2>
                </div>
                <p className="text-gray-300 text-lg mb-6">
                  To make the world of cryptocurrencies understandable and accessible to everyone. We strive to provide 
                  objective, timely and quality information that will help our readers 
                  make informed decisions in the rapidly evolving world of digital assets.
                </p>
                <p className="text-gray-300 text-lg">
                  Our goal is to become a bridge between complex blockchain technologies and ordinary users, 
                  providing educational content and relevant news.
                </p>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop"
                  alt="Team working"
                  className="rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark-200 rounded-xl p-8 text-center">
              <Award className="h-12 w-12 text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Quality</h3>
              <p className="text-gray-400">
                We carefully check every publication and work only with verified sources
              </p>
            </div>
            <div className="bg-dark-200 rounded-xl p-8 text-center">
              <Users className="h-12 w-12 text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Community</h3>
              <p className="text-gray-400">
                We build an active community of crypto enthusiasts and support open dialogue
              </p>
            </div>
            <div className="bg-dark-200 rounded-xl p-8 text-center">
              <Globe className="h-12 w-12 text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Accessibility</h3>
              <p className="text-gray-400">
                We make complex information understandable for readers with any level of knowledge
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-dark-200 rounded-xl p-6 text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-primary-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Have questions or suggestions? We are always open to communication with our readers
          </p>
          <button className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors">
            Contact Us
          </button>
        </section>
      </div>
    </div>
  );
};

export default AboutUs; 