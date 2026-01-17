export interface DailyCheckin {
    id?: string;
    user_id?: string;
    date: string;
    created_at?: string;

    // Biometrics
    sleep_hours?: number;
    sleep_quality: number; // 0-100
    stress_level: number; // 0-100
    resting_hr?: number;

    // Symptoms (0-10)
    energy_level: number;
    depression_mood: number;
    mania_euphoria: number;
    irritability: number;
    anxiety: number;
    ocd_thoughts: number;
    sensory_overload: number;
    social_masking: number;
    suicide_risk: number;

    // Routine
    meds_taken: boolean;
    notes?: string;
}

export interface WeeklyCheckin {
    id?: string;
    user_id?: string;
    date: string;
    created_at?: string;

    // Calculated Scores
    phq9_score: number;
    gad7_score: number;
    asrm_score: number;

    // Vitals
    weight_kg?: number;
    treatment_satisfaction: number; // 0-10
}

export interface MonthlyCheckin {
    id?: string;
    user_id?: string;
    date: string;
    created_at?: string;

    // FAST Scale Items (0-3)
    fast_autonomy: number;
    fast_work: number;
    fast_cognition: number;
    fast_finance: number;
    fast_relations: number;
    fast_leisure: number;
    fast_total_score: number;

    work_absences?: number;

    // Other Scores
    ybocs_score: number;
    eq5d_score: number; // 0-100
    tsqm_score: number; // 0-100
}

export interface QuarterlyCheckin {
    id?: string;
    user_id?: string;
    date: string;
    created_at?: string;

    raads_r_score?: number;
    cat_q_score?: number;
    burnout_index?: number; // 0-10
}

export interface EsketamineSession {
    id?: string;
    user_id?: string;
    date: string;
    created_at?: string;

    dose_mg: number;
    bp_pre_systolic?: number;
    bp_pre_diastolic?: number;
    bp_post_systolic?: number;
    bp_post_diastolic?: number;

    dissociation_level: number; // 0-10
    physical_discomfort: number; // 0-10
    trip_quality?: string;
    insights?: string;

    humor_24h_later?: number; // -5 to +5
}
