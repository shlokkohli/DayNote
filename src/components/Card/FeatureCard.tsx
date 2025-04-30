import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-purple-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-5 hover:bg-opacity-70 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start">
        <div className="bg-purple-600 p-2 rounded-lg mr-4 text-white">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-white mb-1">{title}</h3>
          <p className="text-purple-200 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;