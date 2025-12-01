
import { KnowledgeNode } from "../types";

/**
 * SuperMemo-2 (SM-2) Algorithm Implementation
 * 
 * Quality (q) input:
 * 5 - Perfect response
 * 4 - Correct response after a hesitation
 * 3 - Correct response recalled with serious difficulty
 * 2 - Incorrect response; where the correct one seemed easy to recall
 * 1 - Incorrect response; the correct one remembered
 * 0 - Complete blackout.
 */

export const calculateSM2 = (node: KnowledgeNode, quality: number): KnowledgeNode => {
    // Default values if not present
    let reps = node.sm2?.repetitions || 0;
    let interval = node.sm2?.interval || 0;
    let ef = node.sm2?.efactor || 2.5;

    // 1. Update E-Factor
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    // EF cannot go below 1.3
    let newEf = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEf < 1.3) newEf = 1.3;

    // 2. Update Repetitions & Interval
    if (quality >= 3) {
        // Correct response
        if (reps === 0) {
            interval = 1;
        } else if (reps === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * newEf);
        }
        reps++;
    } else {
        // Incorrect response - Reset
        reps = 0;
        interval = 1; 
        // Note: In strict SM-2, EF doesn't change on failure, but some variations lower it. 
        // We keep the modified EF from step 1 to punish hard items.
    }

    // 3. Calculate Next Review Date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);

    // 4. Determine Status for UI
    let newStatus: 'new' | 'learning' | 'mastered' = 'learning';
    if (interval > 21) newStatus = 'mastered'; // Arbitrary threshold for "Mastered"
    if (reps === 0) newStatus = 'new'; // Reset to new if failed

    return {
        ...node,
        status: newStatus,
        sm2: {
            repetitions: reps,
            interval: interval,
            efactor: newEf,
            nextReviewDate: nextDate,
            lastReviewDate: new Date()
        }
    };
};

// Helpers for categorizing nodes in the UI
export const getReviewStatus = (node: KnowledgeNode) => {
    if (!node.sm2) return 'new'; // Should have been initialized, but fallback

    const now = new Date();
    const reviewDate = new Date(node.sm2.nextReviewDate);
    
    // Normalize time to start of day for comparison
    const todayStart = new Date(now.setHours(0,0,0,0));
    const reviewStart = new Date(reviewDate.setHours(0,0,0,0));

    if (reviewStart <= todayStart) return 'due'; // Đến hạn
    
    // "Weak" definition: Failed recently (reps = 0) but not due today (should theoretically be due 1 day later)
    // Or EF is very low. Let's use low EF for "Weak"
    if (node.sm2.efactor < 1.5) return 'weak'; 

    if (node.sm2.repetitions < 3) return 'learning'; // Chưa vững

    return 'future'; // Chưa đến hạn
};
