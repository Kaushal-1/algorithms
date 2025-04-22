
import { jsPDF } from 'jspdf';
import { Roadmap } from '@/components/RoadmapDisplay';
import { toast } from 'sonner';

export const generateRoadmapPdf = (roadmap: Roadmap) => {
  const doc = new jsPDF();
  let yPosition = 20;
  
  // Title
  doc.setFontSize(20);
  doc.text(`Learning Roadmap: ${roadmap.topic}`, 20, yPosition);
  yPosition += 10;
  
  // Experience Level
  doc.setFontSize(12);
  doc.text(`Experience Level: ${roadmap.experience}`, 20, yPosition);
  yPosition += 15;
  
  // Roadmap Steps
  doc.setFontSize(16);
  doc.text('Roadmap Steps:', 20, yPosition);
  yPosition += 10;
  
  // Add each step
  roadmap.steps.forEach((step, index) => {
    doc.setFontSize(14);
    doc.text(`Step ${step.step}: ${step.title}`, 20, yPosition);
    yPosition += 7;
    
    doc.setFontSize(10);
    
    const descriptionLines = doc.splitTextToSize(step.description, 170);
    doc.text(descriptionLines, 25, yPosition);
    yPosition += 10 + (descriptionLines.length - 1) * 5;
    
    if (step.detailedContent && step.detailedContent.length > 0) {
      doc.setFontSize(12);
      doc.text('Detailed Content:', 25, yPosition);
      yPosition += 7;
      
      step.detailedContent.forEach((chapter) => {
        doc.setFontSize(11);
        
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(chapter.title, 30, yPosition);
        yPosition += 7;
        
        chapter.sections.forEach((section) => {
          doc.setFontSize(10);
          
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.text(section.title, 35, yPosition);
          yPosition += 5;
          
          section.items.forEach((item) => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            
            doc.text(`• ${item}`, 40, yPosition);
            yPosition += 5;
          });
          
          yPosition += 2;
        });
        
        yPosition += 5;
      });
    }
    
    yPosition += 5;
    
    if (yPosition > 250 && index < roadmap.steps.length - 1) {
      doc.addPage();
      yPosition = 20;
    }
  });
  
  doc.save(`${roadmap.topic.replace(/\s+/g, '_')}_roadmap.pdf`);
  toast.success('PDF successfully downloaded!');
};
