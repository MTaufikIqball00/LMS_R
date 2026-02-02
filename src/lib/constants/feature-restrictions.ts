// Feature restrictions for non-Jawa Barat users
export const RESTRICTED_FEATURES_FOR_NON_JABAR: Record<string, string[]> = {
    student: ["/tryout", "/forum", "/live-zoom"],
    teacher: ["/teacher/manajemen-tryout", "/teacher/forum", "/teacher/live-zoom"],
};

export const isFeatureRestricted = (
    role: string,
    province: string,
    pathname: string
): boolean => {
    if (province === "Jawa Barat") {
        return false;
    }

    const restrictedPaths = RESTRICTED_FEATURES_FOR_NON_JABAR[role] || [];
    return restrictedPaths.some((restrictedPath: string) =>
        pathname.startsWith(restrictedPath)
    );
};
