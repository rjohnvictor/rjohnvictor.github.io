import { HERO } from './hero';

export const PERSONAL = {
    name: HERO.name,
    profileImage: 'https://avatars.githubusercontent.com/rjohnvictor?v=4',
    location: 'India',
    locationMapQuery: 'India',
    yearsExperience: 8,
    openTo: {
        enabled: false,
        roleKeys: [
            'seniorSoftwareEngineer',
            'staffEngineer',
            'platformEngineer',
            'solutionsEngineer',
        ],
    },
    email: 'johnvictor2406@gmail.com',
    github: 'https://github.com/rjohnvictor',
    linkedin: 'https://www.linkedin.com/in/r-john-victor-295a6382',
    profileCard: {
        backHeadingKey: 'profileData',
        roleKey: 'solutionsFullStackPlatform',
        frontTitleKey: 'solutionsEngineerL4',
        hobbyKeys: ['watchCollection', 'photography', 'watchAnime', 'gymming'],
        flipHintKey: 'hoverCardToFlip',
    },
};
