export class Constants {
    static USERS = {
        isar: {
            USERNAME: process.env.ISAR_EMAIL!,
            PASSWORD: process.env.ISAR_PASSWORD!,
        },
        automationUser: {
            USERNAME: process.env.AUTOMATION_USER_EMAIL!,
            PASSWORD: process.env.AUTOMATION_USER_PASSWORD!,
        },
        prodAutomationUser: {
            USERNAME: process.env.PROD_AUTOMATION_USER_EMAIL!,
            PASSWORD: process.env.PROD_AUTOMATION_USER_PASSWORD!,
        },
        armen: {
            USERNAME: process.env.ARMEN_EMAIL!,
            PASSWORD: process.env.ARMEN_PASSWORD!,
        },
        testEmail: {
            USERNAME: 'testcan@yopmail.com',
            PHONE: '+952154684671',
            FIRSTNAME: 'automation',
            LASTNAME: 'user'
        },
        existingCandidate: {
            USERNAME: 'testcandidate@enginehire.ca',
            PASSWORD: 'Newpassword125'
        },
        stagingAutomationUser: {
            USERNAME: process.env.STAGING_AUTOMATION_USER!,
            PASSWORD: process.env.STAGING_AUTOMATION_PASSWORD!,
        },
    };

    static MESSAGE: string[] = [];

    static generateRandomEmail(): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        const length = 10;
        const emailDomain = '@gmail.com';
        const randomString = Array.from({ length }, () =>
            characters[Math.floor(Math.random() * characters.length)],
        ).join('');
        return `${randomString}${emailDomain}`;
    }

    static randStr(): string {
        return Math.random().toString(36).substring(2, 6);
    }

    static rand(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static generateRandomPhoneNumber(): string {
        const prefix = '1';
        const digitsNeeded = 10;
        let phoneNumber = prefix;
        for (let i = 0; i < digitsNeeded; i++) phoneNumber += Math.floor(Math.random() * 10);
        return phoneNumber;
    }

    static getLoginConfig(projectOrEnv?: string) {
        const raw = (projectOrEnv ?? '').toLowerCase();

        const envKey =
            raw === 'production' || raw.includes('production') ? 'PROD' :
                raw === 'local'      || raw.includes('local')      ? 'LOCAL' :
                    raw === 'dev'        || raw.includes('dev')        ? 'DEV' :
                        raw ? 'STAGING'
                            : (process.env.APP_ENV?.toUpperCase() === 'PRODUCTION' ? 'PROD'
                                : process.env.APP_ENV?.toUpperCase() === 'LOCAL'       ? 'LOCAL'
                                    : process.env.APP_ENV?.toUpperCase() === 'DEV'         ? 'DEV'
                                        : 'STAGING');

        // Load login path ID
        const loginId =
            process.env[`LOGIN_PATH_ID_${envKey}`] ??
            (envKey === 'PROD'  ? process.env.LOGIN_PATH_ID_PROD  :
                envKey === 'LOCAL' ? process.env.LOGIN_PATH_ID_LOCAL :
                    envKey === 'DEV'   ? process.env.LOGIN_PATH_ID_DEV   :
                        process.env.LOGIN_PATH_ID_STAGING);

        // Load username
        const username =
            process.env[`AUTOMATION_USER_EMAIL_${envKey}`] ??
            (envKey === 'PROD' ? process.env.PROD_AUTOMATION_USER_EMAIL :
                envKey === 'DEV'  ? process.env.DEV_AUTOMATION_USER_EMAIL  :
                    process.env.AUTOMATION_USER_EMAIL);

        // Load password
        const password =
            process.env[`AUTOMATION_USER_PASSWORD_${envKey}`] ??
            (envKey === 'PROD' ? process.env.PROD_AUTOMATION_USER_PASSWORD :
                envKey === 'DEV'  ? process.env.DEV_AUTOMATION_USER_PASSWORD  :
                    process.env.AUTOMATION_USER_PASSWORD);

        return {
            loginPath: `/login/${loginId}`,
            credentials: { USERNAME: username!, PASSWORD: password! },
        };
    }

    static genNewName() {
        const randInt: string = Math.floor(Math.random() * 100).toString();
        return `Application for job${randInt}`;
    }

    static candidatePageUrl = "https://armendemo.enginehire.io/candidates/bjNLmgK6w20XDM2K";

    static PlacementFormData = {
        email: 'testuser@enginehire.ca',
        clientIndex: 2,
        jobTitle: 'Nanny for Infant Twins',
        address: '456 Elm Street',
        city: 'Los Angeles',
        country: 'USA',
        state: 'California',
        zip: 90001,
        compensation: '$25/hour',
        startDate: '2025-07-15',
        children: '2 infants, 6 months old',
        schedule: 'Monday–Friday, 8am–5pm',
        caregiverQualities: 'Caring, patient, CPR-certified',
        tasks: 'Feeding, diapering, playtime, light housekeeping',
        comment: 'Family has a small dog; must be comfortable with pets'
    }


    jobTriggerTestData: string[] = [
        'Status Change Notification',
        'Placement Job Status Change Notification',
        'Placement Job Broadcast',
        'Bulk Email Placement Job Applicant',
        'Shift Job Broadcast',
        'Placement Job Bulk Broadcast',
        'Shift Job Bulk Broadcast',
        'Candidate Booking Confirmation',
        'Client Booking Confirmation',
        'Client Self Booking Confirmation',
        'Shift Job Updated Candidate Notification',
        'Bright Horizons Case Successfully Staffed Candidate Notification',
        'Shift Job Accepted Candidate Notification',
        'Shift Job Declined Candidate Notification',
        'Shift Job Accepted Client Notification',
        'Shift Job Declined Client Notification',
        'Shift Job Report Client Notification',
        'Shift Job Mark as Completed Client Notification',
        'Shift Job Accepted Admin Notification',
        'Shift Job Status Change Admin Notification',
        'Shift Job Created Admin Notification',
        'Shift Job Auto Assignment Admin Notification',
        'Shift Job Interested Admin Notification',
        'Shift Job MAYBE Interested Admin Notification',
        'Shift Job Cancelled Admin Notification',
        'Shift Job Interested Client Notification',
        'Shift Job Unassigned Candidate Notification',
        'Shift Job Unassigned Client Notification',
        'Shift Job Candidate Reminder',
        'Shift Job Client Reminder',
        'Unfilled Shift Job Client Reminder',
        'Unfilled Shift Job Admin Reminder',
        'Shift Job Clock In Reminder',
        'Shift Job Clock Out Reminder',
        'Shift Job Tipping Notification',
        'Shift Job Status Reminder',
        'Payment Information Poster Reminder',
        'Placement Job Application Status Reminder',
        'Application Status Change Candidate Notification',
        'Application Status Change Client Notification',
        'Automatically Broadcast new Shift Job',
        'Automatically Broadcast new Shift Job to Favorite',
        'Automatically Rebroadcast Shift Job',
        'Notification of New Backup Care Assistant Jobs',
        'Bulk Assign Candidate Confirmation',
        'Bulk Assign Client Confirmation',
        'Complete Associated Bookings Client Notification',
        'Job Charged Client Notification',
        'Job Charge Failed Client Notification',
        'Job Charged Candidate Notification',
        'Job Cancel Charged Client Notification',
        'Job Cancel Charged Candidate Notification',
        'Job Assigned To Other Candidate Applicant Notification',
        'Placement Job Application Interested Client Notification',
        'Placement Job Applicant Added Candidate Notification',
        'Shift Job Declined Admin Notification',
        'Client Left Star Review',
        'Candidate Left Star Review'
    ]

}
