import { PermissionsEnum } from '../enums/permissions.enum';
import type { PermissionModuleItem } from '../models/permission.item';

export const createAdminPermissions = (): PermissionModuleItem[] => [
  {
    code: PermissionsEnum.SETTING,
    labelKey: 'permission.modules.settings',
    permissions: [
      // {
      //   code: PermissionsEnum.ORG_EMPLOYEE_ALL,
      //   labelKey: 'permission.groups.employees',
      //   checked: false,
      //   permissions: [
      //   ],
      // },
      // {
      //   code: PermissionsEnum.NOTIFICATION_PLAN_ALL,
      //   labelKey: 'permission.groups.notification_plans',
      //   checked: false,
      //   permissions: [
      //   ],
      // },
      {
        code: PermissionsEnum.ADMIN_ALL,
        labelKey: 'permission.groups.admins',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.ADMIN_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.ADMIN_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.ADMIN_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.ADMIN_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.ADMIN_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.COUNTRY_ALL,
        labelKey: 'permission.groups.countries',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.COUNTRY_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.COUNTRY_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.COUNTRY_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.COUNTRY_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.COUNTRY_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.EMPLOYEE_ALL,
        labelKey: 'permission.groups.employees',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.EMPLOYEE_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.EMPLOYEE_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.EMPLOYEE_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.EMPLOYEE_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.EMPLOYEE_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
          {
            code: PermissionsEnum.EMPLOYEE_CHANGE_STATUS,
            labelKey: 'permission.actions.change_status',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.DELETE_ACCOUNT_REASON_ALL,
        labelKey: 'permission.groups.delete_account_reasons',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.DELETE_ACCOUNT_REASON_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.DELETE_ACCOUNT_REASON_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.DELETE_ACCOUNT_REASON_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.DELETE_ACCOUNT_REASON_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.DELETE_ACCOUNT_REASON_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.SKILL_ALL,
        labelKey: 'permission.groups.skills',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.SKILL_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.SKILL_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.SKILL_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.SKILL_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.SKILL_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.EDUCATION_CLASSIFICATION_CONFIGURATION_ALL,
        labelKey: 'permission.groups.education_classification_configuration',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_CONFIGURATION_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_CONFIGURATION_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.EDUCATION_CLASSIFICATION_CONFIGURATION_SUBJECT_ALL,
        labelKey: 'permission.groups.education_classification_configuration_subjects',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_CONFIGURATION_SUBJECT_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_CONFIGURATION_SUBJECT_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.EDUCATION_CLASSIFICATION_ALL,
        labelKey: 'permission.groups.education_classifications',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_FETCH_FULL,
            labelKey: 'permission.actions.fetch_full',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_TOGGLE_STATUS,
            labelKey: 'permission.actions.toggle_status',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.EDUCATION_CLASSIFICATION_BRANCH_ALL,
        labelKey: 'permission.groups.education_classification_branches',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_BRANCH_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_BRANCH_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_BRANCH_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_BRANCH_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_BRANCH_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_BRANCH_FETCH_FULL,
            labelKey: 'permission.actions.fetch_full',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_ALL,
        labelKey: 'permission.groups.education_classification_subjects',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_FETCH_FULL,
            labelKey: 'permission.actions.fetch_full',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_SKILL_ALL,
        labelKey: 'permission.groups.education_classification_subject_skills',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_SKILL_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_SKILL_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_SKILL_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_SKILL_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_SKILL_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_TOPIC_ALL,
        labelKey: 'permission.groups.education_classification_subject_topics',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_TOPIC_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_TOPIC_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_TOPIC_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_TOPIC_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_TOPIC_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_PRICING_ALL,
        labelKey: 'permission.groups.education_classification_subject_pricing',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_PRICING_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_PRICING_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_PRICING_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_PRICING_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_PRICING_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.DOCUMENT_TYPE_ALL,
        labelKey: 'permission.groups.document_types',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.DOCUMENT_TYPE_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.DOCUMENT_TYPE_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.DOCUMENT_TYPE_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.DOCUMENT_TYPE_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.DOCUMENT_TYPE_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
          {
            code: PermissionsEnum.DOCUMENT_TYPE_TOGGLE_STATUS,
            labelKey: 'permission.actions.toggle_status',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.DOCUMENT_ALL,
        labelKey: 'permission.groups.documents',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.DOCUMENT_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.DOCUMENT_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.DOCUMENT_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.DOCUMENT_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.DOCUMENT_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.PLACEMENT_TEST_ALL,
        labelKey: 'permission.groups.placement_tests',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.PLACEMENT_TEST_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.PLACEMENT_TEST_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.EXAM_ALL,
        labelKey: 'permission.groups.exams',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.EXAM_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.EXAM_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.EXAM_UNIT_ALL,
        labelKey: 'permission.groups.exam_units',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.EXAM_UNIT_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.EXAM_UNIT_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.EXAM_UNIT_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.EXAM_UNIT_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.EXAM_UNIT_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.PLACEMENT_EXAM_CONFIGURATION_ALL,
        labelKey: 'permission.groups.placement_exam_configuration',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.PLACEMENT_EXAM_CONFIGURATION_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.PLACEMENT_EXAM_CONFIGURATION_CREATE_OR_UPDATE,
            labelKey: 'permission.actions.create_or_update',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.FLASH_CARD_GROUP_ALL,
        labelKey: 'permission.groups.flash_card_groups',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.FLASH_CARD_GROUP_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.FLASH_CARD_GROUP_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.FLASH_CARD_GROUP_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.FLASH_CARD_GROUP_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.FLASH_CARD_GROUP_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.FLASH_CARD_ALL,
        labelKey: 'permission.groups.flash_cards',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.FLASH_CARD_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.FLASH_CARD_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.FLASH_CARD_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.FLASH_CARD_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.FLASH_CARD_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.QUESTION_ALL,
        labelKey: 'permission.groups.questions',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.QUESTION_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.QUESTION_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.QUESTION_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.QUESTION_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.QUESTION_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
          {
            code: PermissionsEnum.QUESTION_UPDATE_REVIEW_STATUS,
            labelKey: 'permission.actions.update_review_status',
            checked: false,
          },
          {
            code: PermissionsEnum.QUESTION_FETCH_REVIEW_STATUS_HISTORY,
            labelKey: 'permission.actions.fetch_review_status_history',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.ABOUT_US_ALL,
        labelKey: 'permission.groups.about_us',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.ABOUT_US_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.ABOUT_US_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.ABOUT_US_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.ABOUT_US_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.SOCIAL_LINK_ALL,
        labelKey: 'permission.groups.social_links',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.SOCIAL_LINK_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.SOCIAL_LINK_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.SUPPORT_ALL,
        labelKey: 'permission.groups.support',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.SUPPORT_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.SUPPORT_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.SUPPORT_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.SUPPORT_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.SUPPORT_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.SUPPORT_CONTACT_ALL,
        labelKey: 'permission.groups.support_contacts',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.SUPPORT_CONTACT_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.SUPPORT_CONTACT_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.FAQ_ALL,
        labelKey: 'permission.groups.faqs',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.FAQ_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.FAQ_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.FAQ_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.FAQ_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.FAQ_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.PRIVACY_ALL,
        labelKey: 'permission.groups.privacy',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.PRIVACY_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.PRIVACY_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.PRIVACY_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.PRIVACY_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.PRIVACY_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.TERM_ALL,
        labelKey: 'permission.groups.terms',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.TERM_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.TERM_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.TERM_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.TERM_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.TERM_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.APP_STATUS_ALL,
        labelKey: 'permission.groups.app_status',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.APP_STATUS_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.APP_STATUS_CREATE_OR_UPDATE,
            labelKey: 'permission.actions.create_or_update',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.STUDENT_ALL,
        labelKey: 'permission.groups.students',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.STUDENT_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.STUDENT_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.STUDENT_STATISTICS,
            labelKey: 'permission.actions.statistics',
            checked: false,
          },
          {
            code: PermissionsEnum.STUDENT_CHANGE_STATUS,
            labelKey: 'permission.actions.change_status',
            checked: false,
          },
          {
            code: PermissionsEnum.STUDENT_FORCE_LOGOUT,
            labelKey: 'permission.actions.force_logout',
            checked: false,
          },
          {
            code: PermissionsEnum.STUDENT_ADD_NOTE,
            labelKey: 'permission.actions.add_note',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.BLOCK_REASON_ALL,
        labelKey: 'permission.groups.block_reasons',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.BLOCK_REASON_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.BLOCK_REASON_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.BLOCK_REASON_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.BLOCK_REASON_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.BLOCK_REASON_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.ADVICE_CATEGORY_ALL,
        labelKey: 'permission.groups.advice_categories',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.ADVICE_CATEGORY_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.ADVICE_CATEGORY_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.ADVICE_CATEGORY_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.ADVICE_CATEGORY_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.ADVICE_CATEGORY_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.ADVICE_ALL,
        labelKey: 'permission.groups.advices',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.ADVICE_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.ADVICE_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.ADVICE_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.ADVICE_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.ADVICE_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.SUBSCRIPTION_PLAN_ALL,
        labelKey: 'permission.groups.subscription_plans',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.SUBSCRIPTION_PLAN_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.SUBSCRIPTION_PLAN_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.SUBSCRIPTION_PLAN_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.SUBSCRIPTION_PLAN_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.SUBSCRIPTION_PLAN_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
          {
            code: PermissionsEnum.SUBSCRIPTION_PLAN_TOGGLE_FEATURE,
            labelKey: 'permission.actions.toggle_feature',
            checked: false,
          },
          {
            code: PermissionsEnum.SUBSCRIPTION_PLAN_TOGGLE_STATUS,
            labelKey: 'permission.actions.toggle_status',
            checked: false,
          },
          {
            code: PermissionsEnum.SUBSCRIPTION_PLAN_CHANGE_STATUS,
            labelKey: 'permission.actions.change_status',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.HIGHLIGHT_BADGE_ALL,
        labelKey: 'permission.groups.highlight_badges',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.HIGHLIGHT_BADGE_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.HIGHLIGHT_BADGE_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.HIGHLIGHT_BADGE_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.HIGHLIGHT_BADGE_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.HIGHLIGHT_BADGE_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.SUBSCRIPTION_ALL,
        labelKey: 'permission.groups.subscriptions',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.SUBSCRIPTION_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.SUBSCRIPTION_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.SUBSCRIPTION_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
          {
            code: PermissionsEnum.SUBSCRIPTION_STATISTICS,
            labelKey: 'permission.actions.statistics',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.PLAN_FEATURE_ALL,
        labelKey: 'permission.groups.plan_features',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.PLAN_FEATURE_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.PLAN_FEATURE_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.DOCUMENT_INDEX_ALL,
        labelKey: 'permission.groups.document_index',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.DOCUMENT_INDEX_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.DOCUMENT_INDEX_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.DOCUMENT_INDEX_START,
            labelKey: 'permission.actions.start',
            checked: false,
          },
          {
            code: PermissionsEnum.DOCUMENT_INDEX_STATUS,
            labelKey: 'permission.actions.status',
            checked: false,
          },
          {
            code: PermissionsEnum.DOCUMENT_INDEX_REFRESH_STATUS,
            labelKey: 'permission.actions.refresh_status',
            checked: false,
          },
          {
            code: PermissionsEnum.DOCUMENT_INDEX_SAVE,
            labelKey: 'permission.actions.save',
            checked: false,
          },
          {
            code: PermissionsEnum.DOCUMENT_INDEX_FETCH_TRANSACTIONS,
            labelKey: 'permission.actions.fetch_transactions',
            checked: false,
          },
        ],
      },
    ],
  },
  {
    code: PermissionsEnum.QUESTION_BANK,
    labelKey: 'permission.modules.question_bank',
    permissions: [
      {
        code: PermissionsEnum.Generate_Questions,
        labelKey: 'permission.groups.generate_questions',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.Generate_Questions,
            labelKey: 'permission.actions.create',
            checked: false,
          },
        ],
      },
    ],
  },
];
