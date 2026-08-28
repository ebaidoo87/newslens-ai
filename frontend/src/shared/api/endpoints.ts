export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
    password: "/auth/password",
    logoutAll: "/auth/logout-all",
  },

  articles: {
    list: "/articles",

    detail: (
      articleId: number,
    ) =>
      `/articles/${articleId}`,
  },

  bookmarks: {
    list: "/bookmarks",

    add: (
      articleId: number,
    ) =>
      `/bookmarks/${articleId}`,

    remove: (
      articleId: number,
    ) =>
      `/bookmarks/${articleId}`,

    check: (
      articleId: number,
    ) =>
      `/bookmarks/check/${articleId}`,
  },

  history: {
    list: "/history",

    record: (
      articleId: number,
    ) =>
      `/history/${articleId}`,

    clear: "/history",
  },

  preferences: {
    root: "/preferences",
  },

  notifications: {
    list: "/notifications",
    count: "/notifications/count",
    readAll: "/notifications/read-all",
    deleteRead: "/notifications/read",

    markRead: (
      notificationId: number,
    ) =>
      `/notifications/${notificationId}/read`,

    deleteOne: (
      notificationId: number,
    ) =>
      `/notifications/${notificationId}`,
  },

  admin: {
    dashboard: "/admin/dashboard",
    userStats: "/admin/users/stats",
    systemHealth: "/admin/system/health",
    emailStats: "/admin/email/stats",
    emailRecent: "/admin/email/recent",
    analyticsSummary:
      "/admin/analytics/summary",

    users: "/admin/users",

    userRole: (
      userId: number,
    ) =>
      `/admin/users/${userId}/role`,

    userStatus: (
      userId: number,
    ) =>
      `/admin/users/${userId}/status`,

    userPassword: (
      userId: number,
    ) =>
      `/admin/users/${userId}/password`,

    userDelete: (
      userId: number,
    ) =>
      `/admin/users/${userId}`,

    audit: "/admin/audit",
    auditStats: "/admin/audit/stats",
    auditRecent: "/admin/audit/recent",
  },

  discovery: "/discover",
  recommendations: "/recommendations",
  trending: "/trending",
} as const;