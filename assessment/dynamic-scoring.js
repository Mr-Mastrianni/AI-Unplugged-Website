/**
 * Dynamic Scoring System
 * Provides industry-specific and context-aware scoring for the assessment
 */
class DynamicScoring {
    constructor() {
        this.industryWeights = {
            "Retail": {
                "Customer Support": 1.2,
                "Inventory Management": 1.5,
                "Sales & Marketing": 1.3,
                "Data Entry & Management": 1.0,
                "Scheduling & Calendar Management": 0.8,
                "Reporting & Analytics": 1.1,
                "Finance & Accounting": 0.9
            },
            "Healthcare": {
                "Data Entry & Management": 1.5,
                "Scheduling & Calendar Management": 1.3,
                "Reporting & Analytics": 1.4,
                "Customer Support": 1.1,
                "Inventory Management": 0.9,
                "Sales & Marketing": 0.8,
                "Finance & Accounting": 1.0
            },
            "Financial Services": {
                "Finance & Accounting": 1.5,
                "Reporting & Analytics": 1.4,
                "Data Entry & Management": 1.3,
                "Customer Support": 1.1,
                "Sales & Marketing": 1.0,
                "Scheduling & Calendar Management": 0.8,
                "Inventory Management": 0.7
            },
            "Manufacturing": {
                "Inventory Management": 1.5,
                "Reporting & Analytics": 1.3,
                "Finance & Accounting": 1.1,
                "Data Entry & Management": 1.2,
                "Scheduling & Calendar Management": 1.0,
                "Customer Support": 0.8,
                "Sales & Marketing": 0.9
            },
            "Professional Services": {
                "Customer Support": 1.4,
                "Scheduling & Calendar Management": 1.5,
                "Sales & Marketing": 1.3,
                "Reporting & Analytics": 1.2,
                "Finance & Accounting": 1.1,
                "Data Entry & Management": 1.0,
                "Inventory Management": 0.7
            },
            "Technology": {
                "Customer Support": 1.3,
                "Data Entry & Management": 1.2,
                "Reporting & Analytics": 1.5,
                "Sales & Marketing": 1.4,
                "Finance & Accounting": 1.0,
                "Scheduling & Calendar Management": 0.9,
                "Inventory Management": 0.8
            },
            "Education": {
                "Scheduling & Calendar Management": 1.5,
                "Data Entry & Management": 1.3,
                "Reporting & Analytics": 1.2,
                "Customer Support": 1.1,
                "Finance & Accounting": 1.0,
                "Sales & Marketing": 0.8,
                "Inventory Management": 0.7
            }
        };
        
        this.baseWeights = {
            processes: 0.2,
            goals: 0.15,
            dataManagement: 0.3,
            budget: 0.2,
            companyDetails: 0.15
        };
    }
    
    calculateScore(responses) {
        console.log("Calculating dynamic score based on responses:", responses);
        
        let score = 50; // Base score
        
        // Apply industry-specific weights if available
        const industry = responses[5]?.industry;
        const industryWeights = industry ? this.industryWeights[industry] : null;
        
        // Process selection score
        if (responses[1]?.processes) {
            const processes = responses[1].processes;
            let processScore = 0;
            
            processes.forEach(process => {
                // Apply industry-specific weight if available
                const weight = industryWeights && industryWeights[process] ? industryWeights[process] : 1;
                processScore += 5 * weight;
                console.log(`Process ${process} score: ${5 * weight} (weight: ${weight})`);
            });
            
            // Cap process score
            processScore = Math.min(processScore, 25);
            score += processScore * this.baseWeights.processes;
            console.log(`Total process score: ${processScore} * ${this.baseWeights.processes} = ${processScore * this.baseWeights.processes}`);
        }
        
        // Goals score
        if (responses[2]?.goals) {
            const goals = responses[2].goals;
            let goalScore = Math.min(goals.length * 5, 20);
            score += goalScore * this.baseWeights.goals;
            console.log(`Goals score: ${goalScore} * ${this.baseWeights.goals} = ${goalScore * this.baseWeights.goals}`);
        }
        
        // Data management score
        if (responses[3]?.['data-management']) {
            const dataManagement = responses[3]['data-management'];
            let dataScore = 0;
            
            switch(dataManagement) {
                case 'Structured and Centralized': dataScore = 25; break;
                case 'Somewhat Organized': dataScore = 15; break;
                case 'Manual Processes': dataScore = 5; break;
                case 'Minimal Data Collection': dataScore = -5; break;
            }
            
            score += dataScore * this.baseWeights.dataManagement;
            console.log(`Data management score: ${dataScore} * ${this.baseWeights.dataManagement} = ${dataScore * this.baseWeights.dataManagement}`);
        }
        
        // Budget score
        if (responses[4]?.budget) {
            const budget = responses[4].budget;
            let budgetScore = 0;
            
            switch(budget) {
                case 'Over $100,000': budgetScore = 15; break;
                case '$25,000 - $100,000': budgetScore = 10; break;
                case '$5,000 - $25,000': budgetScore = 5; break;
                case 'Under $5,000': budgetScore = -5; break;
            }
            
            score += budgetScore * this.baseWeights.budget;
            console.log(`Budget score: ${budgetScore} * ${this.baseWeights.budget} = ${budgetScore * this.baseWeights.budget}`);
        }
        
        // Company size score
        if (responses[5]?.['company-size']) {
            const companySize = responses[5]['company-size'];
            let companySizeScore = 0;
            
            switch(companySize) {
                case 'Over 500': companySizeScore = 10; break;
                case '201-500': companySizeScore = 8; break;
                case '51-200': companySizeScore = 5; break;
                case '11-50': companySizeScore = 3; break;
                case '1-10': companySizeScore = 0; break;
            }
            
            score += companySizeScore * this.baseWeights.companyDetails;
            console.log(`Company size score: ${companySizeScore} * ${this.baseWeights.companyDetails} = ${companySizeScore * this.baseWeights.companyDetails}`);
        }
        
        // Ensure score is between 0 and 100
        const finalScore = Math.max(0, Math.min(100, Math.round(score)));
        console.log(`Final score: ${finalScore}`);
        return finalScore;
    }
    
    getScoreInterpretation(score) {
        if (score >= 80) {
            return {
                level: "Advanced",
                description: "Your business demonstrates excellent AI readiness. You have the necessary infrastructure, data practices, and organizational readiness to implement sophisticated AI solutions that can drive significant value.",
                nextSteps: [
                    "Develop a comprehensive AI strategy aligned with business objectives",
                    "Implement advanced AI solutions across multiple business processes",
                    "Establish an AI center of excellence to drive ongoing innovation"
                ]
            };
        } else if (score >= 60) {
            return {
                level: "Prepared",
                description: "Your business shows good potential for AI adoption. With some targeted improvements to your data practices and technology infrastructure, you can successfully implement AI solutions that deliver meaningful results.",
                nextSteps: [
                    "Strengthen data management practices to maximize AI effectiveness",
                    "Implement AI solutions for your highest-priority processes",
                    "Develop internal AI capabilities through training and hiring"
                ]
            };
        } else if (score >= 40) {
            return {
                level: "Developing",
                description: "Your business has moderate readiness for AI adoption. There are several areas that need improvement before you can fully leverage AI technologies, but you can begin with simpler AI applications while building your capabilities.",
                nextSteps: [
                    "Establish more robust data collection and management practices",
                    "Start with focused AI implementations in areas with clear ROI",
                    "Develop a roadmap for improving AI readiness over time"
                ]
            };
        } else {
            return {
                level: "Foundational",
                description: "Your business has significant gaps in AI readiness. We recommend focusing on building a stronger digital foundation before implementing advanced AI solutions.",
                nextSteps: [
                    "Digitize key business processes and establish data collection systems",
                    "Implement basic automation before moving to AI-driven solutions",
                    "Develop a phased approach to building AI capabilities over time"
                ]
            };
        }
    }
}
