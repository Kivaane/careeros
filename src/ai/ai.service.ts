import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {

  getResumeFeedback(resumeText: string) {
    const suggestions: string[] = [];

    if (resumeText.length < 50) {
      suggestions.push('Resume is too short. Add more details.');
    }

    if (!resumeText.toLowerCase().includes('project')) {
      suggestions.push('Include project experience.');
    }

    if (!resumeText.toLowerCase().includes('skill')) {
      suggestions.push('Add a skills section.');
    }

    if (suggestions.length === 0) {
      suggestions.push('Resume looks good!');
    }

    return {
      suggestions,
    };
  }

  getJobMatch(resumeText: string, jobDescription: string) {
    let score = 0;

    if (resumeText.toLowerCase().includes('javascript')) score += 25;
    if (resumeText.toLowerCase().includes('node')) score += 25;
    if (resumeText.toLowerCase().includes('react')) score += 25;
    if (resumeText.toLowerCase().includes('sql')) score += 25;

    return {
      matchPercentage: score,
      message:
        score > 70
          ? 'Strong match 🚀'
          : score > 40
          ? 'Moderate match ⚡'
          : 'Weak match ❗',
    };
  }
}