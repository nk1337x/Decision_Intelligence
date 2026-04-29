/**
 * Decision Engine Service
 * Core logic for evaluating event planning options
 */

export const evaluateEventOption = (option, constraints, priorities, eventDetails) => {
  // Evaluate each dimension
  const feasibility = evaluateFeasibility(option, constraints, eventDetails);
  const costEfficiency = evaluateCostEfficiency(option, constraints);
  const timeEfficiency = evaluateTimeEfficiency(option, constraints);
  const spaceUtilization = evaluateSpaceUtilization(option, constraints, eventDetails);
  const experience = evaluateExperience(option, eventDetails);
  const riskScore = evaluateRisk(option, constraints);

  // Calculate weighted total score
  const totalScore = calculateWeightedScore(
    { feasibility, costEfficiency, timeEfficiency, spaceUtilization, experience, riskScore },
    priorities
  );

  return {
    feasibility: parseFloat(feasibility.toFixed(1)),
    costEfficiency: parseFloat(costEfficiency.toFixed(1)),
    timeEfficiency: parseFloat(timeEfficiency.toFixed(1)),
    spaceUtilization: parseFloat(spaceUtilization.toFixed(1)),
    experience: parseFloat(experience.toFixed(1)),
    riskScore: parseFloat(riskScore.toFixed(1)),
    total: parseFloat(totalScore.toFixed(1))
  };
};

// Evaluate feasibility based on constraints and option details
const evaluateFeasibility = (option, constraints, eventDetails) => {
  let score = 7; // Base score

  // Check if option has sufficient details
  const detailsProvided = [option.venue, option.layout, option.decoration, option.setup]
    .filter(d => d && d.trim() !== '').length;
  score += (detailsProvided / 4) * 2;

  // Adjust based on constraints
  if (constraints.space && option.venue) {
    score += Math.random() * 1.5 - 0.5; // Simulate space compatibility check
  }

  return Math.min(Math.max(score, 1), 10);
};

// Evaluate cost efficiency
const evaluateCostEfficiency = (option, constraints) => {
  let score = 6; // Base score

  // Analyze budget constraint
  if (constraints.budget) {
    const budgetLower = constraints.budget.toLowerCase();
    if (budgetLower.includes('low') || budgetLower.includes('tight')) {
      score += Math.random() * 2;
    } else if (budgetLower.includes('high') || budgetLower.includes('unlimited')) {
      score += Math.random() * 3;
    }
  }

  // Venue and setup complexity affect cost
  if (option.setup && option.setup.toLowerCase().includes('simple')) {
    score += 1.5;
  }

  return Math.min(Math.max(score, 1), 10);
};

// Evaluate time efficiency
const evaluateTimeEfficiency = (option, constraints) => {
  let score = 7; // Base score

  // Timeline constraint
  if (constraints.timeline) {
    const timelineLower = constraints.timeline.toLowerCase();
    if (timelineLower.includes('urgent') || timelineLower.includes('week')) {
      score -= Math.random() * 1.5;
    }
  }

  // Setup complexity
  if (option.setup) {
    if (option.setup.toLowerCase().includes('quick') || option.setup.toLowerCase().includes('simple')) {
      score += 2;
    } else if (option.setup.toLowerCase().includes('complex') || option.setup.toLowerCase().includes('elaborate')) {
      score -= 1;
    }
  }

  return Math.min(Math.max(score, 1), 10);
};

// Evaluate space utilization
const evaluateSpaceUtilization = (option, constraints, eventDetails) => {
  let score = 6.5; // Base score

  // Layout planning
  if (option.layout && option.layout.trim() !== '') {
    score += 1.5;
  }

  // Attendee count vs space
  if (eventDetails.attendees && constraints.space) {
    score += Math.random() * 2;
  }

  return Math.min(Math.max(score, 1), 10);
};

// Evaluate experience and impact
const evaluateExperience = (option, eventDetails) => {
  let score = 7; // Base score

  // Decoration quality
  if (option.decoration && option.decoration.trim() !== '') {
    const decorLower = option.decoration.toLowerCase();
    if (decorLower.includes('premium') || decorLower.includes('luxury') || decorLower.includes('elegant')) {
      score += 2;
    } else if (decorLower.includes('basic') || decorLower.includes('minimal')) {
      score += 0.5;
    } else {
      score += 1;
    }
  }

  // Theme alignment
  if (eventDetails.theme && option.decoration) {
    score += Math.random() * 1.5;
  }

  return Math.min(Math.max(score, 1), 10);
};

// Evaluate risk
const evaluateRisk = (option, constraints) => {
  let score = 7; // Base score (higher = lower risk)

  // Resource availability
  if (constraints.resources) {
    const resourcesLower = constraints.resources.toLowerCase();
    if (resourcesLower.includes('limited') || resourcesLower.includes('small')) {
      score -= Math.random() * 1.5;
    } else if (resourcesLower.includes('adequate') || resourcesLower.includes('large')) {
      score += Math.random() * 1.5;
    }
  }

  // Venue complexity
  if (option.venue) {
    const venueLower = option.venue.toLowerCase();
    if (venueLower.includes('outdoor')) {
      score -= 0.5; // Weather risk
    } else if (venueLower.includes('indoor')) {
      score += 0.5; // More controlled
    }
  }

  return Math.min(Math.max(score, 1), 10);
};

// Calculate weighted total score
const calculateWeightedScore = (scores, priorities) => {
  const totalWeight = priorities.cost + priorities.time + priorities.quality + 
                      priorities.impact + priorities.risk;

  const weightedSum = 
    (scores.costEfficiency * priorities.cost) +
    (scores.timeEfficiency * priorities.time) +
    ((scores.feasibility + scores.spaceUtilization) / 2 * priorities.quality) +
    (scores.experience * priorities.impact) +
    (scores.riskScore * priorities.risk);

  return weightedSum / totalWeight;
};
