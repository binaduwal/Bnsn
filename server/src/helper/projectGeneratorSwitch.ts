import { deepSeekService } from "../services/deepseek";
import { articleService } from "../services/projectService/articleService";
import { emailService } from "../services/projectService/emailService";
import { landingPageService } from "../services/projectService/landingPageService";
import { linkedInProfileService } from "../services/projectService/linkedInProfileService";
import { pressReleaseService } from "../services/projectService/pressReleaseService";
import { vslPageService } from "../services/projectService/vslService";
import { webPageService } from "../services/projectService/webPageService";
import { Response } from "express";

interface Props {
    blueprintValues: {
        title: any;
        values: any;
    }[],
    fieldValue: {
        key: string;
        value: string[];
    }[],
    res: Response,
    title: string
}

export const generatedContent = async ({ blueprintValues, fieldValue, res, title }: Props) => {
    let aiGeneratedContent;
    switch (title) {

        case "Content Email Generator":
            // Use streaming version with progress callback
            aiGeneratedContent = await emailService.generateEmailStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;

        case "Article Generator":
            aiGeneratedContent = await articleService.generateArticleStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;

        case "Landing Page Generator":
            aiGeneratedContent = await landingPageService.generateLandingPageStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;

        case "Thank You Page Generator":
            aiGeneratedContent = await deepSeekService.generateThankYouPageStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;

        case "Story":
            aiGeneratedContent = await vslPageService.generateVSLScriptStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;

        case "Ad Generator":
            aiGeneratedContent = await deepSeekService.generateAdCopyStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;


        case "Simple Home Page":
            aiGeneratedContent = await webPageService.generateHomePageStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;

        case "Simple About The CEO Page":
            aiGeneratedContent = await webPageService.generateAboutCeoPageStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;

        case "Features Generator":
            aiGeneratedContent = await webPageService.generateFeaturesPageStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;

        case "Services Generator":
            aiGeneratedContent = await webPageService.generateServicePageStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;




        case "Press Release Generator":
            aiGeneratedContent = await pressReleaseService.generatePressReleaseStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;



        case "USP + Testimonials":
            aiGeneratedContent = await linkedInProfileService.generateLinkedInEntrepreneurProfileStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;

        case "What We Do + Biggest Achievement":
            aiGeneratedContent = await linkedInProfileService.generateLinkedInWhatWeDoProfileStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;
        case "Other Achievements":
            aiGeneratedContent = await linkedInProfileService.generateLinkedInOtherAchievementsProfileStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;
        // change 

        case "Headline: Skills Based":
            aiGeneratedContent = await linkedInProfileService.generateLinkedInSkillsBasedProfileStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;
        case "Headline: Experience Based":
            aiGeneratedContent = await linkedInProfileService.generateLinkedInExperienceBasedProfileStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;
        case "Headline: Benefits Based":
            aiGeneratedContent = await linkedInProfileService.generateLinkedInBenefitsBasedProfileStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;
        case "Personal Profile Generator":
            aiGeneratedContent = await linkedInProfileService.generatePersonalLinkedInProfileStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;
        case "General Profile Generator":
            aiGeneratedContent = await linkedInProfileService.generateLinkedInGeneralProfileStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
                    // Stream AI content chunks as they arrive
                    res.write(
                        JSON.stringify({
                            type: "ai_chunk",
                            content: chunk,
                            progress: 85,
                        }) + "\n"
                    );
                }
            );
            break;



        default:
            aiGeneratedContent = null
            break;
    }

    return aiGeneratedContent
}