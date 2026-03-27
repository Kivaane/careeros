import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('resume-feedback')
  getResumeFeedback(@Body() body: { resumeText: string }) {
    return this.aiService.getResumeFeedback(body.resumeText);
  }

  @Post('job-match')
  getJobMatch(
    @Body()
    body: { resumeText: string; jobDescription: string },
  ) {
    return this.aiService.getJobMatch(
      body.resumeText,
      body.jobDescription,
    );
  }
}