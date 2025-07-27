import { deepSeekService } from "../services/deepseek";
import { advertorialService } from "../services/projectService/advertorialService";
import { articleService } from "../services/projectService/articleService";
import { bigideaService } from "../services/projectService/bigideaService";
import { bonusCreaterService } from "../services/projectService/bonusCreaterService";
import { bookService } from "../services/projectService/bookService";
import { brandGeneratorService } from "../services/projectService/brandService";
import { emailService } from "../services/projectService/emailService";
import { landingPageService } from "../services/projectService/landingPageService";
import { linkedInProfileService } from "../services/projectService/linkedInProfileService";
import { optInPageService } from "../services/projectService/optInPageService";
import { orderBumpsService } from "../services/projectService/orderBumps";
import { pressReleaseService } from "../services/projectService/pressReleaseService";
import { salesFunnelService } from "../services/projectService/salesFunnelService";
import { upsellService } from "../services/projectService/upsellService";
import { vslPageService } from "../services/projectService/vslService";
import { webinarService } from "../services/projectService/webinarService";
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

    switch (title.trim()) {
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

        case "Promotional Email Generator":
            // Use streaming version with progress callback
            aiGeneratedContent = await emailService.generatePromotionalEmailStream(
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
        case "Ad 1":
        case "Ad 2":
        case "Ad 3":
        case "Ad 4":
        case "Ad 5":

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

        case "Presell Intro":
            aiGeneratedContent = await salesFunnelService.generatePresellIntroStream(
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


        case "Presell Steps":
            aiGeneratedContent = await salesFunnelService.generatePresellStepsStream(
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

        case "Presell Offer Tease":
            aiGeneratedContent = await salesFunnelService.generatePresellTeaseStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
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

        case "Lead":
            aiGeneratedContent = await salesFunnelService.generateSalesFunnelLeadStream(
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



        case "False Solutions":
            aiGeneratedContent = await salesFunnelService.generateFalseSolutionsStream(
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

        case "Real Solutions":
            aiGeneratedContent = await salesFunnelService.generateRealSolutionStream(
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

        case "Solution Parts":
            aiGeneratedContent = await salesFunnelService.generateSolutionStream(
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

        case "Overcome Objections":
            aiGeneratedContent = await salesFunnelService.generateObjectionHandlerStream(
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

        case "Offer Introduction":
            aiGeneratedContent = await salesFunnelService.generateOfferIntroStream(
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

        case "Testimonials":
            aiGeneratedContent = await salesFunnelService.generateTestimonialsStream(
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

        case "Price + Guarantee":
            aiGeneratedContent = await salesFunnelService.generatePriceAndGuaranteeStream(
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

        case "Bonuses":
            aiGeneratedContent = await salesFunnelService.generateBonusesStream(
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


        case "Close":
            aiGeneratedContent = await salesFunnelService.generateCloseStream(
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

        case "Big Idea Generator":
            aiGeneratedContent = await bigideaService.generateBigIdeaStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
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

        case "Setup":
            aiGeneratedContent = await bigideaService.generateLeadHookSetupStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
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

        case "Lead Hook Generator (Tame)":
            aiGeneratedContent = await bigideaService.generateLeadHookTameStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
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
        case "Lead Hook Generator (Wild)":
            aiGeneratedContent = await bigideaService.generateLeadHookWildStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
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

        case "Opt-in Page Version 1":
            aiGeneratedContent = await optInPageService.generateOptInPageV1Stream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
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

        case "Opt-in Page Version 2":
            aiGeneratedContent = await optInPageService.generateOptInPageV2Stream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
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

        case "Book Idea Generator":
            aiGeneratedContent = await bookService.generateBookIdeasStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
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


        case "Outline":
            aiGeneratedContent = await bookService.generateBookBuilderOutlineStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
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

        case "Bonus Creator Basic":
            aiGeneratedContent = await bonusCreaterService.generateBasicBonusIdeasStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
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

        case "Bonus Creator Advanced":
            aiGeneratedContent = await bonusCreaterService.generateAdvancedBonusIdeasStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
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




        case "Book Description":
            aiGeneratedContent = await bookService.generateBookDescriptionStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
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

        case "Email 1":
        case "Email 2":
        case "Email 3":
        case "Email 4":
        case "Email 5":
        case "Email 6":
        case "Email 7":

            aiGeneratedContent = await bookService.generateBookSalesEmailStream(
                blueprintValues,
                fieldValue,
                title,
                (chunk: string) => {
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

        case "Brand Generator":

            aiGeneratedContent = await brandGeneratorService.generateBrandIdentityStream(
                blueprintValues,
                fieldValue,
                title,
                (chunk: string) => {
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

        case "Upsell Generator":

            aiGeneratedContent = await upsellService.generateUpsellIdeasStream(
                blueprintValues,
                fieldValue,

                (chunk: string) => {
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

        case "The 3 Things":
        case "Webinar Testimonials":
        case "Overcoming Objections":
        case "Interest Is Sky-High":
        case "Bad Ideas":
        case "Everything Changes Today":
        case "Webinar Promises":
        case "Why You Should Listen":
        case "Why Do This?":


            aiGeneratedContent = await webinarService.generateWebinarContentStream(
                title,
                blueprintValues,
                fieldValue,

                (chunk: string) => {
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


        case "Advertorial 1 (Short)":
        case "Advertorial 2 (Short)":
        case "Advertorial 3 (Short)":
        case "Advertorial 4 (Short)":


            aiGeneratedContent = await advertorialService.generateAdvertorialsStream(
                blueprintValues,
                fieldValue,
                title,
                (chunk: string) => {
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

        case "Advertorial 5 (Long)":
        case "Advertorial 6 (Long)":
            aiGeneratedContent = await advertorialService.generateLongFormAdvertorialStream(
                blueprintValues,
                fieldValue,
                title,
                (chunk: string) => {
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


        case "Order Bump Generator":
            aiGeneratedContent = await orderBumpsService.generateOrderBumpCopyStream(
                blueprintValues,
                fieldValue,
                (chunk: string) => {
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