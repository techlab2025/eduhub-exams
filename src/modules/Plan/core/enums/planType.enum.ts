export const PlanFeatureTypeEnum = {
  REPORT: 1,
  PROGRESS_TRACKING: 8,
  HOME_STUDY_SCHEDULE: 13,
  WHAT_DID_YOU_STUDY: 17,
  LEARNING_RESOURCES: 20,
} as const;
export type PlanFeatureTypeEnum = (typeof PlanFeatureTypeEnum)[keyof typeof PlanFeatureTypeEnum];

export const PlanFeatureSubTypeEnum = {
  SHOW_OVERALL_SCORE: 2,
  SHOW_SKILL_ANALYSIS: 3,
  SHOW_CURRICULUM_ANALYSIS: 4,
  ALLOW_REPORT_DOWNLOAD: 5,
  MAXIMUM_REPORTS_PER_STUDENT: 6,
  MAX_DOWNLOADS_PER_MONTH: 7,
  OVERALL_PROGRESS_OVERVIEW: 9,
  NEEDS_FOCUS_SECTION: 10,
  SUBJECTS_WITH_PROGRESS_TRACKING: 11,
  MAXIMUM_PROGRESS_HISTORY: 12,
  ALLOW_STUDENTS_TO_VIEW_THEIR_SCHEDULE: 14,
  ALLOW_STUDENTS_TO_SET_REMINDERS: 15,
  MAXIMUM_SCHEDULES_PER_DAY: 16,
  SHOW_SUBJECTS_STUDIED: 18,
  MAXIMUM_ITEMS_SHOWN: 19,
  MIND_MAPS: 21,
  FLASH_CARDS: 22,
  PRACTICE_EXAMS: 23,
  MAXIMUM_MIND_MAPS: 24,
  MAXIMUM_FLASH_CARD_SETS: 25,
} as const;
export type PlanFeatureSubTypeEnum =
  (typeof PlanFeatureSubTypeEnum)[keyof typeof PlanFeatureSubTypeEnum];

export interface PlanFeatureDefinition {
  type: PlanFeatureTypeEnum;
  titleKey: string;
  descriptionKey: string;
  subTypes: Array<{
    type: PlanFeatureSubTypeEnum;
    titleKey: string;
    descriptionKey: string;
    defaultLimit?: number;
  }>;
}

export const PLAN_FEATURE_DEFINITIONS: PlanFeatureDefinition[] = [
  {
    type: PlanFeatureTypeEnum.REPORT,
    titleKey: 'plan_feature_report',
    descriptionKey: 'plan_feature_report_description',
    subTypes: [
      {
        type: PlanFeatureSubTypeEnum.SHOW_OVERALL_SCORE,
        titleKey: 'plan_sub_feature_overall_score',
        descriptionKey: 'plan_sub_feature_overall_score_description',
      },
      {
        type: PlanFeatureSubTypeEnum.SHOW_SKILL_ANALYSIS,
        titleKey: 'plan_sub_feature_skill_analysis',
        descriptionKey: 'plan_sub_feature_skill_analysis_description',
      },
      {
        type: PlanFeatureSubTypeEnum.SHOW_CURRICULUM_ANALYSIS,
        titleKey: 'plan_sub_feature_curriculum_analysis',
        descriptionKey: 'plan_sub_feature_curriculum_analysis_description',
      },
      {
        type: PlanFeatureSubTypeEnum.ALLOW_REPORT_DOWNLOAD,
        titleKey: 'plan_sub_feature_report_download',
        descriptionKey: 'plan_sub_feature_report_download_description',
      },
      {
        type: PlanFeatureSubTypeEnum.MAXIMUM_REPORTS_PER_STUDENT,
        titleKey: 'plan_sub_feature_max_reports',
        descriptionKey: 'plan_sub_feature_max_reports_description',
        defaultLimit: 0,
      },
      {
        type: PlanFeatureSubTypeEnum.MAX_DOWNLOADS_PER_MONTH,
        titleKey: 'plan_sub_feature_max_downloads',
        descriptionKey: 'plan_sub_feature_max_downloads_description',
        defaultLimit: 0,
      },
    ],
  },
  {
    type: PlanFeatureTypeEnum.PROGRESS_TRACKING,
    titleKey: 'plan_feature_progress_tracking',
    descriptionKey: 'plan_feature_progress_tracking_description',
    subTypes: [
      {
        type: PlanFeatureSubTypeEnum.OVERALL_PROGRESS_OVERVIEW,
        titleKey: 'plan_sub_feature_progress_overview',
        descriptionKey: 'plan_sub_feature_progress_overview_description',
      },
      {
        type: PlanFeatureSubTypeEnum.NEEDS_FOCUS_SECTION,
        titleKey: 'plan_sub_feature_needs_focus',
        descriptionKey: 'plan_sub_feature_needs_focus_description',
      },
      {
        type: PlanFeatureSubTypeEnum.SUBJECTS_WITH_PROGRESS_TRACKING,
        titleKey: 'plan_sub_feature_progress_subjects',
        descriptionKey: 'plan_sub_feature_progress_subjects_description',
        defaultLimit: 0,
      },
      {
        type: PlanFeatureSubTypeEnum.MAXIMUM_PROGRESS_HISTORY,
        titleKey: 'plan_sub_feature_progress_history',
        descriptionKey: 'plan_sub_feature_progress_history_description',
        defaultLimit: 0,
      },
    ],
  },
  {
    type: PlanFeatureTypeEnum.HOME_STUDY_SCHEDULE,
    titleKey: 'plan_feature_home_schedule',
    descriptionKey: 'plan_feature_home_schedule_description',
    subTypes: [
      {
        type: PlanFeatureSubTypeEnum.ALLOW_STUDENTS_TO_VIEW_THEIR_SCHEDULE,
        titleKey: 'plan_sub_feature_view_schedule',
        descriptionKey: 'plan_sub_feature_view_schedule_description',
      },
      {
        type: PlanFeatureSubTypeEnum.ALLOW_STUDENTS_TO_SET_REMINDERS,
        titleKey: 'plan_sub_feature_schedule_reminders',
        descriptionKey: 'plan_sub_feature_schedule_reminders_description',
      },
      {
        type: PlanFeatureSubTypeEnum.MAXIMUM_SCHEDULES_PER_DAY,
        titleKey: 'plan_sub_feature_max_schedules',
        descriptionKey: 'plan_sub_feature_max_schedules_description',
        defaultLimit: 0,
      },
    ],
  },
  {
    type: PlanFeatureTypeEnum.WHAT_DID_YOU_STUDY,
    titleKey: 'plan_feature_study_summary',
    descriptionKey: 'plan_feature_study_summary_description',
    subTypes: [
      {
        type: PlanFeatureSubTypeEnum.SHOW_SUBJECTS_STUDIED,
        titleKey: 'plan_sub_feature_subjects_studied',
        descriptionKey: 'plan_sub_feature_subjects_studied_description',
      },
      {
        type: PlanFeatureSubTypeEnum.MAXIMUM_ITEMS_SHOWN,
        titleKey: 'plan_sub_feature_max_items',
        descriptionKey: 'plan_sub_feature_max_items_description',
        defaultLimit: 0,
      },
    ],
  },
  {
    type: PlanFeatureTypeEnum.LEARNING_RESOURCES,
    titleKey: 'plan_feature_learning_resources',
    descriptionKey: 'plan_feature_learning_resources_description',
    subTypes: [
      {
        type: PlanFeatureSubTypeEnum.MIND_MAPS,
        titleKey: 'plan_sub_feature_mind_maps',
        descriptionKey: 'plan_sub_feature_mind_maps_description',
      },
      {
        type: PlanFeatureSubTypeEnum.FLASH_CARDS,
        titleKey: 'plan_sub_feature_flash_cards',
        descriptionKey: 'plan_sub_feature_flash_cards_description',
      },
      {
        type: PlanFeatureSubTypeEnum.PRACTICE_EXAMS,
        titleKey: 'plan_sub_feature_practice_exams',
        descriptionKey: 'plan_sub_feature_practice_exams_description',
      },
      {
        type: PlanFeatureSubTypeEnum.MAXIMUM_MIND_MAPS,
        titleKey: 'plan_sub_feature_max_mind_maps',
        descriptionKey: 'plan_sub_feature_max_mind_maps_description',
        defaultLimit: 0,
      },
      {
        type: PlanFeatureSubTypeEnum.MAXIMUM_FLASH_CARD_SETS,
        titleKey: 'plan_sub_feature_max_flash_cards',
        descriptionKey: 'plan_sub_feature_max_flash_cards_description',
        defaultLimit: 0,
      },
    ],
  },
];
