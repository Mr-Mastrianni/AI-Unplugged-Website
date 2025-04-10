/**
 * AI ROI Calculator
 * Provides industry-specific ROI calculations based on assessment responses
 */
class AIROICalculator {
    constructor(userResponses) {
        this.userResponses = userResponses;
        this.industryBenchmarks = {
            "Retail": {
                "Customer Support": { timeSavings: 0.3, costReduction: 0.25 },
                "Inventory Management": { timeSavings: 0.2, costReduction: 0.3 },
                "Sales & Marketing": { timeSavings: 0.15, costReduction: 0.2 },
                "Data Entry & Management": { timeSavings: 0.25, costReduction: 0.2 },
                "Scheduling & Calendar Management": { timeSavings: 0.1, costReduction: 0.1 },
                "Reporting & Analytics": { timeSavings: 0.2, costReduction: 0.15 },
                "Finance & Accounting": { timeSavings: 0.2, costReduction: 0.2 }
            },
            "Healthcare": {
                "Data Entry & Management": { timeSavings: 0.4, costReduction: 0.3 },
                "Scheduling & Calendar Management": { timeSavings: 0.25, costReduction: 0.2 },
                "Reporting & Analytics": { timeSavings: 0.3, costReduction: 0.25 },
                "Customer Support": { timeSavings: 0.2, costReduction: 0.15 },
                "Inventory Management": { timeSavings: 0.15, costReduction: 0.2 },
                "Sales & Marketing": { timeSavings: 0.1, costReduction: 0.1 },
                "Finance & Accounting": { timeSavings: 0.25, costReduction: 0.2 }
            },
            "Financial Services": {
                "Finance & Accounting": { timeSavings: 0.35, costReduction: 0.3 },
                "Reporting & Analytics": { timeSavings: 0.3, costReduction: 0.25 },
                "Data Entry & Management": { timeSavings: 0.3, costReduction: 0.25 },
                "Customer Support": { timeSavings: 0.25, costReduction: 0.2 },
                "Sales & Marketing": { timeSavings: 0.2, costReduction: 0.15 },
                "Scheduling & Calendar Management": { timeSavings: 0.15, costReduction: 0.1 },
                "Inventory Management": { timeSavings: 0.1, costReduction: 0.1 }
            },
            "Manufacturing": {
                "Inventory Management": { timeSavings: 0.35, costReduction: 0.3 },
                "Reporting & Analytics": { timeSavings: 0.25, costReduction: 0.2 },
                "Finance & Accounting": { timeSavings: 0.2, costReduction: 0.2 },
                "Data Entry & Management": { timeSavings: 0.3, costReduction: 0.25 },
                "Scheduling & Calendar Management": { timeSavings: 0.2, costReduction: 0.15 },
                "Customer Support": { timeSavings: 0.15, costReduction: 0.1 },
                "Sales & Marketing": { timeSavings: 0.15, costReduction: 0.15 }
            },
            "Professional Services": {
                "Customer Support": { timeSavings: 0.3, costReduction: 0.25 },
                "Scheduling & Calendar Management": { timeSavings: 0.35, costReduction: 0.3 },
                "Sales & Marketing": { timeSavings: 0.25, costReduction: 0.2 },
                "Reporting & Analytics": { timeSavings: 0.3, costReduction: 0.25 },
                "Finance & Accounting": { timeSavings: 0.25, costReduction: 0.2 },
                "Data Entry & Management": { timeSavings: 0.3, costReduction: 0.25 },
                "Inventory Management": { timeSavings: 0.1, costReduction: 0.1 }
            },
            "Technology": {
                "Customer Support": { timeSavings: 0.3, costReduction: 0.25 },
                "Data Entry & Management": { timeSavings: 0.25, costReduction: 0.2 },
                "Reporting & Analytics": { timeSavings: 0.35, costReduction: 0.3 },
                "Sales & Marketing": { timeSavings: 0.3, costReduction: 0.25 },
                "Finance & Accounting": { timeSavings: 0.2, costReduction: 0.15 },
                "Scheduling & Calendar Management": { timeSavings: 0.2, costReduction: 0.15 },
                "Inventory Management": { timeSavings: 0.15, costReduction: 0.1 }
            },
            "Education": {
                "Scheduling & Calendar Management": { timeSavings: 0.35, costReduction: 0.3 },
                "Data Entry & Management": { timeSavings: 0.3, costReduction: 0.25 },
                "Reporting & Analytics": { timeSavings: 0.25, costReduction: 0.2 },
                "Customer Support": { timeSavings: 0.2, costReduction: 0.15 },
                "Finance & Accounting": { timeSavings: 0.2, costReduction: 0.15 },
                "Sales & Marketing": { timeSavings: 0.15, costReduction: 0.1 },
                "Inventory Management": { timeSavings: 0.1, costReduction: 0.1 }
            }
        };
        
        this.processCosts = {
            "Customer Support": { implementationCost: 15000, maintenanceCost: 500 },
            "Data Entry & Management": { implementationCost: 20000, maintenanceCost: 300 },
            "Inventory Management": { implementationCost: 25000, maintenanceCost: 400 },
            "Scheduling & Calendar Management": { implementationCost: 12000, maintenanceCost: 250 },
            "Sales & Marketing": { implementationCost: 18000, maintenanceCost: 350 },
            "Reporting & Analytics": { implementationCost: 22000, maintenanceCost: 400 },
            "Finance & Accounting": { implementationCost: 20000, maintenanceCost: 350 }
        };
    }
    
    calculateROI() {
        console.log("Calculating ROI based on user responses:", this.userResponses);
        
        const industry = this.userResponses[5]?.industry;
        const processes = this.userResponses[1]?.processes || [];
        const companySize = this.userResponses[5]?.['company-size'];
        const hourlyRate = parseFloat(document.getElementById('employee-rate')?.value) || 35;
        
        console.log(`Industry: ${industry}, Company Size: ${companySize}, Hourly Rate: ${hourlyRate}`);
        console.log(`Selected Processes: ${processes.join(', ')}`);
        
        // Estimate employee count from company size
        let employeeCount = 0;
        switch(companySize) {
            case '1-10': employeeCount = 5; break;
            case '11-50': employeeCount = 25; break;
            case '51-200': employeeCount = 100; break;
            case '201-500': employeeCount = 300; break;
            case 'Over 500': employeeCount = 750; break;
            default: employeeCount = 25;
        }
        
        console.log(`Estimated Employee Count: ${employeeCount}`);
        
        // Calculate time savings and cost reduction
        let totalTimeSavings = 0;
        let totalCostReduction = 0;
        let totalImplementationCost = 0;
        let totalMaintenanceCost = 0;
        let processDetails = [];
        
        processes.forEach(process => {
            // Get industry-specific benchmarks if available
            const benchmark = industry && this.industryBenchmarks[industry] && 
                              this.industryBenchmarks[industry][process] ? 
                              this.industryBenchmarks[industry][process] : 
                              { timeSavings: 0.15, costReduction: 0.1 };
            
            // Get process-specific costs
            const costs = this.processCosts[process] || 
                         { implementationCost: 10000, maintenanceCost: 300 };
            
            // Calculate savings based on company size
            const processTimeSavings = benchmark.timeSavings * employeeCount * 40 * 52; // Annual hours saved
            const processCostReduction = benchmark.costReduction * employeeCount * hourlyRate * 2080; // Annual cost reduction
            
            // Scale implementation cost based on company size
            const scaleFactor = this.getScaleFactor(companySize);
            const scaledImplementationCost = costs.implementationCost * scaleFactor;
            const scaledMaintenanceCost = costs.maintenanceCost * scaleFactor * 12; // Annual maintenance
            
            console.log(`Process: ${process}`);
            console.log(`  Time Savings: ${processTimeSavings} hours (${benchmark.timeSavings * 100}%)`);
            console.log(`  Cost Reduction: $${processCostReduction} (${benchmark.costReduction * 100}%)`);
            console.log(`  Implementation Cost: $${scaledImplementationCost} (scale factor: ${scaleFactor})`);
            console.log(`  Annual Maintenance: $${scaledMaintenanceCost}`);
            
            totalTimeSavings += processTimeSavings;
            totalCostReduction += processCostReduction;
            totalImplementationCost += scaledImplementationCost;
            totalMaintenanceCost += scaledMaintenanceCost;
            
            processDetails.push({
                process: process,
                timeSavings: Math.round(processTimeSavings),
                costReduction: Math.round(processCostReduction),
                implementationCost: Math.round(scaledImplementationCost),
                maintenanceCost: Math.round(scaledMaintenanceCost)
            });
        });
        
        // Calculate ROI
        const totalAnnualSavings = totalTimeSavings * hourlyRate + totalCostReduction;
        const firstYearROI = ((totalAnnualSavings - totalImplementationCost - totalMaintenanceCost) / 
                             (totalImplementationCost + totalMaintenanceCost)) * 100;
        const threeYearROI = ((totalAnnualSavings * 3 - totalImplementationCost - totalMaintenanceCost * 3) / 
                             (totalImplementationCost + totalMaintenanceCost * 3)) * 100;
        const paybackPeriod = (totalImplementationCost + totalMaintenanceCost) / (totalAnnualSavings / 12);
        
        console.log(`Total Annual Savings: $${totalAnnualSavings}`);
        console.log(`First Year ROI: ${firstYearROI}%`);
        console.log(`Three Year ROI: ${threeYearROI}%`);
        console.log(`Payback Period: ${paybackPeriod} months`);
        
        return {
            timeSavings: Math.round(totalTimeSavings),
            costReduction: Math.round(totalCostReduction),
            implementationCost: Math.round(totalImplementationCost),
            maintenanceCost: Math.round(totalMaintenanceCost),
            annualSavings: Math.round(totalAnnualSavings),
            firstYearROI: Math.round(firstYearROI),
            threeYearROI: Math.round(threeYearROI),
            paybackPeriod: Math.round(paybackPeriod),
            processDetails: processDetails
        };
    }
    
    getScaleFactor(companySize) {
        switch(companySize) {
            case '1-10': return 0.5;
            case '11-50': return 1;
            case '51-200': return 2;
            case '201-500': return 3.5;
            case 'Over 500': return 5;
            default: return 1;
        }
    }
    
    generateROIVisualization(roi) {
        // Generate HTML for ROI visualization
        return `
            <div class="roi-chart">
                <div class="roi-value">${roi.threeYearROI}%</div>
                <div class="roi-label">Estimated 3-Year ROI</div>
            </div>
            
            <div class="roi-calculation">
                <h4>AI-Enhanced ROI Analysis</h4>
                <p>Based on industry benchmarks and your specific inputs, here's a detailed ROI projection:</p>
                
                <div class="roi-formula">
                    <strong>Annual Time Savings:</strong> ${roi.timeSavings.toLocaleString()} hours<br>
                    <strong>Annual Cost Reduction:</strong> $${roi.costReduction.toLocaleString()}<br>
                    <strong>Total Annual Value:</strong> $${roi.annualSavings.toLocaleString()}<br>
                    <strong>Implementation Cost:</strong> $${roi.implementationCost.toLocaleString()}<br>
                    <strong>Annual Maintenance:</strong> $${roi.maintenanceCost.toLocaleString()}<br>
                    <strong>First Year ROI:</strong> ${roi.firstYearROI}%<br>
                    <strong>Estimated Payback Period:</strong> ${roi.paybackPeriod} months
                </div>
                
                <div class="industry-benchmark">
                    <h5>Industry Benchmarks</h5>
                    <div class="benchmark-stat">
                        <i class="fas fa-chart-line"></i>
                        <span>Companies in your industry typically achieve 25-35% efficiency gains with AI automation</span>
                    </div>
                    <div class="benchmark-stat">
                        <i class="fas fa-dollar-sign"></i>
                        <span>Average ROI for similar implementations: 250-300% over 3 years</span>
                    </div>
                </div>
                
                <p>This analysis is based on industry benchmarks for your specific sector and company size, combined with the processes you selected for AI implementation.</p>
            </div>
        `;
    }
}
