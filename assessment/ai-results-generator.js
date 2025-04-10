/**
 * AI Results Generator
 * Creates personalized assessment results using natural language generation
 */
class AIResultsGenerator {
    constructor(userResponses, score) {
        this.userResponses = userResponses;
        this.score = score;
        this.nlgTemplates = {
            highScore: [
                "Your business shows excellent AI readiness with a score of {score}. Based on your {industry} industry focus and interest in {processes}, you're well-positioned to implement advanced AI solutions.",
                "With a readiness score of {score}, your organization demonstrates strong potential for AI adoption. Your {dataManagement} approach to data management provides a solid foundation.",
                "Congratulations! Your AI readiness score of {score} places you in the top tier of businesses prepared for AI implementation. Your {companySize} company in the {industry} sector has the right foundation for successful AI adoption."
            ],
            mediumScore: [
                "Your AI readiness score of {score} indicates good potential with some areas for improvement. As a {companySize} company in the {industry} sector, focusing on {dataManagement} would enhance your AI implementation success.",
                "With a score of {score}, your business shows promising AI readiness. Your interest in improving {processes} aligns well with current AI capabilities.",
                "Your organization scores {score} on AI readiness, showing solid potential. With your budget of {budget}, you can make strategic investments in AI solutions for {processes}."
            ],
            lowScore: [
                "Your AI readiness score of {score} suggests some foundational elements need strengthening before full AI implementation. For a {companySize} company in {industry}, we recommend starting with {dataManagement} improvements.",
                "With a score of {score}, there are opportunities to enhance your AI readiness. Given your budget of {budget}, we recommend a phased approach starting with {processes}.",
                "Your AI readiness assessment score is {score}, indicating that some preparation work would be beneficial before implementing comprehensive AI solutions. Focus first on improving your {dataManagement} practices."
            ]
        };
    }
    
    generatePersonalizedSummary() {
        console.log("Generating personalized summary with score:", this.score);
        
        // Select appropriate template based on score
        let templateCategory = "mediumScore";
        if (this.score >= 75) templateCategory = "highScore";
        else if (this.score < 50) templateCategory = "lowScore";
        
        // Select random template from category
        const templates = this.nlgTemplates[templateCategory];
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        // Fill in template with user data
        return this.fillTemplate(template, {
            score: this.score,
            industry: this.userResponses[5]?.industry || "your",
            processes: this.formatProcesses(this.userResponses[1]?.processes || []),
            dataManagement: this.userResponses[3]?.['data-management'] || "current",
            companySize: this.userResponses[5]?.['company-size'] || "your",
            budget: this.userResponses[4]?.budget || "available"
        });
    }
    
    fillTemplate(template, data) {
        let result = template;
        for (const [key, value] of Object.entries(data)) {
            result = result.replace(`{${key}}`, value);
        }
        return result;
    }
    
    formatProcesses(processes) {
        if (!processes.length) return "selected processes";
        if (processes.length === 1) return processes[0];
        if (processes.length === 2) return `${processes[0]} and ${processes[1]}`;
        
        const lastProcess = processes[processes.length - 1];
        return `${processes.slice(0, -1).join(', ')}, and ${lastProcess}`;
    }
    
    generateKeyFindings() {
        console.log("Generating key findings based on responses:", this.userResponses);
        
        const findings = [];
        
        // Process-specific findings
        if (this.userResponses[1]?.processes) {
            const processes = this.userResponses[1].processes;
            processes.forEach(process => {
                const finding = this.generateProcessFinding(process);
                if (finding) findings.push(finding);
            });
        }
        
        // Data management finding
        if (this.userResponses[3]?.['data-management']) {
            findings.push(this.generateDataManagementFinding(this.userResponses[3]['data-management']));
        }
        
        // Industry-specific finding
        if (this.userResponses[5]?.industry) {
            findings.push(this.generateIndustryFinding(this.userResponses[5].industry));
        }
        
        // Budget finding
        if (this.userResponses[4]?.budget) {
            findings.push(this.generateBudgetFinding(this.userResponses[4].budget));
        }
        
        return findings;
    }
    
    generateProcessFinding(process) {
        // Generate insight about selected processes
        const processInsights = {
            "Customer Support": "AI chatbots can reduce customer support costs by up to 30% while improving response times by 80%.",
            "Data Entry & Management": "Automated data entry can reduce errors by up to 90% and save 60-80% of processing time.",
            "Inventory Management": "AI-driven inventory management typically reduces excess inventory by 20-30% and stockouts by up to 50%.",
            "Scheduling & Calendar Management": "AI scheduling assistants can save employees an average of 5-7 hours per week on calendar management.",
            "Sales & Marketing": "AI-powered marketing automation can increase conversion rates by 30% and improve customer targeting accuracy by 40%.",
            "Reporting & Analytics": "Predictive analytics can improve forecast accuracy by 20-30% and identify new business opportunities that human analysis might miss.",
            "Finance & Accounting": "AI automation in finance can reduce processing costs by 50-70% while improving accuracy by 25-40%."
        };
        
        return processInsights[process] || `Your interest in ${process} aligns well with current AI capabilities.`;
    }
    
    generateDataManagementFinding(dataManagement) {
        const dataManagementInsights = {
            "Structured and Centralized": "Your structured and centralized data management approach provides an excellent foundation for AI implementation, potentially reducing implementation time by 40-50%.",
            "Somewhat Organized": "Your somewhat organized data approach is a good starting point. With some additional data structuring, you can maximize AI effectiveness.",
            "Manual Processes": "Transitioning from manual processes to digital systems would be a recommended first step. Organizations typically see a 30-40% efficiency gain just from this transition before AI implementation.",
            "Minimal Data Collection": "Establishing a structured data collection strategy would be essential. Companies that implement proper data collection see 25-35% better results from their AI implementations."
        };
        
        return dataManagementInsights[dataManagement] || "Your data management approach will be a key factor in your AI implementation success.";
    }
    
    generateIndustryFinding(industry) {
        const industryInsights = {
            "Retail": "Retail businesses implementing AI typically see a 15-25% increase in sales and a 20-30% reduction in inventory costs.",
            "Healthcare": "Healthcare organizations using AI report 30-40% improvements in administrative efficiency and 15-20% better patient outcomes.",
            "Financial Services": "Financial institutions using AI for fraud detection report 60-80% improvement in detection rates and 40% reduction in false positives.",
            "Manufacturing": "Manufacturing companies implementing AI for quality control and predictive maintenance see 25-35% reduction in downtime and 15-20% improvement in product quality.",
            "Professional Services": "Professional service firms using AI report 20-30% increases in billable hours and 15-25% improvements in client satisfaction.",
            "Technology": "Technology companies leveraging AI internally see 30-40% faster product development cycles and 20-25% reduction in support costs.",
            "Education": "Educational institutions using AI report 25-35% improvements in administrative efficiency and 15-20% better student engagement metrics."
        };
        
        return industryInsights[industry] || `The ${industry} industry has seen significant benefits from AI adoption in recent years.`;
    }
    
    generateBudgetFinding(budget) {
        const budgetInsights = {
            "Over $100,000": "Your substantial budget allows for comprehensive AI solutions that can transform multiple business processes simultaneously, typically yielding 300-400% ROI over three years.",
            "$25,000 - $100,000": "Your budget range is ideal for targeted AI implementations with high impact potential, typically yielding 200-300% ROI over three years.",
            "$5,000 - $25,000": "Your budget allows for focused AI applications that can address specific business needs, typically yielding 150-250% ROI over three years.",
            "Under $5,000": "With your budget, starting with smaller, focused AI applications would provide the best value, typically yielding 100-200% ROI over three years."
        };
        
        return budgetInsights[budget] || "Your budget allocation will determine the scope and impact of your AI implementation.";
    }
}
