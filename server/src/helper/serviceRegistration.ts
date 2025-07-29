import { serviceRegistryManager } from "./serviceRegistry";
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

// Register all services with the registry manager
export const registerAllServices = () => {
    // Email Services
    serviceRegistryManager.registerBatch([
        {
            title: "Content Email Generator",
            service: emailService,
            method: "generateEmailStream",
            category: "Email",
            description: "Generate content marketing emails"
        },
        {
            title: "Promotional Email Generator",
            service: emailService,
            method: "generatePromotionalEmailStream",
            category: "Email",
            description: "Generate promotional sales emails"
        }
    ]);

    // Article Services
    serviceRegistryManager.registerBatch([
        {
            title: "Article Generator",
            service: articleService,
            method: "generateArticleStream",
            category: "Articles",
            description: "Generate SEO-optimized articles"
        }
    ]);

    // Landing Page Services
    serviceRegistryManager.registerBatch([
        {
            title: "Landing Page Generator",
            service: landingPageService,
            method: "generateLandingPageStream",
            category: "Landing Pages",
            description: "Generate high-converting landing pages"
        }
    ]);

    // Thank You Page Services
    serviceRegistryManager.registerBatch([
        {
            title: "Thank You Page Generator",
            service: deepSeekService,
            method: "generateThankYouPageStream",
            category: "Thank You Pages",
            description: "Generate thank you pages"
        }
    ]);

    // VSL Services
    serviceRegistryManager.registerBatch([
        {
            title: "Story",
            service: vslPageService,
            method: "generateVSLScriptStream",
            category: "VSLs (Long Form)",
            description: "Generate VSL scripts"
        },
        {
            title: "Lead",
            service: vslPageService,
            method: "generateVSLScriptStream",
            category: "VSLs (Long Form)",
            description: "Generate VSL scripts"
        },

        {
            title: "Lead Generator",
            service: vslPageService,
            method: "generateVslTslLeadStream",
            category: "Leads (VSLs & TSLs)",
            description: "Generate VSL scripts"
        },

        {
            title: "Lead",
            service: vslPageService,
            method: "generateMiniVslLeadStream",
            category: "VSLs (Mini)",
            description: "Generate VSL scripts"
        },
        {
            title: "Close",
            service: vslPageService,
            method: "generateMiniVslLeadStream",
            category: "VSLs (Mini)",
            description: "Generate VSL scripts"
        },

        //changes
        {
            title: "Problem",
            service: vslPageService,
            method: "generateVSLScriptStreamDynamic",
            category: "VSLs (Long Form)",
            description: "Generate VSL scripts"
        }, {
            title: "Solution",
            service: vslPageService,
            method: "generateVSLScriptStreamDynamic",
            category: "VSLs (Long Form)",
            description: "Generate VSL scripts"
        }, {
            title: "Offer",
            service: vslPageService,
            method: "generateVSLScriptStreamDynamic",
            category: "VSLs (Long Form)",
            description: "Generate VSL scripts"
        }, {
            title: "Features",
            service: vslPageService,
            method: "generateVSLScriptStreamDynamic",
            category: "VSLs (Long Form)",
            description: "Generate VSL scripts"
        }, {
            title: "Objections",
            service: vslPageService,
            method: "generateVSLScriptStreamDynamic",
            category: "VSLs (Long Form)",
            description: "Generate VSL scripts"
        }, {
            title: "Testimonials",
            service: vslPageService,
            method: "generateVSLScriptStreamDynamic",
            category: "VSLs (Long Form)",
            description: "Generate VSL scripts"
        },
        {
            title: "Price",
            service: vslPageService,
            method: "generateVSLScriptStreamDynamic",
            category: "VSLs (Long Form)",
            description: "Generate VSL scripts"
        }, {
            title: "Bonuses",
            service: vslPageService,
            method: "generateVSLScriptStreamDynamic",
            category: "VSLs (Long Form)",
            description: "Generate VSL scripts"
        }, {
            title: "Guarantee",
            service: vslPageService,
            method: "generateVSLScriptStreamDynamic",
            category: "VSLs (Long Form)",
            description: "Generate VSL scripts"
        },
        {
            title: "Close",
            service: vslPageService,
            method: "generateVSLScriptStreamDynamic",
            category: "VSLs (Long Form)",
            description: "Generate VSL scripts"
        },
    ]);

    // Ad Services - Example of category-specific services with category ID and main category title
    serviceRegistryManager.registerBatch([
        {
            title: "Ad Generator",
            service: deepSeekService,
            method: "generateAdCopyStream",
            category: "Ads",
            description: "Generate ad copy for e-commerce"
        },

    ]);

    // Web Page Services
    serviceRegistryManager.registerBatch([
        {
            title: "Simple Home Page",
            service: webPageService,
            method: "generateHomePageStream",
            category: "Website Pages",
            description: "Generate simple home pages"
        },
        {
            title: "Simple About The CEO Page",
            service: webPageService,
            method: "generateAboutCeoPageStream",
            category: "Website Pages",
            description: "Generate about CEO pages"
        },
        {
            title: "Features Generator",
            service: webPageService,
            method: "generateFeaturesPageStream",
            category: "Website Pages",
            description: "Generate features pages"
        },
        {
            title: "Services Generator",
            service: webPageService,
            method: "generateServicePageStream",
            category: "Website Pages",
            description: "Generate service pages"
        }
    ]);

    // Press Release Services
    serviceRegistryManager.registerBatch([
        {
            title: "Press Release Generator",
            service: pressReleaseService,
            method: "generatePressReleaseStream",
            category: "Press Releases",
            description: "Generate press releases"
        }
    ]);

    // LinkedIn Profile Services
    serviceRegistryManager.registerBatch([
        {
            title: "USP + Testimonials",
            service: linkedInProfileService,
            method: "generateLinkedInEntrepreneurProfileStream",
            category: "LinkedIn Profiles",
            description: "Generate USP and testimonials for LinkedIn"
        },
        {
            title: "What We Do + Biggest Achievement",
            service: linkedInProfileService,
            method: "generateLinkedInWhatWeDoProfileStream",
            category: "LinkedIn Profiles",
            description: "Generate what we do and achievements for LinkedIn"
        },
        {
            title: "Other Achievements",
            service: linkedInProfileService,
            method: "generateLinkedInOtherAchievementsProfileStream",
            category: "LinkedIn Profiles",
            description: "Generate other achievements for LinkedIn"
        },
        {
            title: "Headline: Skills Based",
            service: linkedInProfileService,
            method: "generateLinkedInSkillsBasedProfileStream",
            category: "LinkedIn Profiles",
            description: "Generate skills-based LinkedIn headlines"
        },
        {
            title: "Headline: Experience Based",
            service: linkedInProfileService,
            method: "generateLinkedInExperienceBasedProfileStream",
            category: "LinkedIn Profiles",
            description: "Generate experience-based LinkedIn headlines"
        },
        {
            title: "Headline: Benefits Based",
            service: linkedInProfileService,
            method: "generateLinkedInBenefitsBasedProfileStream",
            category: "LinkedIn Profiles",
            description: "Generate benefits-based LinkedIn headlines"
        },
        {
            title: "Personal Profile Generator",
            service: linkedInProfileService,
            method: "generatePersonalLinkedInProfileStream",
            category: "LinkedIn Profiles",
            description: "Generate personal LinkedIn profiles"
        },
        {
            title: "General Profile Generator",
            service: linkedInProfileService,
            method: "generateLinkedInGeneralProfileStream",
            category: "LinkedIn Profiles",
            description: "Generate general LinkedIn profiles"
        }
    ]);

    // Sales Funnel Services
    serviceRegistryManager.registerBatch([
        {
            title: "Presell Intro",
            service: salesFunnelService,
            method: "generatePresellIntroStream",
            category: "Sales Funnel",
            description: "Generate presell introductions"
        },
        {
            title: "Presell Steps",
            service: salesFunnelService,
            method: "generatePresellStepsStream",
            category: "Sales Funnel",
            description: "Generate presell steps"
        },
        {
            title: "Presell Offer Tease",
            service: salesFunnelService,
            method: "generatePresellTeaseStream",
            category: "Sales Funnel",
            description: "Generate presell offer teases"
        },
        {
            title: "Lead",
            service: salesFunnelService,
            method: "generateSalesFunnelLeadStream",
            category: "Sales Funnel",
            description: "Generate sales funnel leads"
        },
        {
            title: "False Solutions",
            service: salesFunnelService,
            method: "generateFalseSolutionsStream",
            category: "Sales Funnel",
            description: "Generate false solutions content"
        },
        {
            title: "Real Solutions",
            service: salesFunnelService,
            method: "generateRealSolutionStream",
            category: "Sales Funnel",
            description: "Generate real solutions content"
        },
        {
            title: "Solution Parts",
            service: salesFunnelService,
            method: "generateSolutionStream",
            category: "Sales Funnel",
            description: "Generate solution parts content"
        },
        {
            title: "Overcome Objections",
            service: salesFunnelService,
            method: "generateObjectionHandlerStream",
            category: "Sales Funnel",
            description: "Generate objection handling content"
        },
        {
            title: "Offer Introduction",
            service: salesFunnelService,
            method: "generateOfferIntroStream",
            category: "Sales Funnel",
            description: "Generate offer introductions"
        },
        {
            title: "Testimonials",
            service: salesFunnelService,
            method: "generateTestimonialsStream",
            category: "Sales Funnel",
            description: "Generate testimonials"
        },
        {
            title: "Price + Guarantee",
            service: salesFunnelService,
            method: "generatePriceAndGuaranteeStream",
            category: "Sales Funnel",
            description: "Generate price and guarantee content"
        },
        {
            title: "Bonuses",
            service: salesFunnelService,
            method: "generateBonusesStream",
            category: "Sales Funnel",
            description: "Generate bonuses content"
        },
        {
            title: "Close",
            service: salesFunnelService,
            method: "generateCloseStream",
            category: "Sales Funnel",
            description: "Generate closing content"
        }
    ]);

    // Sales Page Funnel Services
    serviceRegistryManager.registerBatch([
        {
            title: "Ad Generator",
            service: deepSeekService,
            method: "generateAdCopyStream",
            category: "Sales Page Funnel",
            description: "Generate ad copy for e-commerce"
        },

        {
            title: "Presell Intro",
            service: salesFunnelService,
            method: "generatePresellIntroStream",
            category: "Sales Page Funnel",
            description: "Generate presell introductions"
        },
        {
            title: "Presell Steps",
            service: salesFunnelService,
            method: "generatePresellStepsStream",
            category: "Sales Page Funnel",
            description: "Generate presell steps"
        },
        {
            title: "Presell Offer Tease",
            service: salesFunnelService,
            method: "generatePresellTeaseStream",
            category: "Sales Page Funnel",
            description: "Generate presell offer teases"
        },
        {
            title: "Lead",
            service: salesFunnelService,
            method: "generateSalesFunnelLeadStream",
            category: "Sales Page Funnel",
            description: "Generate sales funnel leads"
        },
        {
            title: "False Solutions",
            service: salesFunnelService,
            method: "generateFalseSolutionsStream",
            category: "Sales Page Funnel",
            description: "Generate false solutions content"
        },
        {
            title: "Real Solutions",
            service: salesFunnelService,
            method: "generateRealSolutionStream",
            category: "Sales Page Funnel",
            description: "Generate real solutions content"
        },
        {
            title: "Solution Parts",
            service: salesFunnelService,
            method: "generateSolutionStream",
            category: "Sales Page Funnel",
            description: "Generate solution parts content"
        },
        {
            title: "Overcome Objections",
            service: salesFunnelService,
            method: "generateObjectionHandlerStream",
            category: "Sales Page Funnel",
            description: "Generate objection handling content"
        },
        {
            title: "Offer Introduction",
            service: salesFunnelService,
            method: "generateOfferIntroStream",
            category: "Sales Page Funnel",
            description: "Generate offer introductions"
        },
        {
            title: "Testimonials",
            service: salesFunnelService,
            method: "generateTestimonialsStream",
            category: "Sales Page Funnel",
            description: "Generate testimonials"
        },
        {
            title: "Price + Guarantee",
            service: salesFunnelService,
            method: "generatePriceAndGuaranteeStream",
            category: "Sales Page Funnel",
            description: "Generate price and guarantee content"
        },
        {
            title: "Bonuses",
            service: salesFunnelService,
            method: "generateBonusesStream",
            category: "Sales Page Funnel",
            description: "Generate bonuses content"
        },
        {
            title: "Close",
            service: salesFunnelService,
            method: "generateCloseStream",
            category: "Sales Page Funnel",
            description: "Generate closing content"
        },
        {
            title: "Content Email Generator",
            service: emailService,
            method: "generateEmailStream",
            category: "Sales Page Funnel",
            description: "Generate content marketing emails"
        },
        {
            title: "Promotional Email Generator",
            service: emailService,
            method: "generatePromotionalEmailStream",
            category: "Sales Page Funnel",
            description: "Generate promotional sales emails"
        },
        {
            title: "Promotional Email Generator",
            service: emailService,
            method: "generatePromotionalEmailStream",
            category: "Sales Page Funnel",
            description: "Generate promotional sales emails"
        }
    ]);

    // Big Idea Services
    serviceRegistryManager.registerBatch([
        {
            title: "Big Idea Generator",
            service: bigideaService,
            method: "generateBigIdeaStream",
            category: "Hooks & Big Ideas",
            description: "Generate big ideas"
        },
        {
            title: "Setup",
            service: bigideaService,
            method: "generateLeadHookSetupStream",
            category: "Hooks & Big Ideas",
            description: "Generate lead hook setup"
        },
        {
            title: "Lead Hook Generator (Tame)",
            service: bigideaService,
            method: "generateLeadHookTameStream",
            category: "Hooks & Big Ideas",
            description: "Generate tame lead hooks"
        },
        {
            title: "Lead Hook Generator (Wild)",
            service: bigideaService,
            method: "generateLeadHookWildStream",
            category: "Hooks & Big Ideas",
            description: "Generate wild lead hooks"
        }
    ]);

    // Opt-in Page Services
    serviceRegistryManager.registerBatch([
        {
            title: "Opt-in Page Version 1",
            service: optInPageService,
            method: "generateOptInPageV1Stream",
            category: "Opt-In Pages",
            description: "Generate opt-in page version 1"
        },
        {
            title: "Opt-in Page Version 2",
            service: optInPageService,
            method: "generateOptInPageV2Stream",
            category: "Opt-In Pages",
            description: "Generate opt-in page version 2"
        }
    ]);

    // Book Services
    serviceRegistryManager.registerBatch([
        {
            title: "Book Idea Generator",
            service: bookService,
            method: "generateBookIdeasStream",
            category: "Book Sales Funnel",
            description: "Generate book ideas"
        },
        {
            title: "Book Idea Generator",
            service: bookService,
            method: "generateBookIdeasStream",
            category: "Book Ideas",
            description: "Generate book ideas"
        },
        {
            title: "Outline",
            service: bookService,
            method: "generateBookBuilderOutlineStream",
            category: "Book Sales Funnel",
            description: "Generate book outlines"
        },
        {
            title: "Outline",
            service: bookService,
            method: "generateBookBuilderOutlineStream",
            category: "BookBuilder Outline Data",
            description: "Generate book outlines"
        },
        {
            title: "Book Description",
            service: bookService,
            method: "generateBookDescriptionStream",
            category: "Book Sales Funnel",
            description: "Generate book descriptions"
        },
        {
            title: "Email 1",
            service: bookService,
            method: "generateBookSalesEmailStream",
            additionalParams: ["Email 1"],
            category: "Book Sales Funnel",
            description: "Generate book sales email 1"
        },
        {
            title: "Email 2",
            service: bookService,
            method: "generateBookSalesEmailStream",
            additionalParams: ["Email 2"],
            category: "Book Sales Funnel",
            description: "Generate book sales email 2"
        },
        {
            title: "Email 3",
            service: bookService,
            method: "generateBookSalesEmailStream",
            additionalParams: ["Email 3"],
            category: "Book Sales Funnel",
            description: "Generate book sales email 3"
        },
        {
            title: "Email 4",
            service: bookService,
            method: "generateBookSalesEmailStream",
            additionalParams: ["Email 4"],
            category: "Book Sales Funnel",
            description: "Generate book sales email 4"
        },
        {
            title: "Email 5",
            service: bookService,
            method: "generateBookSalesEmailStream",
            additionalParams: ["Email 5"],
            category: "Book Sales Funnel",
            description: "Generate book sales email 5"
        },
        {
            title: "Email 6",
            service: bookService,
            method: "generateBookSalesEmailStream",
            additionalParams: ["Email 6"],
            category: "Book Sales Funnel",
            description: "Generate book sales email 6"
        },
        {
            title: "Email 7",
            service: bookService,
            method: "generateBookSalesEmailStream",
            additionalParams: ["Email 7"],
            category: "Book Sales Funnel",
            description: "Generate book sales email 7"
        },
        // {
        //     title: "Ad Generator",
        //     service: deepSeekService,
        //     method: "generateAdCopyStream",
        //     category: "Book Sales Funnel",
        //     description: "Generate ad copy for SaaS"
        // },
        // {
        //     title: "Ad Generator",
        //     service: deepSeekService,
        //     method: "generateAdCopyStream",
        //     category: "Book Sales Funnel",
        //     description: "Generate generic ad copy"
        // },
        {
            title: "Ad 1",
            service: deepSeekService,
            method: "generateAdCopyStream",
            category: "Book Sales Funnel",
            description: "Generate ad copy variant 1 for e-commerce"
        },
        {
            title: "Ad 2",
            service: deepSeekService,
            method: "generateAdCopyStream",
            category: "Book Sales Funnel",
            description: "Generate ad copy variant 2 for e-commerce"
        },
        {
            title: "Ad 3",
            service: deepSeekService,
            method: "generateAdCopyStream",
            category: "Book Sales Funnel",
            description: "Generate ad copy variant 3 for e-commerce"
        },
        {
            title: "Ad 4",
            service: deepSeekService,
            method: "generateAdCopyStream",
            category: "Book Sales Funnel",

            description: "Generate ad copy variant 4 for e-commerce"
        },
        {
            title: "Ad 5",
            service: deepSeekService,
            method: "generateAdCopyStream",
            category: "Book Sales Funnel",
            description: "Generate ad copy variant 5 for e-commerce"
        },
        {
            title: "Presell Intro",
            service: salesFunnelService,
            method: "generatePresellIntroStream",
            category: "Book Sales Funnel",
            description: "Generate presell introductions"
        },
        {
            title: "Presell Steps",
            service: salesFunnelService,
            method: "generatePresellStepsStream",
            category: "Book Sales Funnel",
            description: "Generate presell steps"
        },
        {
            title: "Presell Offer Tease",
            service: salesFunnelService,
            method: "generatePresellTeaseStream",
            category: "Book Sales Funnel",
            description: "Generate presell offer teases"
        },
        {
            title: "Lead",
            service: salesFunnelService,
            method: "generateSalesFunnelLeadStream",
            category: "Book Sales Funnel",
            description: "Generate sales funnel leads"
        },
        {
            title: "False Solutions",
            service: salesFunnelService,
            method: "generateFalseSolutionsStream",
            category: "Book Sales Funnel",
            description: "Generate false solutions content"
        },
        {
            title: "Real Solution",
            service: salesFunnelService,
            method: "generateRealSolutionStream",
            category: "Book Sales Funnel",
            description: "Generate real solutions content"
        },
        {
            title: "Solution Parts",
            service: salesFunnelService,
            method: "generateSolutionStream",
            category: "Book Sales Funnel",
            description: "Generate solution parts content"
        },
        {
            title: "Overcome Objections",
            service: salesFunnelService,
            method: "generateObjectionHandlerStream",
            category: "Book Sales Funnel",
            description: "Generate objection handling content"
        },
        {
            title: "Offer Introduction",
            service: salesFunnelService,
            method: "generateOfferIntroStream",
            category: "Book Sales Funnel",
            description: "Generate offer introductions"
        },
        {
            title: "Testimonials",
            service: salesFunnelService,
            method: "generateTestimonialsStream",
            category: "Book Sales Funnel",
            description: "Generate testimonials"
        },
        {
            title: "Price + Guarantee",
            service: salesFunnelService,
            method: "generatePriceAndGuaranteeStream",
            category: "Book Sales Funnel",
            description: "Generate price and guarantee content"
        },
        {
            title: "Bonuses",
            service: salesFunnelService,
            method: "generateBonusesStream",
            category: "Book Sales Funnel",
            description: "Generate bonuses content"
        },
        {
            title: "Close",
            service: salesFunnelService,
            method: "generateCloseStream",
            category: "Book Sales Funnel",
            description: "Generate closing content"
        }

    ]);

    // Bonus Creator Services
    serviceRegistryManager.registerBatch([
        {
            title: "Bonus Creator Basic",
            service: bonusCreaterService,
            method: "generateBasicBonusIdeasStream",
            category: "Bonus Creator",
            description: "Generate basic bonus ideas"
        },
        {
            title: "Bonus Creator Advanced",
            service: bonusCreaterService,
            method: "generateAdvancedBonusIdeasStream",
            category: "Bonus Creator",
            description: "Generate advanced bonus ideas"
        }
    ]);

    // Brand Services
    serviceRegistryManager.registerBatch([
        {
            title: "Brand Generator",
            service: brandGeneratorService,
            method: "generateBrandIdentityStream",
            additionalParams: ["Brand Generator"],
            category: "Brand Creator",
            description: "Generate brand identity"
        },

    ]);

    // Upsell Services
    serviceRegistryManager.registerBatch([
        {
            title: "Upsell Generator",
            service: upsellService,
            method: "generateUpsellIdeasStream",
            category: "Upsells",
            description: "Generate upsell ideas"
        }
    ]);

    // Webinar sign-up funnel Services
    serviceRegistryManager.registerBatch([
        {
            title: "(Pre-Webinar) Ad 1",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["The 3 Things"],
            category: "Webinar Sign-up Funnel",
            description: "Generate 'The 3 Things' webinar content"
        },
        {
            title: "(Pre-Webinar) Ad 2",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Webinar Testimonials"],
            category: "Webinar Sign-up Funnel",
            description: "Generate webinar testimonials"
        },
        {
            title: "(Pre-Webinar) Ad 3",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Overcoming Objections"],
            category: "Webinar Sign-up Funnel",
            description: "Generate objection handling for webinars"
        },
        {
            title: "(Pre-Webinar) Ad 4",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Interest Is Sky-High"],
            category: "Webinar Sign-up Funnel",
            description: "Generate high interest webinar content"
        },
        {
            title: "(Pre-Webinar) Ad 5",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Bad Ideas"],
            category: "Webinar Sign-up Funnel",
            description: "Generate bad ideas webinar content"
        },
        //email
        {
            title: "(Post-Webinar) Email 1",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Bad Ideas"],
            category: "Webinar Sign-up Funnel",
            description: "Generate bad ideas webinar content"
        }, {
            title: "(Post-Webinar) Email 2",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Bad Ideas"],
            category: "Webinar Sign-up Funnel",
            description: "Generate bad ideas webinar content"
        }, {
            title: "(Post-Webinar) Email 3",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Bad Ideas"],
            category: "Webinar Sign-up Funnel",
            description: "Generate bad ideas webinar content"
        },

        {
            title: "(Pre-Webinar) Email 1",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Bad Ideas"],
            category: "Webinar Sign-up Funnel",
            description: "Generate bad ideas webinar content"
        }, {
            title: "(Pre-Webinar) Email 2",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Bad Ideas"],
            category: "Webinar Sign-up Funnel",
            description: "Generate bad ideas webinar content"
        }, {
            title: "(Pre-Webinar) Email 3",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Bad Ideas"],
            category: "Webinar Sign-up Funnel",
            description: "Generate bad ideas webinar content"
        }, {
            title: "(Pre-Webinar) Email 4",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Bad Ideas"],
            category: "Webinar Sign-up Funnel",
            description: "Generate bad ideas webinar content"
        },
        {
            title: "Registration Page",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Bad Ideas"],
            category: "Webinar Sign-up Funnel",
            description: "Generate bad ideas webinar content"
        }, {
            title: "Confirmation Page",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Bad Ideas"],
            category: "Webinar Sign-up Funnel",
            description: "Generate bad ideas webinar content"
        },


        {
            title: "(Post-Webinar) Email Followup 8: Discount",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Everything Changes Today"],
            category: "Webinar Sign-up Funnel",
            description: "Generate 'Everything Changes Today' content"
        },
        {
            title: "(Post-Webinar) Email Followup 9: Bonus",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Webinar Promises"],
            category: "Webinar Sign-up Funnel",
            description: "Generate webinar promises"
        },
        {
            title: "(Post-Webinar) Email 10: Last Call",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Why You Should Listen"],
            category: "Webinar Sign-up Funnel",
            description: "Generate 'Why You Should Listen' content"
        },

    ]);

    // webinar 
    serviceRegistryManager.registerBatch([
        {
            title: "The 3 Things",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["The 3 Things"],
            category: "Webinar",
            description: "Generate 'The 3 Things' webinar content"
        },
        {
            title: "Webinar Testimonials",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Webinar Testimonials"],
            category: "Webinar",
            description: "Generate webinar testimonials"
        },
        {
            title: "Overcoming Objections",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Overcoming Objections"],
            category: "Webinar",
            description: "Generate objection handling for webinars"
        },
        {
            title: "Interest Is Sky-High",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Interest Is Sky-High"],
            category: "Webinar",
            description: "Generate high interest webinar content"
        },
        {
            title: "Bad Ideas",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Bad Ideas"],
            category: "Webinar",
            description: "Generate bad ideas webinar content"
        },
        {
            title: "Everything Changes Today",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Everything Changes Today"],
            category: "Webinar",
            description: "Generate 'Everything Changes Today' content"
        },
        {
            title: "Webinar Promises",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Webinar Promises"],
            category: "Webinar",
            description: "Generate webinar promises"
        },
        {
            title: "Why You Should Listen",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Why You Should Listen"],
            category: "Webinar",
            description: "Generate 'Why You Should Listen' content"
        },
        {
            title: "Why Do This?",
            service: webinarService,
            method: "generateWebinarContentStream",
            additionalParams: ["Why Do This?"],
            category: "Webinar",
            description: "Generate 'Why Do This?' content"
        }
    ]);

    // Advertorial Services
    serviceRegistryManager.registerBatch([
        {
            title: "Advertorial 1 (Short)",
            service: advertorialService,
            method: "generateAdvertorialsStream",
            additionalParams: ["Advertorial 1 (Short)"],
            category: "Advertorials",
            description: "Generate short advertorial 1"
        },
        {
            title: "Advertorial 2 (Short)",
            service: advertorialService,
            method: "generateAdvertorialsStream",
            additionalParams: ["Advertorial 2 (Short)"],
            category: "Advertorials",
            description: "Generate short advertorial 2"
        },
        {
            title: "Advertorial 3 (Short)",
            service: advertorialService,
            method: "generateAdvertorialsStream",
            additionalParams: ["Advertorial 3 (Short)"],
            category: "Advertorials",
            description: "Generate short advertorial 3"
        },
        {
            title: "Advertorial 4 (Short)",
            service: advertorialService,
            method: "generateAdvertorialsStream",
            additionalParams: ["Advertorial 4 (Short)"],
            category: "Advertorials",
            description: "Generate short advertorial 4"
        },
        {
            title: "Advertorial 5 (Long)",
            service: advertorialService,
            method: "generateLongFormAdvertorialStream",
            additionalParams: ["Advertorial 5 (Long)"],
            category: "Advertorials",
            description: "Generate long form advertorial 5"
        },
        {
            title: "Advertorial 6 (Long)",
            service: advertorialService,
            method: "generateLongFormAdvertorialStream",
            additionalParams: ["Advertorial 6 (Long)"],
            category: "Advertorials",
            description: "Generate long form advertorial 6"
        }
    ]);

    // Order Bumps Services
    serviceRegistryManager.registerBatch([
        {
            title: "Order Bump Generator",
            service: orderBumpsService,
            method: "generateOrderBumpCopyStream",
            category: "Order Bumps",
            description: "Generate order bump copy"
        }
    ]);

    //book builder 

    serviceRegistryManager.registerBatch([
        {
            title: "1: Book Length",
            service: bookService,
            method: "generateBookBuilderStream",
            category: "BookBuilder",
            description: "Generate Book Builder outliner"
        },
        {
            title: "2: About Your Book",
            service: bookService,
            method: "generateBookBuilderStream",
            category: "BookBuilder",
            description: "Generate About Your Book"
        },
        {
            title: "3: Create Your Outline",
            service: bookService,
            method: "generateBookBuilderStream",
            category: "BookBuilder",
            description: "Generate Outline"
        },
        {
            title: "4: Title Your Book",
            service: bookService,
            method: "generateBookBuilderStream",
            category: "BookBuilder",
            description: "Generate Outline"
        }, {
            title: "5: Monetize Your Book",
            service: bookService,
            method: "generateBookBuilderStream",
            category: "BookBuilder",
            description: "Generate Outline"
        }, {
            title: "6: Personalize Your Book",
            service: bookService,
            method: "generateBookBuilderStream",
            category: "BookBuilder",
            description: "Generate Outline"
        },
        //write part 1
        {
            title: "Book Introduction",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Book Introduction"
        },
        {
            title: "About The Author",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Book Introduction"
        },

        // write part 1
        {
            title: "Part 1 Introduction",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 1 Introduction"
        }, {
            title: "Part 1 Explanation",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 1 Explanation"
        },
        {
            title: "Part 1 Teaching Concept 1",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 1 Teaching Concept 1"
        },
        {
            title: "Part 1 Teaching Concept 2",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 1 Teaching Concept 2"
        },
        {
            title: "Part 1 Teaching Concept 3",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 1 Teaching Concept 3"
        },
        {
            title: "Part 1 FAQ",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 1 FAQ"
        },
        {
            title: "Part 1 Recap",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 1 Recap"
        },

        //write part 2
        {
            title: "Part 2 Introduction",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 2 Introduction"
        }, {
            title: "Part 2 Explanation",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 2 Explanation"
        },
        {
            title: "Part 2 Teaching Concept 1",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 2 Teaching Concept 1"
        },
        {
            title: "Part 2 Teaching Concept 2",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 2 Teaching Concept 2"
        },
        {
            title: "Part 2 Teaching Concept 3",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 2 Teaching Concept 3"
        },
        {
            title: "Part 2 FAQ",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 2 FAQ"
        },
        {
            title: "Part 2 Recap",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 2 Recap"
        },
        //write part 3
        {
            title: "Part 3 Introduction",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 3 Introduction"
        }, {
            title: "Part 3 Explanation",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 3 Explanation"
        },
        {
            title: "Part 3 Teaching Concept 1",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 3 Teaching Concept 1"
        },
        {
            title: "Part 3 Teaching Concept 2",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 3 Teaching Concept 2"
        },
        {
            title: "Part 3 Teaching Concept 3",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 3 Teaching Concept 3"
        },
        {
            title: "Part 3 FAQ",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 3 FAQ"
        },
        {
            title: "Part 3 Recap",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 3 Recap"
        },
        //write part 4
        {
            title: "Part 4 Introduction",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 4 Introduction"
        }, {
            title: "Part 4 Explanation",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 4 Explanation"
        },
        {
            title: "Part 4 Teaching Concept 1",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 4 Teaching Concept 1"
        },
        {
            title: "Part 4 Teaching Concept 2",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 4 Teaching Concept 2"
        },
        {
            title: "Part 4 Teaching Concept 3",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 4 Teaching Concept 3"
        },
        {
            title: "Part 4 FAQ",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 4 FAQ"
        },
        {
            title: "Part 4 Recap",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 4 Recap"
        },
        //write part 5
        {
            title: "Part 5 Introduction",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 5 Introduction"
        }, {
            title: "Part 5 Explanation",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 5 Explanation"
        },
        {
            title: "Part 5 Teaching Concept 1",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 5 Teaching Concept 1"
        },
        {
            title: "Part 5 Teaching Concept 2",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 5 Teaching Concept 2"
        },
        {
            title: "Part 5 Teaching Concept 3",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 5 Teaching Concept 3"
        },
        {
            title: "Part 5 FAQ",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 5 FAQ"
        },
        {
            title: "Part 5 Recap",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Part 5 Recap"
        },
        {
            title: "Conclusion",
            service: bookService,
            method: "generateBookWritePartStream",
            category: "BookBuilder",
            description: "Generate Conclusion"
        },

        // final chapter offer
        {
            title: "Final Chapter Offer",
            service: bookService,
            method: "generateFinalChapterOfferStream",
            category: "BookBuilder",
            description: "Generate Final Chapter Offer"
        },
    ]);

    serviceRegistryManager.registerBatch([
        {
            title: "Upsell Generator",
            service: upsellService,
            method: "generateBookFunnelUpsellStream",
            category: "Book Funnel Upsells",
            description: "Generate order bump copy"
        }
    ]);

    console.log(`Registered ${serviceRegistryManager.getCount()} services across ${serviceRegistryManager.getCategories().length} categories`);
};

// Export the registry manager for use in other files
export { serviceRegistryManager }; 