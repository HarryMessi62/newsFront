import { FileText, Calendar, Download } from 'lucide-react';
import type { Report } from '../data/mockData';

interface ReportCardProps {
  report: Report;
}

const ReportCard = ({ report }: ReportCardProps) => {
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
          src={report.imageUrl}
          alt={report.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <button className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 flex items-center space-x-2 transition-colors">
            <Download className="h-5 w-5 text-white" />
            <span className="text-white font-medium">Download</span>
          </button>
        </div>
        <div className="absolute top-4 left-4">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {report.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start space-x-3 mb-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white mb-2 line-clamp-2">
              {report.title}
            </h3>
          </div>
        </div>
        
        <p className="text-gray-400 mb-4 line-clamp-3 text-sm">
          {report.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(report.publishedAt)}</span>
          </div>
          <button className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">
            Read More →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard; 