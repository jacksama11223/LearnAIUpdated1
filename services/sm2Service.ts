
import { KnowledgeNode, SM2Data } from "../types";

/**
 * SuperMemo-2 (SM-2) Algorithm Implementation for Individual Items
 * 
 * Quality (q) input:
 * 5 - Perfect response (Dễ)
 * 4 - Correct response after a hesitation (Được)
 * 3 - Correct response recalled with serious difficulty (Khó)
 * 2 - Incorrect response; where the correct one seemed easy to recall (Quên)
 * 1 - Incorrect response; the correct one remembered (Quên)
 * 0 - Complete blackout (Quên)
 */

export const calculateItemSM2 = (currentSM2: SM2Data, quality: number): SM2Data => {
    let reps = currentSM2.repetitions;
    let interval = currentSM2.interval;
    let ef = currentSM2.efactor;

    // 1. Update E-Factor
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    // EF cannot go below 1.3
    let newEf = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEf < 1.3) newEf = 1.3;

    // 2. Update Repetitions & Interval (OPTIMIZED FOR AGGRESSIVE LEARNING)
    
    // User Requirement: 
    // - Weak/Unsteady (Quality < 4) -> Appear NOW (Today).
    // - Good/Easy (Quality >= 4) -> Future (Tomorrow+).

    if (quality >= 4) {
        // Good or Easy: Move to Future (Tomorrow or later)
        if (reps === 0) {
            interval = 1;
        } else if (reps === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * newEf);
        }
        reps++;
    } else {
        // Hard, Wrong, or Blackout: Keep it for TODAY (Immediate Review)
        // We reset interval to 0 so it stays in the "Due" bucket.
        reps = 0; 
        interval = 0; // 0 days added = Due Today
    }

    // 3. Calculate Next Review Date
    const nextDate = new Date();
    // Add interval days. If interval is 0, it stays Today.
    nextDate.setDate(nextDate.getDate() + interval);

    return {
        repetitions: reps,
        interval: interval,
        efactor: newEf,
        nextReviewDate: nextDate.toISOString()
    };
};

/**
 * Helper to determine the status of a Node based on its internal items.
 * A node is "due" ONLY if AT LEAST ONE item inside it is due today or in the past.
 * Categories are determined by the count of 'struggling' items among those due.
 */
export const getNodeAggregateStatus = (node: KnowledgeNode): 'due' | 'future' | 'weak' | 'learning' => {
    if (!node.data) return 'future';

    const allItems: SM2Data[] = [];
    if (node.data.flashcards) node.data.flashcards.forEach(i => allItems.push(i.sm2));
    if (node.data.quiz) node.data.quiz.forEach(i => allItems.push(i.sm2));
    if (node.data.fillInBlanks) node.data.fillInBlanks.forEach(i => allItems.push(i.sm2));
    if (node.data.spotErrors) node.data.spotErrors.forEach(i => allItems.push(i.sm2));
    if (node.data.caseStudies) node.data.caseStudies.forEach(i => allItems.push(i.sm2));

    if (allItems.length === 0) return 'future';

    const now = new Date();
    const todayStart = new Date(now.setHours(0,0,0,0)).getTime();

    // Filter items that are strictly due today or in the past
    const dueItems = allItems.filter(sm2 => {
        const reviewDate = new Date(sm2.nextReviewDate).setHours(0,0,0,0);
        return reviewDate <= todayStart;
    });

    // If no items are due (all marked easy/good and pushed to future), return future.
    if (dueItems.length === 0) return 'future';

    // Count items that define "struggle" within the DUE set.
    // E-Factor < 2.5 means it has been marked Hard/Again/Wrong reducing ease.
    // Repetitions < 3 means it's still in early learning stages or recently reset.
    const struggleCount = dueItems.filter(i => i.efactor < 2.5 || i.repetitions < 3).length;

    // Logic:
    // > 5 struggle items -> Weak (Còn yếu)
    // > 3 struggle items -> Learning (Chưa vững)
    // Else -> Due (Đến hạn)
    if (struggleCount > 5) return 'weak';
    if (struggleCount > 3) return 'learning';
    
    return 'due';
};

/**
 * Helper to count actionable items in a node.
 * Strictly counts items where Next Review Date <= Today.
 */
export const getDueItemsCount = (node: KnowledgeNode): number => {
    if (!node.data) return 0;
    
    const now = new Date();
    const todayStart = new Date(now.setHours(0,0,0,0)).getTime();
    let count = 0;

    const check = (sm2: SM2Data) => {
        const reviewDate = new Date(sm2.nextReviewDate).setHours(0,0,0,0);
        // Strictly check date. 
        if (reviewDate <= todayStart) {
            count++;
        }
    };

    if (node.data.flashcards) node.data.flashcards.forEach(i => check(i.sm2));
    if (node.data.quiz) node.data.quiz.forEach(i => check(i.sm2));
    if (node.data.fillInBlanks) node.data.fillInBlanks.forEach(i => check(i.sm2));
    if (node.data.spotErrors) node.data.spotErrors.forEach(i => check(i.sm2));
    if (node.data.caseStudies) node.data.caseStudies.forEach(i => check(i.sm2));

    return count;
}

/**
 * Calculates global stats across all nodes for the dashboard.
 */
export const getGlobalStats = (nodes: KnowledgeNode[]) => {
    const now = new Date();
    const todayStart = new Date(now.setHours(0,0,0,0)).getTime();

    let dueCount = 0;
    let weakCount = 0;
    let newCount = 0; // Using 'repetitions === 0' as proxy for 'Unfinished/New'

    const processItem = (sm2: SM2Data) => {
        const reviewDate = new Date(sm2.nextReviewDate).setHours(0,0,0,0);
        
        // Count Due
        if (reviewDate <= todayStart) {
            dueCount++;
            
            // Count Weak (within due items)
            if (sm2.efactor < 2.5) {
                weakCount++;
            }
        }

        // Count New/Unfinished (Total pool)
        if (sm2.repetitions === 0) {
            newCount++;
        }
    };

    nodes.forEach(node => {
        if (!node.data) return;
        if (node.data.flashcards) node.data.flashcards.forEach(i => processItem(i.sm2));
        if (node.data.quiz) node.data.quiz.forEach(i => processItem(i.sm2));
        if (node.data.fillInBlanks) node.data.fillInBlanks.forEach(i => processItem(i.sm2));
        if (node.data.spotErrors) node.data.spotErrors.forEach(i => processItem(i.sm2));
        if (node.data.caseStudies) node.data.caseStudies.forEach(i => processItem(i.sm2));
    });

    return { due: dueCount, weak: weakCount, new: newCount };
};