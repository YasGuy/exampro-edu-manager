
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const ExamCalendar = () => {
  const { exams, modules } = useData();

  const getModuleName = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    return module ? module.name : 'Module inconnu';
  };

  const getModuleCode = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    return module ? module.code : '';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sortedExams = [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-[#1E293B] font-inter font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendrier des Examens
        </CardTitle>
        <CardDescription className="text-[#6B7280] font-inter">
          Planning de tous les examens programmés
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedExams.length === 0 ? (
            <p className="text-[#6B7280] font-inter text-center py-4">
              Aucun examen programmé pour le moment
            </p>
          ) : (
            sortedExams.map((exam) => (
              <div 
                key={exam.id} 
                className="p-4 border rounded-lg bg-[#F9FAFB] hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#111827] font-inter">
                      {getModuleName(exam.moduleId)}
                    </h4>
                    <p className="text-sm text-[#6B7280] font-inter mb-2">
                      Code: {getModuleCode(exam.moduleId)}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-[#6B7280]">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className="font-inter">{formatDate(exam.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="font-inter">{exam.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="font-inter">{exam.room}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Badge 
                    variant={exam.status === 'a-venir' ? 'default' : 'secondary'}
                    className="font-inter"
                  >
                    {exam.status === 'a-venir' ? 'À venir' : 'Terminé'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamCalendar;
