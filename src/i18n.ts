import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const resources = {
  en: {
    translation: {
      dashboard: {
        welcome: "Welcome back, {{name}}!",
        subtitleDemo: "Here's what's happening with your demo business today.",
        subtitleAnalyst: "Here's what's happening with your analyst business today.",
        metrics: {
          activeSubscriptions: "Active Subscriptions",
          activeSubscriptionsChange: "+12.5% from last month",
          openSignals: "Open Signals",
          openSignalsChange: "3 closed today",
          consultationBookings: "Consultation Bookings",
          consultationBookingsChange: "5 pending this week",
          monthlyRevenue: "Monthly Revenue",
          monthlyRevenueChange: "+8.2% from last month"
        },
        charts: {
          subscriptionGrowthTitle: "Subscription Growth",
          subscriptionGrowthSubtitle: "Monthly subscriber acquisition",
          signalPerformanceTitle: "Signal Performance",
          signalPerformanceSubtitle: "Success rate over time",
          revenueBreakdownTitle: "Revenue Breakdown",
          revenueBreakdownSubtitle: "By service type",
          subscriberDistributionTitle: "Subscriber Distribution",
          subscriberDistributionSubtitle: "By subscription type"
        },
        recentActivityTitle: "Recent Activity",
        recentActivity: {
          subscription: "New subscriber: Premium Package",
          signal: "Signal closed: EUR/USD (+45 pips)",
          consultation: "Consultation booked for tomorrow",
          payout: "Monthly payout processed: $2,340",
          ago2m: "2 minutes ago",
          ago1h: "1 hour ago",
          ago3h: "3 hours ago",
          ago1d: "1 day ago"
        },
        statistics: {
          title: "Your Statistics",
          periodLabel: "16 Nov - 16 Dec 2024",
          periodFilter: "Month",
          earningsIncrease: "Increase in earnings",
          activeGrowth: "Active Growth",
          viewDetails: "View Details"
        },
        quickAction: "Quick Action",
        searchPlaceholder: "Search...",
        notificationsComingSoonTitle: "Notification Center",
        notificationsComingSoonSubtitle: "Stay updated with all your important alerts and updates.",
        notificationsComingSoonBody: "This feature is coming soon. You'll be able to manage all your notifications here."
      },
      common: {
        languageEnglish: "English",
        languageArabic: "العربية",
        languageCodeEnglish: "EN",
        languageCodeArabic: "AR"
      },
      sidebar: {
        sections: {
          dashboard: "Dashboard",
          profileCompany: "Profile & Company",
          contentTrading: "Content & Trading",
          educationLive: "Education & Live",
          communication: "Communication",
          marketingRevenue: "Marketing & Revenue"
        },
        dashboard: {
          overview: "Overview",
          notifications: "Notifications"
        },
        profile: {
          kycVerification: "KYC Verification",
          companyAssociation: "Company Association",
          privateAccess: "Private Access",
          profileBranding: "Profile & Branding"
        },
        content: {
          subscriptionPackages: "Subscription Packages",
          signalCenter: "Signal Center",
          signalMonitor: "Signal Monitor",
          contentPublishing: "Content Publishing",
          newsCenter: "News Center"
        },
        education: {
          coursesVideos: "Courses & Videos",
          liveStreaming: "Live Streaming",
          consultationBooking: "Consultation Booking"
        },
        communication: {
          subscriberChat: "Subscriber Chat"
        },
        marketing: {
          discountCodes: "Discount Codes",
          referralSystem: "Referral System",
          payoutDashboard: "Payout Dashboard"
        },
        settings: "Settings",
        logout: "Logout",
        profileBadge: {
          demoAccount: "Demo Account",
          professionalAnalyst: "Professional Analyst",
          demoAccess: "Demo Access",
          verified: "Verified"
        }
      },
      pages: {
        activeSignals: {
          title: "Active Signals Monitor",
          subtitle: "Real-time monitoring with problem detection"
        },
        signalCenter: {
          title: "Signal Center",
          subtitle: "Create, manage, and publish your trading signals with multi-level take profits",
          header: {
            create: "Create Signal"
          },
          stats: {
            totalSignals: "Total Signals",
            activeSignals: "Active Signals",
            draftSignals: "Draft Signals",
            closedSignals: "Closed Signals"
          },
          filters: {
            all: "All Signals ({{count}})",
            active: "Active ({{count}})",
            draft: "Drafts ({{count}})",
            closed: "Closed ({{count}})"
          },
          searchPlaceholder: "Search pairs...",
          card: {
            riskSuffix: "Risk",
            currentPnL: "Current P&L",
            tpLevelsTitle: "Take Profit Levels ({{count}})",
            moreLevels: "+{{count}} more levels",
            slLabel: "SL:",
            publishSignal: "Publish Signal",
            viewDetails: "View Details",
            createdOn: "Created {{date}}",
            publishedOn: "Published {{date}}"
          },
          emptyState: {
            noSignals: "No signals yet",
            noSignalsFiltered: "No {{status}} signals",
            body: "Create your first trading signal with multi-level take profits.",
            bodyFiltered: "No {{status}} signals found. Try adjusting your filters.",
            createFirstSignal: "Create Your First Signal"
          }
        },
        contentPublishing: {
          title: "Content Publishing",
          subtitle: "Create, manage, and publish educational content and market analysis",
          header: {
            create: "Create Content"
          },
          stats: {
            totalContent: "Total Content",
            published: "Published",
            totalViews: "Total Views",
            totalLikes: "Total Likes"
          },
          filters: {
            allContent: "All Content ({{count}})",
            published: "Published ({{count}})",
            draft: "Drafts ({{count}})",
            scheduled: "Scheduled ({{count}})",
            archived: "Archived ({{count}})",
            allCategories: "All Categories"
          },
          searchPlaceholder: "Search by title or tags...",
          card: {
            minRead: "{{minutes}} min read",
            premiumBadge: "Premium",
            views: "Views",
            likes: "Likes",
            comments: "Comments",
            shares: "Shares",
            scheduled: "Scheduled to publish on {{date}} at {{time}}",
            publishNow: "Publish Now",
            viewPublished: "View Published",
            editContent: "Edit Content"
          },
          emptyState: {
            noContent: "No content yet",
            noContentFiltered: "No {{status}} content",
            body: "Create your first piece of content to share insights with your audience.",
            bodyFiltered: "No {{status}} content found. Try adjusting your filters.",
            createFirstContent: "Create Your First Content"
          }
        },
        newsCenter: {
          title: "Analyst News Center",
          subtitle: "Create and manage news updates, market alerts, and insights for your subscribers",
          header: {
            create: "Create News"
          },
          stats: {
            totalNews: "Total News",
            published: "Published",
            totalViews: "Total Views",
            subscribers: "Subscribers"
          },
          filters: {
            allNews: "All News ({{count}})",
            published: "Published ({{count}})",
            draft: "Drafts ({{count}})",
            scheduled: "Scheduled ({{count}})",
            breaking: "Breaking ({{count}})",
            pinned: "Pinned ({{count}})",
            allCategories: "All Categories",
            allPriorities: "All Priorities",
            urgent: "Urgent",
            high: "High Priority",
            medium: "Medium Priority",
            low: "Low Priority"
          },
          searchPlaceholder: "Search news by title or tags...",
          card: {
            breakingBadge: "BREAKING NEWS",
            pinnedBadge: "📌 Pinned",
            minRead: "{{minutes}} min read",
            subscribers: "{{count}} subscribers",
            impactSuffix: "impact",
            affectedPairsTitle: "AFFECTED PAIRS",
            morePairs: "+{{count}} more",
            moreTags: "+{{count}} more",
            views: "Views",
            likes: "Likes",
            comments: "Comments",
            shares: "Shares",
            scheduled: "Scheduled to publish on {{date}} at {{time}}",
            publishNews: "Publish News",
            viewLive: "View Live",
            editNews: "Edit News"
          },
          emptyState: {
            noNews: "No news articles yet",
            noNewsFiltered: "No {{status}} news articles",
            body: "Create your first news article to share market insights with your subscribers.",
            bodyFiltered: "No {{status}} news articles found. Try adjusting your filters.",
            createFirstNews: "Create Your First News"
          }
        },
        subscriptionPackages: {
          title: "Subscription Packages",
          subtitle: "Create and manage subscription tiers to monetize your analysis services",
          header: {
            create: "Create Package"
          },
          tabs: {
            overview: "Overview",
            packages: "Packages",
            analytics: "Analytics"
          },
          labels: {
            mostPopular: "Most Popular",
            active: "Active",
            inactive: "Inactive",
            keyFeatures: "Key Features",
            premiumBadge: "Premium",
            moreFeatures: "+{{count}} more features",
            subscribers: "Subscribers",
            revenue: "Revenue",
            conversion: "Conversion",
            modifiedOn: "Modified {{date}}",
            noPackagesTitle: "No packages yet",
            noPackagesBody: "Create your first subscription package to start monetizing your analysis services.",
            createFirstPackage: "Create First Package"
          },
          overview: {
            performanceTitle: "Package Performance",
            recentActivityTitle: "Recent Activity",
            activity1: "New subscriber to Professional plan",
            activity2: "VIP Elite package updated",
            activity3: "Starter package trial expired"
          },
          analytics: {
            totalRevenueTitle: "Total Revenue",
            totalRevenueChange: "+{{value}}% this month",
            totalSubscribersTitle: "Total Subscribers",
            totalSubscribersSubtitle: "Active subscriptions",
            conversionRateTitle: "Conversion Rate",
            conversionRateSubtitle: "Above industry average",
            arpuTitle: "Avg Revenue Per User",
            arpuSubtitle: "Per month",
            growthRateTitle: "Growth Rate",
            growthRateSubtitle: "Monthly growth",
            churnRateTitle: "Churn Rate",
            churnRateSubtitle: "Monthly churn",
            comingSoon: "Detailed analytics charts and reports are coming soon. You'll be able to track conversion funnels, subscriber lifetime value, and package performance over time."
          }
        },
        kycVerification: {
          title: "KYC Verification",
          subtitle: "Complete your verification to unlock all platform features",
          statusCardTitle: "KYC Verification Status",
          status: {
            approved: "Approved - Full Access Granted",
            rejected: "Rejected - Action Required",
            under_review: "Under Admin Review",
            in_progress: "In Progress - Documents Required",
            not_started: "Not Started",
            unknown: "Unknown Status"
          },
          completionProgress: "Completion Progress",
          timelineTitle: "Timeline",
          submittedLabel: "Application submitted: {{date}}",
          reviewedLabel: "Reviewed: {{date}}",
          nextStepsTitle: "Next Steps",
          adminMessageLabel: "Admin Message:",
          headerCta: "Upload Documents",
          requiredDocumentsTitle: "Required Documents",
          requiredApprovedLabel: "{{approved}}/{{total}} Approved",
          optionalDocumentsTitle: "Optional Documents",
          optionalBadge: "Optional",
          documentRequirementsTitle: "Document Requirements",
          identityDocumentsTitle: "Identity Documents",
          identityRequirements: [
            "Government-issued photo ID (passport, driver's license)",
            "Must be valid and not expired",
            "Clear, high-resolution image",
            "All corners visible"
          ],
          financialDocumentsTitle: "Financial Documents",
          financialRequirements: [
            "Bank statements (last 3 months)",
            "Trading experience certification",
            "Proof of income source",
            "Professional qualifications (if applicable)"
          ],
          needHelpTitle: "Need Help?",
          needHelpBody: "If you have questions about the KYC process or need assistance with document upload, please contact our support team at {{email}} or use the chat support."
        },
        profileBranding: {
          title: "Profile & Branding",
          subtitle: "Customize your professional profile and build your personal brand"
        },
        companyAssociation: {
          title: "Company Association",
          subtitle: "Connect with companies to enhance your professional profile and access exclusive opportunities",
          viewDetails: "View Details"
        },
        coursesVideos: {
          title: "Courses & Videos",
          subtitle: "Create and manage educational courses with video lessons and interactive content",
          header: {
            create: "Create Course"
          },
          stats: {
            totalCourses: "Total Courses",
            totalStudents: "Total Students",
            totalRevenue: "Total Revenue",
            averageRating: "Avg Rating"
          },
          filters: {
            allCourses: "All Courses ({{count}})",
            published: "Published ({{count}})",
            draft: "Drafts ({{count}})",
            free: "Free ({{count}})",
            premium: "Premium ({{count}})",
            allCategories: "All Categories",
            allLevels: "All Levels"
          },
          searchPlaceholder: "Search courses by title or tags...",
          card: {
            statusPublished: "Published",
            statusDraft: "Draft",
            statusArchived: "Archived",
            freeBadge: "FREE",
            premiumBadge: "Premium",
            duration: "{{hours}}h {{minutes}}m",
            durationMinutesOnly: "{{minutes}}m",
            students: "Students",
            rating: "Rating",
            completion: "Completion",
            revenue: "Revenue",
            lessons: "{{count}} lessons",
            certificate: "Certificate",
            resources: "Resources",
            quiz: "Quiz",
            publishCourse: "Publish Course",
            viewLive: "View Live",
            editCourse: "Edit Course"
          },
          emptyState: {
            noCourses: "No courses yet",
            noCoursesFiltered: "No {{status}} courses",
            body: "Create your first course to start teaching and generating revenue.",
            bodyFiltered: "No {{status}} courses found. Try adjusting your filters.",
            createFirstCourse: "Create Your First Course"
          }
        },
        liveStreaming: {
          title: "Live Streaming",
          subtitle: "Stream live market analysis, educational content, and engage with your audience in real-time"
        },
        consultationBooking: {
          title: "Consultation Booking",
          subtitle: "Manage one-on-one consultations, group sessions, and educational workshops"
        },
        subscriberChat: {
          title: "Subscriber Chat",
          subtitle: "Real-time communication with your subscriber community"
        },
        discountCodes: {
          title: "Discount Codes",
          subtitle: "Create and manage promotional discount codes for your subscription packages"
        },
        referralSystem: {
          title: "Referral System",
          subtitle: "Manage referral codes, track transactions, and handle payouts",
          searchPlaceholder: "Search owners, codes, transactions...",
          tabs: {
            ownersBalances: "Owners & Balances",
            referralCodes: "Referral Codes",
            owedAmounts: "Owed Amounts",
            transferHistory: "Transfer History"
          },
          actions: {
            addOwner: "Add Owner",
            addOwedAmount: "Add Owed Amount",
            createReferralCode: "Create Referral Code"
          }
        },
        payoutDashboard: {
          title: "Payout Dashboard",
          subtitle: "Manage earnings, payout methods, and transaction history"
        },
        settings: {
          title: "Account Settings",
          subtitle: "Manage your platform subscription, profile, and account preferences"
        },
        privateAccess: {
          title: "Private Access Control",
          subtitle: "Manage profile visibility and secret access codes.",
          comingSoonTitle: "Private Access Management",
          comingSoonBody: "Coming soon - Set secret codes and control profile visibility."
        }
      }
    }
  },
  ar: {
    translation: {
      dashboard: {
        welcome: "مرحبًا بعودتك، {{name}}!",
        subtitleDemo: "إليك ما يحدث في نشاطك التجريبي اليوم.",
        subtitleAnalyst: "إليك ما يحدث في نشاطك التحليلي اليوم.",
        metrics: {
          activeSubscriptions: "الاشتراكات النشطة",
          activeSubscriptionsChange: "+12.5٪ عن الشهر الماضي",
          openSignals: "الإشارات المفتوحة",
          openSignalsChange: "تم إغلاق 3 اليوم",
          consultationBookings: "حجوزات الاستشارات",
          consultationBookingsChange: "5 حجوزات هذا الأسبوع",
          monthlyRevenue: "الإيراد الشهري",
          monthlyRevenueChange: "+8.2٪ عن الشهر الماضي"
        },
        charts: {
          subscriptionGrowthTitle: "نمو الاشتراكات",
          subscriptionGrowthSubtitle: "اكتساب المشتركين شهريًا",
          signalPerformanceTitle: "أداء الإشارات",
          signalPerformanceSubtitle: "نسبة النجاح مع الوقت",
          revenueBreakdownTitle: "تفصيل الإيرادات",
          revenueBreakdownSubtitle: "حسب نوع الخدمة",
          subscriberDistributionTitle: "توزيع المشتركين",
          subscriberDistributionSubtitle: "حسب نوع الاشتراك"
        },
        recentActivityTitle: "النشاط الأخير",
        recentActivity: {
          subscription: "مشترك جديد: الباقة المميزة",
          signal: "تم إغلاق إشارة: EUR/USD (+45 نقطة)",
          consultation: "تم حجز استشارة للغد",
          payout: "تم تنفيذ دفعة شهرية: 2,340$",
          ago2m: "منذ دقيقتين",
          ago1h: "منذ ساعة",
          ago3h: "منذ 3 ساعات",
          ago1d: "منذ يوم"
        },
        statistics: {
          title: "إحصائياتك",
          periodLabel: "16 نوفمبر - 16 ديسمبر 2024",
          periodFilter: "الشهر",
          earningsIncrease: "زيادة في الأرباح",
          activeGrowth: "نمو نشط",
          viewDetails: "عرض التفاصيل"
        },
        quickAction: "إجراء سريع",
        searchPlaceholder: "ابحث...",
        notificationsComingSoonTitle: "مركز الإشعارات",
        notificationsComingSoonSubtitle: "ابقَ على اطلاع على جميع تنبيهاتك وتحديثاتك المهمة.",
        notificationsComingSoonBody: "هذه الميزة قادمة قريبًا. ستتمكن من إدارة جميع إشعاراتك هنا."
      },
      common: {
        languageEnglish: "English",
        languageArabic: "العربية",
        languageCodeEnglish: "EN",
        languageCodeArabic: "AR"
      },
      sidebar: {
        sections: {
          dashboard: "لوحة التحكم",
          profileCompany: "الملف الشخصي والشركة",
          contentTrading: "المحتوى والتداول",
          educationLive: "التعليم والبث المباشر",
          communication: "التواصل",
          marketingRevenue: "التسويق والإيرادات"
        },
        dashboard: {
          overview: "نظرة عامة",
          notifications: "الإشعارات"
        },
        profile: {
          kycVerification: "التحقق من الهوية (KYC)",
          companyAssociation: "ربط الشركة",
          privateAccess: "وصول خاص",
          profileBranding: "الملف الشخصي والعلامة التجارية"
        },
        content: {
          subscriptionPackages: "باقات الاشتراك",
          signalCenter: "مركز الإشارات",
          signalMonitor: "مراقبة الإشارات",
          contentPublishing: "نشر المحتوى",
          newsCenter: "مركز الأخبار"
        },
        education: {
          coursesVideos: "الدورات والفيديوهات",
          liveStreaming: "البث المباشر",
          consultationBooking: "حجز الاستشارات"
        },
        communication: {
          subscriberChat: "دردشة المشتركين"
        },
        marketing: {
          discountCodes: "أكواد الخصم",
          referralSystem: "نظام الإحالات",
          payoutDashboard: "لوحة دفع العمولات"
        },
        settings: "الإعدادات",
        logout: "تسجيل الخروج",
        profileBadge: {
          demoAccount: "حساب تجريبي",
          professionalAnalyst: "محلل محترف",
          demoAccess: "وصول تجريبي",
          verified: "مُوثّق"
        }
      },
      pages: {
        activeSignals: {
          title: "مراقبة الإشارات النشطة",
          subtitle: "مراقبة لحظية مع اكتشاف المشكلات"
        },
        signalCenter: {
          title: "مركز الإشارات",
          subtitle: "إنشاء وإدارة ونشر إشاراتك مع مستويات جني أرباح متعددة",
          header: {
            create: "إنشاء إشارة"
          },
          stats: {
            totalSignals: "إجمالي الإشارات",
            activeSignals: "الإشارات النشطة",
            draftSignals: "الإشارات المسودة",
            closedSignals: "الإشارات المغلقة"
          },
          filters: {
            all: "كل الإشارات ({{count}})",
            active: "النشطة ({{count}})",
            draft: "المسودات ({{count}})",
            closed: "المغلقة ({{count}})"
          },
          searchPlaceholder: "ابحث عن الأزواج...",
          card: {
            riskSuffix: "مخاطرة",
            currentPnL: "الربح/الخسارة الحالية",
            tpLevelsTitle: "مستويات جني الأرباح ({{count}})",
            moreLevels: "+{{count}} مستويات أخرى",
            slLabel: "وقف الخسارة:",
            publishSignal: "نشر الإشارة",
            viewDetails: "عرض التفاصيل",
            createdOn: "تم الإنشاء في {{date}}",
            publishedOn: "تم النشر في {{date}}"
          },
          emptyState: {
            noSignals: "لا توجد إشارات بعد",
            noSignalsFiltered: "لا توجد إشارات {{status}}",
            body: "أنشئ أول إشارة تداول مع مستويات متعددة لجني الأرباح.",
            bodyFiltered: "لا توجد إشارات {{status}}. جرّب تعديل عوامل التصفية.",
            createFirstSignal: "أنشئ أول إشارة تداول"
          }
        },
        contentPublishing: {
          title: "نشر المحتوى",
          subtitle: "إنشاء وإدارة ونشر المحتوى التعليمي وتحليل الأسواق",
          header: {
            create: "إنشاء محتوى"
          },
          stats: {
            totalContent: "إجمالي المحتوى",
            published: "المحتوى المنشور",
            totalViews: "إجمالي المشاهدات",
            totalLikes: "إجمالي الإعجابات"
          },
          filters: {
            allContent: "كل المحتوى ({{count}})",
            published: "المنشور ({{count}})",
            draft: "المسودات ({{count}})",
            scheduled: "المجدول ({{count}})",
            archived: "المؤرشف ({{count}})",
            allCategories: "كل التصنيفات"
          },
          searchPlaceholder: "ابحث حسب العنوان أو الوسوم...",
          card: {
            minRead: "{{minutes}} دقيقة قراءة",
            premiumBadge: "مميز",
            views: "المشاهدات",
            likes: "الإعجابات",
            comments: "التعليقات",
            shares: "المشاركات",
            scheduled: "مجدول للنشر في {{date}} الساعة {{time}}",
            publishNow: "انشر الآن",
            viewPublished: "عرض المنشور",
            editContent: "تعديل المحتوى"
          },
          emptyState: {
            noContent: "لا يوجد محتوى بعد",
            noContentFiltered: "لا يوجد محتوى {{status}}",
            body: "أنشئ أول قطعة محتوى لمشاركة رؤاك مع جمهورك.",
            bodyFiltered: "لا يوجد محتوى {{status}}. جرّب تعديل عوامل التصفية.",
            createFirstContent: "أنشئ أول محتوى لك"
          }
        },
        newsCenter: {
          title: "مركز أخبار المحلل",
          subtitle: "أنشئ وأدر تحديثات الأخبار والتنبيهات السوقية والرؤى لمشتركيك",
          header: {
            create: "إنشاء خبر"
          },
          stats: {
            totalNews: "إجمالي الأخبار",
            published: "الأخبار المنشورة",
            totalViews: "إجمالي المشاهدات",
            subscribers: "المشتركين"
          },
          filters: {
            allNews: "كل الأخبار ({{count}})",
            published: "المنشور ({{count}})",
            draft: "المسودات ({{count}})",
            scheduled: "المجدول ({{count}})",
            breaking: "العاجلة ({{count}})",
            pinned: "المثبتة ({{count}})",
            allCategories: "كل التصنيفات",
            allPriorities: "كل الأولويات",
            urgent: "عاجل",
            high: "أولوية عالية",
            medium: "أولوية متوسطة",
            low: "أولوية منخفضة"
          },
          searchPlaceholder: "ابحث في الأخبار حسب العنوان أو الوسوم...",
          card: {
            breakingBadge: "خبر عاجل",
            pinnedBadge: "📌 مثبت",
            minRead: "{{minutes}} دقيقة قراءة",
            subscribers: "{{count}} مشتركًا",
            impactSuffix: "تأثير",
            affectedPairsTitle: "الأزواج المتأثرة",
            morePairs: "+{{count}} أخرى",
            moreTags: "+{{count}} أخرى",
            views: "المشاهدات",
            likes: "الإعجابات",
            comments: "التعليقات",
            shares: "المشاركات",
            scheduled: "مجدول للنشر في {{date}} الساعة {{time}}",
            publishNews: "نشر الخبر",
            viewLive: "عرض مباشر",
            editNews: "تعديل الخبر"
          },
          emptyState: {
            noNews: "لا توجد أخبار بعد",
            noNewsFiltered: "لا توجد أخبار {{status}}",
            body: "أنشئ أول خبر لمشاركة رؤاك حول السوق مع مشتركيك.",
            bodyFiltered: "لا توجد أخبار {{status}}. جرّب تعديل عوامل التصفية.",
            createFirstNews: "أنشئ أول خبر"
          }
        },
        subscriptionPackages: {
          title: "باقات الاشتراك",
          subtitle: "إنشاء وإدارة الباقات المدفوعة لخدماتك التحليلية",
          header: {
            create: "إنشاء باقة"
          },
          tabs: {
            overview: "نظرة عامة",
            packages: "الباقات",
            analytics: "التحليلات"
          },
          labels: {
            mostPopular: "الأكثر شيوعًا",
            active: "مفعّلة",
            inactive: "غير مفعّلة",
            keyFeatures: "الميزات الرئيسية",
            premiumBadge: "مميزة",
            moreFeatures: "+{{count}} مزيد من الميزات",
            subscribers: "المشتركين",
            revenue: "الإيراد",
            conversion: "معدل التحويل",
            modifiedOn: "تم التعديل في {{date}}",
            noPackagesTitle: "لا توجد باقات بعد",
            noPackagesBody: "أنشئ أول باقة اشتراك لبدء تحقيق الدخل من خدماتك التحليلية.",
            createFirstPackage: "إنشاء أول باقة"
          },
          overview: {
            performanceTitle: "أداء الباقات",
            recentActivityTitle: "النشاط الأخير",
            activity1: "مشترك جديد في باقة Professional",
            activity2: "تم تحديث باقة VIP Elite",
            activity3: "انتهت الفترة التجريبية لباقة Starter"
          },
          analytics: {
            totalRevenueTitle: "إجمالي الإيرادات",
            totalRevenueChange: "+{{value}}٪ هذا الشهر",
            totalSubscribersTitle: "إجمالي المشتركين",
            totalSubscribersSubtitle: "الاشتراكات النشطة",
            conversionRateTitle: "معدل التحويل",
            conversionRateSubtitle: "أعلى من متوسط السوق",
            arpuTitle: "متوسط الإيراد لكل مشترك",
            arpuSubtitle: "شهريًا",
            growthRateTitle: "معدل النمو",
            growthRateSubtitle: "النمو الشهري",
            churnRateTitle: "معدل الإلغاء",
            churnRateSubtitle: "الإلغاء الشهري",
            comingSoon: "رسوم بيانية وتقارير تحليلية تفصيلية قادمة قريبًا. ستتمكن من تتبع مسار التحويل، وقيمة عمر المشترك، وأداء الباقات مع مرور الوقت."
          }
        },
        kycVerification: {
          title: "التحقق من الهوية (KYC)",
          subtitle: "أكمل التحقق لفتح جميع مزايا المنصة",
          statusCardTitle: "حالة التحقق من الهوية",
          status: {
            approved: "تمت الموافقة - تم منح صلاحية كاملة",
            rejected: "مرفوض - مطلوب إجراء",
            under_review: "قيد المراجعة من قبل الإدارة",
            in_progress: "قيد التقدم - مستندات مطلوبة",
            not_started: "لم يبدأ بعد",
            unknown: "حالة غير معروفة"
          },
          completionProgress: "نسبة الاكتمال",
          timelineTitle: "الجدول الزمني",
          submittedLabel: "تم إرسال الطلب: {{date}}",
          reviewedLabel: "تمت المراجعة: {{date}}",
          nextStepsTitle: "الخطوات التالية",
          adminMessageLabel: "رسالة المسؤول:",
          headerCta: "رفع المستندات",
          requiredDocumentsTitle: "المستندات المطلوبة",
          requiredApprovedLabel: "{{approved}}/{{total}} تمت الموافقة عليها",
          optionalDocumentsTitle: "المستندات الاختيارية",
          optionalBadge: "اختياري",
          documentRequirementsTitle: "متطلبات المستندات",
          identityDocumentsTitle: "مستندات الهوية",
          identityRequirements: [
            "هوية حكومية تحتوي على صورة (جواز سفر، رخصة قيادة)",
            "يجب أن تكون سارية وغير منتهية الصلاحية",
            "صورة واضحة وعالية الدقة",
            "يجب أن تكون جميع الزوايا ظاهرة"
          ],
          financialDocumentsTitle: "المستندات المالية",
          financialRequirements: [
            "كشف حساب بنكي لآخر 3 أشهر",
            "شهادة خبرة في التداول",
            "إثبات مصدر الدخل",
            "المؤهلات المهنية (إن وجدت)"
          ],
          needHelpTitle: "تحتاج مساعدة؟",
          needHelpBody: "إذا كانت لديك أسئلة حول عملية التحقق (KYC) أو تحتاج مساعدة في رفع المستندات، يرجى التواصل مع فريق الدعم على {{email}} أو استخدام دعم المحادثة."
        },
        profileBranding: {
          title: "الملف الشخصي والعلامة التجارية",
          subtitle: "خصّص ملفك المهني وابنِ علامتك الشخصية"
        },
        companyAssociation: {
          title: "ربط الشركة",
          subtitle: "ارتبط بالشركات لتعزيز ملفك المهني والحصول على فرص حصرية",
          viewDetails: "عرض التفاصيل"
        },
        coursesVideos: {
          title: "الدورات والفيديوهات",
          subtitle: "أنشئ وأدر الدورات التعليمية مع دروس فيديو ومحتوى تفاعلي",
          header: {
            create: "إنشاء دورة"
          },
          stats: {
            totalCourses: "إجمالي الدورات",
            totalStudents: "إجمالي الطلاب",
            totalRevenue: "إجمالي الإيرادات",
            averageRating: "متوسط التقييم"
          },
          filters: {
            allCourses: "كل الدورات ({{count}})",
            published: "المنشورة ({{count}})",
            draft: "المسودات ({{count}})",
            free: "المجانية ({{count}})",
            premium: "المميزة ({{count}})",
            allCategories: "كل التصنيفات",
            allLevels: "كل المستويات"
          },
          searchPlaceholder: "ابحث عن الدورات حسب العنوان أو الوسوم...",
          card: {
            statusPublished: "منشورة",
            statusDraft: "مسودة",
            statusArchived: "مؤرشفة",
            freeBadge: "مجانية",
            premiumBadge: "مميزة",
            duration: "{{hours}} ساعة {{minutes}} دقيقة",
            durationMinutesOnly: "{{minutes}} دقيقة",
            students: "الطلاب",
            rating: "التقييم",
            completion: "معدل الإكمال",
            revenue: "الإيراد",
            lessons: "{{count}} درسًا",
            certificate: "شهادة",
            resources: "مواد إضافية",
            quiz: "اختبار",
            publishCourse: "نشر الدورة",
            viewLive: "عرض مباشر",
            editCourse: "تعديل الدورة"
          },
          emptyState: {
            noCourses: "لا توجد دورات بعد",
            noCoursesFiltered: "لا توجد دورات {{status}}",
            body: "أنشئ أول دورة لك لبدء التعليم وتحقيق الإيرادات.",
            bodyFiltered: "لا توجد دورات {{status}}. جرّب تعديل عوامل التصفية.",
            createFirstCourse: "أنشئ أول دورة لك"
          }
        },
        liveStreaming: {
          title: "البث المباشر",
          subtitle: "قم ببث التحليل المباشر والمحتوى التعليمي وتفاعل مع جمهورك في الوقت الفعلي"
        },
        consultationBooking: {
          title: "حجز الاستشارات",
          subtitle: "إدارة الاستشارات الفردية والجماعية وورش العمل التعليمية"
        },
        subscriberChat: {
          title: "دردشة المشتركين",
          subtitle: "تواصل فوري مع مجتمع المشتركين لديك"
        },
        discountCodes: {
          title: "أكواد الخصم",
          subtitle: "إنشاء وإدارة أكواد الخصم الترويجية لباقات الاشتراك"
        },
        referralSystem: {
          title: "نظام الإحالات",
          subtitle: "إدارة أكواد الإحالة وتتبع العمليات والدفعات",
          searchPlaceholder: "ابحث عن المالكين، الأكواد، العمليات...",
          tabs: {
            ownersBalances: "أصحاب الأكواد والأرصدة",
            referralCodes: "أكواد الإحالة",
            owedAmounts: "المبالغ المستحقة",
            transferHistory: "سجل التحويلات"
          },
          actions: {
            addOwner: "إضافة صاحب كود",
            addOwedAmount: "إضافة مبلغ مستحق",
            createReferralCode: "إنشاء كود إحالة"
          }
        },
        payoutDashboard: {
          title: "لوحة دفع العمولات",
          subtitle: "إدارة الأرباح وطرق الدفع وسجل التحويلات"
        },
        settings: {
          title: "إعدادات الحساب",
          subtitle: "إدارة اشتراكك في المنصة وملفك الشخصي وتفضيلات الحساب"
        },
        privateAccess: {
          title: "التحكم في الوصول الخاص",
          subtitle: "إدارة ظهور الملف الشخصي وأكواد الوصول السرية.",
          comingSoonTitle: "إدارة الوصول الخاص",
          comingSoonBody: "قريبًا - قم بتعيين أكواد سرية والتحكم في ظهور ملفك الشخصي."
        }
      }
    }
  }
} as const;

const isRtlLang = (lang: string) => lang.startsWith("ar");

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"]
    }
  });

// Handle RTL at the document level
i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    const dir = isRtlLang(lng) ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.lang = lng;
  }
});

export default i18n;


