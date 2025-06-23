import { Play, Clock, Calendar } from 'lucide-react';
import type { Podcast } from '../data/mockData';

interface PodcastCardProps {
  podcast: Podcast;
}

const PodcastCard = ({ podcast }: PodcastCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="relative">
        <img
          src={podcast.imageUrl}
          alt={podcast.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <button className="bg-blue-600 hover:bg-blue-700 rounded-full p-4 transition-colors">
            <Play className="h-8 w-8 text-white fill-current" />
          </button>
        </div>
        <div className="absolute top-4 left-4">
          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Ep. {podcast.episode}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-white mb-2 line-clamp-2">
          {podcast.title}
        </h3>
        
        <p className="text-blue-400 font-medium mb-3 text-sm">
          {podcast.guest}
        </p>
        
        <p className="text-gray-400 mb-4 line-clamp-3 text-sm">
          {podcast.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{podcast.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(podcast.publishedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastCard; 